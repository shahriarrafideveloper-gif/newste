
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'MEN' | 'WOMEN';
  sizes: string[];
  launchDate: string; // ISO string for countdown
}

export interface OrderData {
  name: string;
  phone: string;
  size: string;
  district: string;
  thana: string;
  note?: string;
  productId: string;
  timestamp: string;
}

export interface ConfirmedOrder {
  id: string;
  productName: string;
  price: number;
  timestamp: number;
  expiryTime: number;
}

export interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date: string;
}

export interface District {
  id: string;
  name: string; // In Bangla
}

export interface Thana {
  id: string;
  districtId: string;
  name: string; // In Bangla
}
