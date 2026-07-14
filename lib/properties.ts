import { Property } from "./types";

export const demoProperties: Property[] = [
  {
    property_type: "Flat",
    id: 1, society_name: "Lodha Palava Lakeshore", area: "Dombivli East", bhk: 2,
    price: 7200000, carpet_area: 686, floor: "12th of 22", furnished: "Semi-furnished",
    station_distance: "15 min by road", amenities: ["Clubhouse", "Pool", "Garden", "Security"],
    image_urls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"], featured: true,
    description: "Airy family home with open views, modern finishes and access to a full-service township lifestyle."
  },
  {
    property_type: "Flat",
    id: 2, society_name: "Runwal Gardens", area: "Dombivli East", bhk: 1,
    price: 5450000, carpet_area: 465, floor: "8th of 24", furnished: "Unfurnished",
    station_distance: "12 min by road", amenities: ["Gym", "Kids area", "Jogging track", "Security"],
    image_urls: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"], featured: true,
    description: "Efficient new-generation apartment in a well-connected community, ideal for a first home or investment."
  },
  {
    property_type: "Flat",
    id: 3, society_name: "Balaji Sarvoday", area: "Thakurli", bhk: 2,
    price: 8900000, carpet_area: 705, floor: "6th of 18", furnished: "Fully furnished",
    station_distance: "8 min walk", amenities: ["Gym", "Temple", "CCTV", "Parking"],
    image_urls: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"], featured: true,
    description: "Ready-to-move home close to Thakurli station with thoughtful storage and a calm residential setting."
  },
  {
    property_type: "Flat",
    id: 4, society_name: "Regency Anantam", area: "Dombivli East", bhk: 2,
    price: 8100000, carpet_area: 640, floor: "15th of 27", furnished: "Unfurnished",
    station_distance: "10 min by road", amenities: ["Pool", "Sports court", "Library", "Garden"],
    image_urls: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"],
    description: "A bright high-floor home in a sought-after development with extensive recreation spaces."
  },
  {
    property_type: "Flat",
    id: 5, society_name: "Happy Home Sarvodaya", area: "Dombivli West", bhk: 1,
    price: 4900000, carpet_area: 420, floor: "4th of 12", furnished: "Semi-furnished",
    station_distance: "9 min by road", amenities: ["Parking", "Security", "Garden", "Power backup"],
    image_urls: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"],
    description: "Well-kept compact home with excellent everyday access to markets, schools and transport."
  },
  {
    property_type: "Shop",
    id: 6, society_name: "Metro Grande", area: "Thakurli", bhk: 3,
    price: 13500000, carpet_area: 980, floor: "10th of 20", furnished: "Semi-furnished",
    station_distance: "6 min walk", amenities: ["Gym", "Clubhouse", "Parking", "CCTV"],
    image_urls: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"],
    description: "Street-facing commercial shop option for buyers who want visibility near a growing residential belt."
  }
];

export async function getProperties(): Promise<Property[]> {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return demoProperties;
  try {
    const response = await fetch(`${url}/properties`, { cache: 'no-store' });
    if (!response.ok) throw new Error("API unavailable");
    return response.json();
  } catch {
    return demoProperties;
  }
}

export async function getProperty(id: number): Promise<Property | undefined> {
  const properties = await getProperties();
  return properties.find((property) => property.id === id);
}

export const formatPrice = (price: number, listingType?: string) => {
  if (listingType === "Rent") {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price) + " / mo";
  }
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  return `₹${(price / 100000).toFixed(1).replace(/\.0$/, "")} L`;
};
