// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  DocumentData,
  collection,
  CollectionReference,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAf0ZhVcr-lQ0sChxqtKfq-srktslGQ74s",
  authDomain: "next-artwork-shop.firebaseapp.com",
  projectId: "next-artwork-shop",
  storageBucket: "next-artwork-shop.appspot.com",
  messagingSenderId: "722411743807",
  appId: "1:722411743807:web:58fc3d75743988b929a68a",
  measurementId: "G-G7NWM62TP4",
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(FirebaseApp);
export const db = getFirestore(FirebaseApp);
export const storage = getStorage(FirebaseApp);

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

export interface CartItem {
  artworkId: string;
  quantity: number;
  userId: string;
}

export interface Artwork {
  artworkName: string;
  artworkPath: string;
  artworkRatio: number;
  createdAt: string;
  description: string;
  discountRate: number;
  generatorId: string;
  price: number;
  prompt: string;
  userId: string;
}

export interface User {
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface OrderItem {
  artworkId: string;
  quantity: number;
  userId: string;
  price: number;
  discountRate: number;
  amount: number;
}

export type WithId<T> = T & { id: string };

export type OrderStatus = "pending" | "completed";

export interface Order {
  userId: string;
  totalAmount: number;
  createdAt: string;
  itemIds: string[];
  status: OrderStatus;
}

export const cartCollection = createCollection<CartItem>("cart");
export const artworkCollection = createCollection<Artwork>("artworks");
export const userCollection = createCollection<User>("users");
export const orderCollection = createCollection<Order>("orders");
export const orderItemCollection = createCollection<OrderItem>("orderItems");

export default FirebaseApp;
