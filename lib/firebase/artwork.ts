import {
  QueryConstraint,
  QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { Artwork, WithId, artworkCollection, auth, db, storage } from "./index";
import { UploadMetadata, ref, uploadBytes } from "firebase/storage";
import { QueryFunction, QueryKey } from "@tanstack/react-query";
import AIGeneratorService from "./generator";
import { nanoid } from "nanoid";
import UserService from "./user";

type ArtworkDto = Pick<
  Artwork,
  | "artworkName"
  | "description"
  | "prompt"
  | "generatorId"
  | "discountRate"
  | "price"
  | "artworkPath"
  | "artworkRatio"
>;

const createArtwork = async (artworkId: string, artwork: ArtworkDto) => {
  const uploaderId = auth.currentUser?.uid;
  if (!uploaderId) {
    throw new Error("Not logged in");
  }
  const docRef = await setDoc(doc(artworkCollection, artworkId), {
    ...artwork,
    userId: uploaderId,
    createdAt: serverTimestamp(),
  });

  return docRef;
};

const updateArtwork = async (artworkId: string, artwork: ArtworkDto) => {
  const docRef = updateDoc(doc(artworkCollection, artworkId), {
    ...artwork,
  });

  return docRef;
};

const uploadArtworkImage = async (file: File, artworkId: string) => {
  const uploaderId = auth.currentUser?.uid;
  if (!uploaderId) {
    throw new Error("Not logged in");
  }
  const storageRef = ref(
    storage,
    `artworks/${artworkId}/${Date.now()}-${nanoid()}`,
  );

  const metadata: UploadMetadata = {
    customMetadata: {
      owner: uploaderId,
    },
  };

  const uploadResult = await uploadBytes(storageRef, file, metadata);

  return uploadResult.ref.fullPath;
};

export interface FetchArtworksParams {
  pageParam?: QueryDocumentSnapshot<Artwork>;
}

const fetchMyArtworks = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("Not logged in");
  }
  const artworkQuery = query(
    artworkCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  const artworkQuerySnapshot = await getDocs(artworkQuery);

  const artworkList = artworkQuerySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return artworkList;
};

const fetchArtworks = async ({ pageParam }: FetchArtworksParams) => {
  const queries: QueryConstraint[] = [];

  if (pageParam) {
    queries.push(startAfter(pageParam));
  }

  const artworkQuery = query(
    artworkCollection,
    ...queries,
    orderBy("createdAt", "desc"),
    limit(10),
  );

  const artworkQuerySnapshot = await getDocs(artworkQuery);

  const artworkList = artworkQuerySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    data: artworkList,
    nextPageParam:
      artworkQuerySnapshot.size < 10 ? undefined : artworkQuerySnapshot.docs[9],
  };
};

const fetchArtworkById = async (artworkId: string) => {
  const artworkDoc = await getDoc(doc(artworkCollection, artworkId));

  if (!artworkDoc.exists()) {
    return null;
  }

  const artworkData = {
    id: artworkDoc.id,
    ...artworkDoc.data(),
  };

  const aiGeneratorSnap = AIGeneratorService.fetchAIGenerator(
    artworkData.generatorId,
  );

  const userSnap = UserService.fetchUser(artworkData.userId);

  const [aiGenerator, userData] = await Promise.all([
    aiGeneratorSnap,
    userSnap,
  ]);

  if (!aiGenerator || !userData) {
    return null;
  }

  return {
    ...artworkData,
    generator: aiGenerator,
    user: userData,
  };
};

const ArtworkService = {
  createArtwork,
  updateArtwork,
  uploadArtworkImage,
  fetchArtworks,
  fetchArtworkById,
  fetchMyArtworks,
};

export default ArtworkService;
