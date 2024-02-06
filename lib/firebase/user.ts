import {
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db, userCollection } from "./index";

export interface UserDto {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

const createUser = async (userDto: UserDto) => {
  const { id, ...user } = userDto;
  await setDoc(doc(db, "users", id), {
    ...user,
    avatar:
      userDto.avatar ||
      "https://firebasestorage.googleapis.com/v0/b/next-artwork-shop.appspot.com/o/blank-profile-s96.webp?alt=media&token=279b2b72-a60c-4fc6-afb4-b809d9fd1d2a",
    createdAt: serverTimestamp(),
  });

  return user;
};

const fetchUser = async (userId: string) => {
  const userDoc = await getDoc(doc(userCollection, userId));
  if (!userDoc.exists()) {
    return null;
  }
  const userData = {
    id: userDoc.id,
    ...userDoc.data(),
  };

  return userData;
};

const fetchCurrentUser = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User is not logged in");
  }

  const user = await fetchUser(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const fetchUserCart = async (userId: string) => {
  const querySnapshot = await getDocs(collection(db, "users", userId, "cart"));
  const cart = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return cart;
};

const UserService = {
  createUser,
  fetchUser,
  fetchUserCart,
  fetchCurrentUser,
};

export default UserService;
