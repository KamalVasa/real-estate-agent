export type Property = {
  id: number;
  listing_type?: string;
  property_type?: string;
  society_name: string;
  area: string;
  bhk: number;
  price: number;
  carpet_area: number;
  floor: string;
  furnished: string;
  station_distance: string;
  amenities: string[];
  image_urls: string[];
  featured?: boolean;
  description?: string;
  status?: string;
  views?: number;
  negotiable?: boolean;
};

export type PropertyForm = Omit<Property, "id"> & { id?: number; status?: string; views?: number; };
