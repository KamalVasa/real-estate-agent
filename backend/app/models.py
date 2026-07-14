from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True)
    listing_type: Mapped[str] = mapped_column(String(20), default="Sale", index=True)
    property_type: Mapped[str] = mapped_column(String(40), default="Flat", index=True)
    society_name: Mapped[str] = mapped_column(String(160), index=True)
    area: Mapped[str] = mapped_column(String(80), index=True)
    bhk: Mapped[int] = mapped_column(Integer, default=0, index=True)
    price: Mapped[float] = mapped_column(Float, index=True)
    carpet_area: Mapped[int] = mapped_column(Integer)
    floor: Mapped[str] = mapped_column(String(50))
    furnished: Mapped[str] = mapped_column(String(50))
    station_distance: Mapped[str] = mapped_column(String(100))
    amenities: Mapped[list[str]] = mapped_column(JSON, default=list)
    image_urls: Mapped[list[str]] = mapped_column(JSON, default=list)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="Available", index=True)
    views: Mapped[int] = mapped_column(Integer, default=0)


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True)
    intent: Mapped[str] = mapped_column(String(20), default="Buy", index=True)
    name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20), index=True)
    budget: Mapped[float | None] = mapped_column(Float, nullable=True)
    preferred_area: Mapped[str | None] = mapped_column(String(80), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="new", index=True)
    source: Mapped[str | None] = mapped_column(String(160), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
