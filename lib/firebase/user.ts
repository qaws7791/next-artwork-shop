import {
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db, userCollection } from "./index";
import StorageService from "./storage";
import { updateProfile } from "firebase/auth";

export interface UserDto {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface UserProfileDto {
  username: string;
  avatar?: File | null;
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

const updateUserProfile = async (userProfileDto: UserProfileDto) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User is not logged in");
  }
  const file = userProfileDto.avatar;

  const avatar = file
    ? await StorageService.uploadAvatar(file)
    : currentUser.photoURL ||
      "https://firebasestorage.googleapis.com/v0/b/next-artwork-shop.appspot.com/o/blank-profile-s96.webp?alt=media&token=279b2b72-a60c-4fc6-afb4-b809d9fd1d2a";

  try {
    await Promise.all([
      updateProfile(currentUser, {
        displayName: userProfileDto.username,
        photoURL: avatar,
      }),
      updateDoc(doc(userCollection, currentUser.uid), {
        username: userProfileDto.username,
        avatar,
      }),
    ]);
  } catch (error) {
    console.log(error);
    throw new Error("Error updating user profile");
  }

  return {
    username: userProfileDto.username,
    avatar,
  };
};

const UserService = {
  createUser,
  fetchUser,
  fetchUserCart,
  fetchCurrentUser,
  updateUserProfile,
};

export default UserService;
