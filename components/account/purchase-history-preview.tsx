"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useMyArtworks from "@/hooks/useMyArtworks";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize co";
import { Button } from "../ui/button";
import Link from "next/link";

export function PurchaseHistoryPreview() {
  const artworks = useMyArtworks();
  const { width } = useWindowSize();

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
          {artworks.map((artwork, index) => (
            <CarouselItem key={index} className="basis-32">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={`/images/${artwork.image.url}`}
                  alt={artwork.title}
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
