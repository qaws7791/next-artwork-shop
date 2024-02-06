import ArtworkService from "@/lib/firebase/artwork";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useArtworksQuery() {
  return useInfiniteQuery({
    queryKey: ["artworks"],
    queryFn: ArtworkService.fetchArtworks,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
    initialPageParam: undefined,
  });
}
