import json from "@/DummyData.json";

export interface CartItem {
  id: number;
  quantity: number;
  item: Pick<Artwork, "id" | "title" | "price" | "image">;
}

interface Artwork {
  id: number;
  title: string;
  prompt: string;
  generator: string;
  price: number;
  image: Image;
  user: User;
}

interface User {
  id: number;
  username: string;
  avatar: string;
  email: string;
}

interface Image {
  url: string;
  width: number;
  height: number;
  ratio: number;
}

const data = json.data;

export const ARTWORK_LIST = Array(100)
  .fill(0)
  .map((_, index) => {
    return {
      ...data[index % data.length],
      id: index,
    } as Artwork;
  });

export const CART_ITEMS: CartItem[] = json.cart;

export const USER = json.user;

export const MY_ARTWORKS = Array(10)
  .fill(0)
  .map((_, index) => {
    return {
      ...data[index % data.length],
      id: index,
    } as Artwork;
  });

export const AI_GENERATORS = json.ai_generators;
