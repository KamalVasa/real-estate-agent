import json
from hmac import compare_digest

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, engine, get_db
from .marketing import generate_marketing_content
from .models import Lead, Property
from .schemas import (
    LeadCreate, LeadOut, LeadUpdate, MarketingContent,
    PropertyCreate, PropertyOut, PropertyUpdate,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dombivli Property AI API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


def require_admin(x_admin_token: str | None = Header(default=None)):
    if not settings.admin_token:
        return
    if not x_admin_token or not compare_digest(x_admin_token, settings.admin_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin token")


@app.get("/health")
def health():
    return {"status": "ok"}


import shutil
import uuid
from supabase import create_client, Client

@app.post("/upload-image", dependencies=[Depends(require_admin)])
async def upload_image(file: UploadFile = File(...)):
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{file_ext}"

    if settings.supabase_url and settings.supabase_key:
        try:
            supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
            try:
                supabase.storage.get_bucket("properties")
            except Exception:
                supabase.storage.create_bucket("properties", {"public": True})
            
            file_data = await file.read()
            supabase.storage.from_("properties").upload(
                path=unique_filename,
                file=file_data,
                file_options={"content-type": file.content_type}
            )
            public_url = supabase.storage.from_("properties").get_public_url(unique_filename)
            return {"url": public_url}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Supabase upload failed: {str(e)}")
    else:
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
        
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"url": f"{settings.frontend_url.replace('3000', '8000')}/uploads/{unique_filename}"}


@app.post("/properties", response_model=PropertyOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_property(payload: PropertyCreate, db: Session = Depends(get_db)):
    property_record = Property(**payload.model_dump())
    db.add(property_record)
    db.commit()
    db.refresh(property_record)
    return property_record


@app.get("/properties", response_model=list[PropertyOut])
def list_properties(
    area: str | None = None,
    listing_type: str | None = None,
    property_type: str | None = None,
    bhk: int | None = Query(default=None, ge=1),
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    featured: bool | None = None,
    db: Session = Depends(get_db),
):
    query = select(Property)
    if area:
        query = query.where(Property.area == area)
    if listing_type:
        query = query.where(Property.listing_type == listing_type)
    if property_type:
        query = query.where(Property.property_type == property_type)
    if bhk:
        query = query.where(Property.bhk == bhk)
    if min_price is not None:
        query = query.where(Property.price >= min_price)
    if max_price is not None:
        query = query.where(Property.price <= max_price)
    if featured is not None:
        query = query.where(Property.featured == featured)
    return db.scalars(query.order_by(Property.featured.desc(), Property.id.desc())).all()


def get_property_or_404(property_id: int, db: Session) -> Property:
    property_record = db.get(Property, property_id)
    if not property_record:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_record


@app.get("/properties/{property_id}", response_model=PropertyOut)
def get_property(property_id: int, db: Session = Depends(get_db)):
    return get_property_or_404(property_id, db)


@app.put("/properties/{property_id}", response_model=PropertyOut, dependencies=[Depends(require_admin)])
def update_property(property_id: int, payload: PropertyUpdate, db: Session = Depends(get_db)):
    property_record = get_property_or_404(property_id, db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(property_record, key, value)
    db.commit()
    db.refresh(property_record)
    return property_record


@app.post("/properties/{property_id}/view", response_model=PropertyOut)
def increment_property_views(property_id: int, db: Session = Depends(get_db)):
    property_record = get_property_or_404(property_id, db)
    property_record.views += 1
    db.commit()
    db.refresh(property_record)
    return property_record


@app.delete("/properties/{property_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_property(property_id: int, db: Session = Depends(get_db)):
    db.delete(get_property_or_404(property_id, db))
    db.commit()


@app.post("/properties/{property_id}/marketing", response_model=MarketingContent, dependencies=[Depends(require_admin)])
def create_marketing_content(property_id: int, db: Session = Depends(get_db)):
    property_record = get_property_or_404(property_id, db)
    try:
        return generate_marketing_content(PropertyOut.model_validate(property_record))
    except (ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/leads", response_model=LeadOut, status_code=status.HTTP_201_CREATED)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(**payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@app.get("/leads", response_model=list[LeadOut], dependencies=[Depends(require_admin)])
def list_leads(lead_status: str | None = Query(default=None, alias="status"), db: Session = Depends(get_db)):
    query = select(Lead)
    if lead_status:
        query = query.where(Lead.status == lead_status)
    return db.scalars(query.order_by(Lead.created_at.desc())).all()


def get_lead_or_404(lead_id: int, db: Session) -> Lead:
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@app.put("/leads/{lead_id}", response_model=LeadOut, dependencies=[Depends(require_admin)])
def update_lead(lead_id: int, payload: LeadUpdate, db: Session = Depends(get_db)):
    lead = get_lead_or_404(lead_id, db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(lead, key, value)
    db.commit()
    db.refresh(lead)
    return lead


@app.delete("/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    db.delete(get_lead_or_404(lead_id, db))
    db.commit()
