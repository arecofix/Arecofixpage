export interface iProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  slug?: string;
  category?: string;
  // Agrega otras propiedades según necesites
}