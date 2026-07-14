from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PropertyBase(BaseModel):
    listing_type: str = "Sale"
    property_type: str = "Flat"
    society_name: str
    area: str
    bhk: int = Field(default=0, ge=0, le=10)
    price: float = Field(gt=0)
    carpet_area: int = Field(gt=0)
    floor: str
    furnished: str
    station_distance: str
    amenities: list[str] = Field(default_factory=list)
    image_urls: list[str] = Field(default_factory=list)
    featured: bool = False
    description: str | None = None
    status: str = "Available"
    views: int = 0
    negotiable: bool = False


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    listing_type: str | None = None
    property_type: str | None = None
    society_name: str | None = None
    area: str | None = None
    bhk: int | None = Field(default=None, ge=0, le=10)
    price: float | None = Field(default=None, gt=0)
    carpet_area: int | None = Field(default=None, gt=0)
    floor: str | None = None
    furnished: str | None = None
    station_distance: str | None = None
    amenities: list[str] | None = None
    image_urls: list[str] | None = None
    featured: bool | None = None
    description: str | None = None
    status: str | None = None
    negotiable: bool | None = None


class PropertyOut(PropertyBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class LeadCreate(BaseModel):
    intent: str = "Buy"
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=10, max_length=20)
    budget: float | None = Field(default=None, ge=0)
    preferred_area: str | None = None
    source: str | None = None


class LeadUpdate(BaseModel):
    intent: str | None = None
    name: str | None = None
    phone: str | None = None
    budget: float | None = Field(default=None, ge=0)
    preferred_area: str | None = None
    status: str | None = None
    source: str | None = None


class LeadOut(LeadCreate):
    id: int
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class MarketingContent(BaseModel):
    instagram_caption: str
    facebook_post: str
    whatsapp_status: str
    reel_script: str
    property_description: str
