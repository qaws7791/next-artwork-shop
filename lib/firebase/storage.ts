import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./index";
import { nanoid } from "nanoid";

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

const StorageService = {
  uploadImage,
};

export default StorageService;
