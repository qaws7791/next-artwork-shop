import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import ArtworkService from "@/lib/firebase/artwork";
import { convertImagePathToHostedUrl } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AIGeneratorIcon from "@/components/icons/ai-generator-icon";
import AddCartButton from "./_components/add-cart-button";

interface ArtworkDetailPageProps {
  params: {
    artworkId: string;
  };
}

export default async function ArtworkDetailPage({
  params: { artworkId },
}: ArtworkDetailPageProps) {
  const artwork = await ArtworkService.fetchArtworkById(artworkId);
  if (!artwork) return notFound();

  return (
    <div>
      <h1 className="sr-only">Artwork Detail Page</h1>
      <div className="max-w-screen-xl px-4 mx-auto flex gap-12 justify-center items-start flex-col md:flex-row">
        <div className="flex w-full md:w-1/2 justify-center">
          <div className="border rounded-lg overflow-hidden">
            <Image
              src={convertImagePathToHostedUrl(`${artwork.artworkPath}?w=500`)}
              alt={artwork.artworkName}
              width={500}
              height={500 / artwork.artworkRatio}
              // placeholder="blur"
              // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCA"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div>
            <h2 className="font-medium text-3xl my-8">{artwork.artworkName}</h2>
            <Link
              href={`/user/${artwork.userId}`}
              className="flex items-center gap-3 w-fit"
            >
              <Image
                src={artwork.user.avatar}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
                quality={undefined}
              />
              <span>{artwork.user.username}</span>
            </Link>
            <AddCartButton artworkId={artwork.id} className="w-full mt-10" />
          </div>
          <Divider className="my-10" />
          <div>
            <h3 className="font-medium text-2xl my-4">Image Info</h3>
            <Link
              href={`/artwork/generator/${artwork.generatorId}`}
              className="flex items-center gap-3"
            >
              <AIGeneratorIcon
                generatorName={artwork.generator.generatorName}
                imageUrl={artwork.generator.logoImageUrl}
              />
              {artwork.generator.generatorName}
            </Link>
            <p className="font-medium my-2 text-lg">Prompt</p>
            <p>{artwork.prompt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
