import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Artwork, CartItem, auth, cartCollection } from "./index";
import ArtworkService from "./artwork";

interface CartItemWithArtwork extends CartItem {
  id: string;
  artwork: Artwork & { id: string };
}

const fetchCartAll = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const q = query(cartCollection, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const cart = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    const artworks = await Promise.all(
      cart.map((cartItem) =>
        ArtworkService.fetchArtworkById(cartItem.artworkId),
      ),
    );

    const cartWithArtwork = cart
      .map((cartItem, index) => {
        return {
          ...cartItem,
          artwork: artworks[index],
        };
      })
      .filter((cartItem) => cartItem.artwork !== null) as CartItemWithArtwork[];

    return cartWithArtwork;
  } catch (error) {
    throw new Error("Error fetching cart");
  }
};

const createCartItem = async (artworkId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const docRef = await addDoc(cartCollection, {
      artworkId,
      quantity: 1,
      userId,
    });

    const cartItemSnap = await getDoc(docRef);
    if (!cartItemSnap.exists()) {
      throw new Error("Error creating cart item");
    }

    const cartItem = {
      id: docRef.id,
      ...cartItemSnap.data(),
    };

    return cartItem;
  } catch (error) {
    throw new Error("Error creating cart item");
  }
};

const removeCartItem = async (cartItemId: string) => {
  try {
    await deleteDoc(doc(cartCollection, cartItemId));
  } catch (error) {
    throw new Error("Error removing cart item");
  }
};

const removeCartItemByArtworkId = async (userId: string, artworkId: string) => {
  try {
    const q = query(
      cartCollection,
      where("userId", "==", userId),
      where("artworkId", "==", artworkId),
    );
    const querySnapshot = await getDocs(q);
    Promise.all(
      querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      }),
    );

    return querySnapshot.docs[0].id;
  } catch (error) {
    throw new Error("Error removing cart item");
  }
};

const CartService = {
  fetchCartAll,
  createCartItem,
  removeCartItem,
  removeCartItemByArtworkId,
};

export default CartService;
