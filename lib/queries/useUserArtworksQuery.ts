import ArtworkService from "@/lib/firebase/artwork";
import { useQuery } from "@tanstack/react-query";

export default function useMyArtworksQuery() {
  return useQuery({
    queryKey: ["my", "artworks"],
    queryFn: ArtworkService.fetchMyArtworks,
  });
}
