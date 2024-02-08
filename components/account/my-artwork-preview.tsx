"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";
import { Button } from "../ui/button";
import Link from "next/link";
import useMyArtworksQuery from "@/lib/queries/useUserArtworksQuery";
import { convertImagePathToHostedUrl } from "@/lib/utils";

export function MyArtworkPreview() {
  const artworks = useMyArtworksQuery();

  const { width } = useWindowSize();

  if (artworks.isLoading) {
    return <div>Loading...</div>;
  }

  if (artworks.isError) {
    console.log(artworks.error);

    return <div>Error</div>;
  }

  if (!artworks.data) {
    return <div>No artworks</div>;
  }

  return (
    <div className="border py-8 md:px-16 flex flex-col rounded-lg w-full">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4 ml-4 md:ml-0">My Artworks</h2>
        <Button variant="link" asChild>
          <Link href="/account/artworks">View All</Link>
        </Button>
      </div>
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {artworks.data.map((artwork, index) => (
            <CarouselItem key={index} className="basis-32">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={convertImagePathToHostedUrl(artwork.artworkPath)}
                  alt={artwork.artworkName}
                  width={280}
                  height={280}
                  className="object-contain w-full h-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {width > 768 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
}
