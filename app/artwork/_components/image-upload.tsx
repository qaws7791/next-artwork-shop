import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Label } from "../../../components/ui/label";

interface ImageUploadProps {
  onImageChange: (image: File | null) => void;
  defaultImage?: string;
}

export default function ImageUpload({
  onImageChange,
  defaultImage,
}: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (!e.target.files?.[0]) return;
    setFile(e.target.files[0]);
    onImageChange(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log(e.dataTransfer.files);
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files?.[0]) return;
    setFile(e.dataTransfer.files[0]);
    onImageChange(e.dataTransfer.files[0]);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const imageUrl = file ? URL.createObjectURL(file) : "";

  return (
    <div
      id="drop-area"
      className="flex flex-col items-center justify-between rounded-lg border p-4"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <input
        type="file"
        accept="image/*"
        id="file"
        hidden
        onChange={handleFileChange}
      />
      <div
        id="image-preview"
        className="relative w-full aspect-square flex items-center justify-center"
      >
        {defaultImage ? (
          <Image
            src={defaultImage}
            alt="file preview"
            className="object-contain"
            sizes="500px"
            fill
          />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="file preview"
            className="object-contain"
            sizes="500px"
            fill
          />
        ) : (
          <span className="drop-text">
            Drop image or{" "}
            <Label htmlFor="file" className="text-primary">
              browse
            </Label>
          </span>
        )}
      </div>
    </div>
  );
}
