export type Property = {
  id: number;
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
};
