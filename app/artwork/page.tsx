import ArtworkCreateForm from "@/app/artwork/_components/artwork-create-form";
import ArtworkEditForm from "./_components/artwork-edit-form";

interface EditArtworkPageProps {
  searchParams: {
    mode: string;
    id: string;
  };
}

export default function EditArtworkPage({
  searchParams,
}: EditArtworkPageProps) {
  if (searchParams.mode === "create") {
    return (
      <div className="flex flex-col items-center">
        CreateArtworkPage
        <ArtworkCreateForm />
      </div>
    );
  } else if (searchParams.mode === "edit") {
    return (
      <div className="flex flex-col items-center">
        EditArtworkPage
        <ArtworkEditForm artworkId={searchParams.id} />
      </div>
    );
  } else return <div className="flex flex-col items-center">Invalid mode</div>;
}
