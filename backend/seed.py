from app.database import Base, SessionLocal, engine
from app.models import Property


PROPERTIES = [
    {
        "society_name": "Lodha Palava Lakeshore", "area": "Dombivli East", "bhk": 2,
        "price": 7200000, "carpet_area": 686, "floor": "12th of 22", "furnished": "Semi-furnished",
        "station_distance": "15 min by road", "amenities": ["Clubhouse", "Pool", "Garden", "Security"],
        "image_urls": ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"],
        "featured": True, "description": "Airy family home with open views and a full-service township lifestyle."
    },
    {
        "society_name": "Runwal Gardens", "area": "Dombivli East", "bhk": 1,
        "price": 5450000, "carpet_area": 465, "floor": "8th of 24", "furnished": "Unfurnished",
        "station_distance": "12 min by road", "amenities": ["Gym", "Kids area", "Jogging track", "Security"],
        "image_urls": ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"],
        "featured": True, "description": "Efficient apartment in a connected community, ideal for a first home."
    },
    {
        "society_name": "Balaji Sarvoday", "area": "Thakurli", "bhk": 2,
        "price": 8900000, "carpet_area": 705, "floor": "6th of 18", "furnished": "Fully furnished",
        "station_distance": "8 min walk", "amenities": ["Gym", "Temple", "CCTV", "Parking"],
        "image_urls": ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"],
        "featured": True, "description": "Ready-to-move home close to Thakurli station."
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.query(Property).count():
            print("Properties already exist; skipping seed.")
            return
        db.add_all(Property(**data) for data in PROPERTIES)
        db.commit()
        print(f"Added {len(PROPERTIES)} properties.")


if __name__ == "__main__":
    seed()
