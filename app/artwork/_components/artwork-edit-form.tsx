"use client";
import ArtworkForm from "@/components/artwork/artwork-form";
import useArtworkQuery from "@/lib/queries/useArtworkQuery";
import React from "react";

interface ArtworkEditFormProps {
  artworkId: string;
}

export default function ArtworkEditForm({ artworkId }: ArtworkEditFormProps) {
  console.log(artworkId);
  const artworkQuery = useArtworkQuery(artworkId);

  if (artworkQuery.isLoading) return <div>Loading...</div>;
  if (artworkQuery.isError) return <div>Error</div>;
  if (!artworkQuery.data) return <div>No data</div>;

  return <ArtworkForm artwork={artworkQuery.data} />;
}
