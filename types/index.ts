export interface BrandAssets {
  logo?: string;
  colors: string[];
  style: string;
  seed: number;
}

export interface Flyer {
  id: string;
  imageUrl: string;
  isFavorite: boolean;
  eventName: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface AppData {
  brand: BrandAssets;
  flyers: Flyer[];
}
