import { ARTWORK_LIST } from "@/dummy";

export default function useArtwork(id: string) {
  const parsedId = Number(id);
  if (isNaN(parsedId)) return undefined;

  return ARTWORK_LIST.find((post) => post.id === parsedId);
}
