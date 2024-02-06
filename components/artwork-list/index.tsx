"use client";
import useWindowSize from "@/hooks/useWindowSize";
import { Artwork, WithId } from "@/lib/firebase";
import useArtworksQuery from "@/lib/queries/useArtworksQuery";
import Image from "next/image";
import Link from "next/link";

export default function ArtworkList() {
  const { width } = useWindowSize();
  const { data: artworks, isLoading, isError, error } = useArtworksQuery();
  const columns = Math.ceil(width / 400);

  if (isError) {
    console.error(error);

    return <p className="text-center">Error</p>;
  }

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!artworks) {
    return <p className="text-center">No images found</p>;
  }

  const allArtworks = artworks.pages.reduce(
    (acc, page) => [...acc, ...page.data],
    [] as WithId<Artwork>[],
  );

  const groupedData = Array.from({ length: columns }).map((_, i) =>
    allArtworks.filter((_, idx) => idx % columns === i),
  );

  return (
    <div className="flex gap-6">
      {groupedData.map((group, ulIndex) => (
        <ul key={ulIndex}>
          {group.map((artwork) => (
            <li key={artwork.id} className="mb-8">
              <Link
                className="overflow-hidden flex rounded-xl"
                href={`/artwork/${artwork.id}`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_FIREBASE_HOSTING_URL}/${artwork.artworkPath}`}
                  alt={artwork.artworkName}
                  width={300}
                  height={300 / artwork.artworkRatio}
                  className="hover:scale-105 transition-all duration-300"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDz3wX8Vtdn8Opo2ha3NaX9/qMaSXUN2Ibo27NBlYWyPmYoF6r8pbnNL8WvihqMls2m6xql0J7K/vgy3EimdLcrbLGjlZJN3EeAxdmbAOc16d/wz7afDn4e6Z4q0waXY6TYqbjVbjVJ5vtAjWRHVYByCxII2kDnHPph+Ivhpo/xN+HNx4w8SaXaWk9/dLcWt1p19v8AtFsY1MbyKjkKwBIKkKRjkV4vtk07r3bW/U+zVGNtGubm/Sx//9k="
                />
              </Link>
              <div className="mt-1">
                <Link
                  href={`/artwork/${artwork.id}`}
                  className="hover:underline ml-1"
                >
                  {artwork.artworkName}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
