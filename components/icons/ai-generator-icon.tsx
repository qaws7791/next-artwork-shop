import { cn } from "@/lib/utils";
import Image from "next/image";

interface AiIconProps extends React.HTMLAttributes<HTMLImageElement> {
  generatorName: string;
  imageUrl: string;
  className?: string;
}

const AIGeneratorIcon = ({
  generatorName,
  imageUrl,
  className,
}: AiIconProps) => {
  return (
    <Image
      src={imageUrl}
      alt={generatorName}
      width={40}
      height={40}
      className={cn("rounded-full w-10 h-10 border bg-black", className)}
    />
  );
};

export default AIGeneratorIcon;
