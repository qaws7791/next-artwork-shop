import {
  UploadMetadata,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, storage } from "./index";
import { nanoid } from "nanoid";
import { convertImagePathToHostedUrl } from "../utils";

const uploadImage = async (file: File) => {
  const storageRef = ref(storage, `images/${Date.now()}-${nanoid()}`);

  try {
    const result = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading image");
  }
};

const uploadAvatar = async (file: File) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User is not logged in");
  }

  const metadata: UploadMetadata = {
    customMetadata: {
      owner: userId,
    },
  };

  const storageRef = ref(storage, `avatars/${Date.now()}-${nanoid()}`);

  try {
    await uploadBytes(storageRef, file, metadata);
    return convertImagePathToHostedUrl(storageRef.fullPath);
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading avatar");
  }
};

const StorageService = {
  uploadImage,
  uploadAvatar,
};

export default StorageService;
