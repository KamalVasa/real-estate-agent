import os

os.environ["DATABASE_URL"] = "sqlite:///./test_realestate.db"

from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


client = TestClient(app)


def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def sample_property():
    return {
        "society_name": "Test Society", "area": "Thakurli", "bhk": 2,
        "price": 8000000, "carpet_area": 650, "floor": "5th",
        "furnished": "Unfurnished", "station_distance": "10 min walk",
        "amenities": ["Parking"], "image_urls": [], "featured": True,
    }


def test_property_crud_and_filtering():
    created = client.post("/properties", json=sample_property())
    assert created.status_code == 201
    property_id = created.json()["id"]
    assert client.get("/properties?area=Thakurli&bhk=2&max_price=9000000").json()[0]["id"] == property_id

    updated = client.put(f"/properties/{property_id}", json={"price": 7750000})
    assert updated.json()["price"] == 7750000
    assert client.delete(f"/properties/{property_id}").status_code == 204
    assert client.get(f"/properties/{property_id}").status_code == 404


def test_lead_crud():
    created = client.post("/leads", json={"name": "A Buyer", "phone": "9876543210", "preferred_area": "Dombivli East"})
    assert created.status_code == 201
    lead_id = created.json()["id"]
    assert created.json()["status"] == "new"

    updated = client.put(f"/leads/{lead_id}", json={"status": "contacted"})
    assert updated.json()["status"] == "contacted"
    assert len(client.get("/leads?status=contacted").json()) == 1
