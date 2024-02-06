import { useQuery } from "@tanstack/react-query";
import ArtworkService from "../firebase/artwork";

export default function useArtworkQuery(artworkId: string) {
  return useQuery({
    queryKey: ["artwork", artworkId],
    queryFn: () => ArtworkService.fetchArtworkById(artworkId),
    enabled: !!artworkId,
  });
}
