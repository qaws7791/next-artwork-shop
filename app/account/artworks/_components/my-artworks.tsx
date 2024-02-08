"use client";
import useMyArtworksQuery from "@/lib/queries/useUserArtworksQuery";
import { convertImagePathToHostedUrl } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";

export default function MyArtworks() {
  const artworks = useMyArtworksQuery();
  const windowSize = useWindowSize();

  if (artworks.isLoading) return <div>Loading...</div>;
  if (artworks.isError) return <div>Error: {artworks.error.message}</div>;
  if (!artworks.data) return <div>No data</div>;

  const isDesktop = windowSize.width > 640;

  return (
    <Table>
      <TableCaption>My Artworks</TableCaption>
      <TableHeader>
        <TableRow>
          {isDesktop && <TableHead>Date</TableHead>}
          <TableHead>Preview</TableHead>
          <TableHead>Name</TableHead>
          {isDesktop && <TableHead>Price</TableHead>}
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artworks.data.map((artwork) => (
          <TableRow key={artwork.id}>
            {isDesktop && (
              <TableCell>
                {artwork.createdAt.toDate().toLocaleDateString()}
              </TableCell>
            )}
            <TableCell>
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <Link href={`/artwork/${artwork.id}`}>
                  <Image
                    src={convertImagePathToHostedUrl(
                      `${artwork.artworkPath}?w=80`,
                    )}
                    alt={artwork.artworkName}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                </Link>
              </div>
            </TableCell>
            <TableCell>
              <Link href={`/artwork/${artwork.id}`}>{artwork.artworkName}</Link>
            </TableCell>
            {isDesktop && <TableCell>￦{artwork.price}</TableCell>}
            <TableCell>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href={`/artwork?mode=edit&id=${artwork.id}`}>Edit</Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
