"use client";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";

interface AddCartButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  artworkId: string;
}

export default function AddCartButton({
  artworkId,
  ...props
}: AddCartButtonProps) {
  const { addCart } = useCart();
  const handleAddCart = () => {
    addCart(artworkId);
  };

  return (
    <Button onClick={handleAddCart} {...props}>
      Add To Cart
    </Button>
  );
}
