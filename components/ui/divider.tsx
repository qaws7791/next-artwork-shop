import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Divider({ className, ...props }: DividerProps) {
  return (
    <div
      className={cn(
        "border-t border-divider text-divider text-divider-foreground",
        className,
      )}
      {...props}
    />
  );
}
