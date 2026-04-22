export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  color: string;
  size: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: string[];
};

export type LoadProductOptions = {
  containerSelector: string;
  blockSelector: string;
  skip: number;
  limit: number;
  random: boolean;
  sizeFilter: string;
  colorFilter: string;
  categoryFilter: string;
  saleFilter: boolean;
  nameFilter: string;
  sortBy?: string;
  onTotal?: (total: number) => void;
}

export type Cart = Record<string, number>;