import { X } from "lucide-react";
import { Button } from "../ui/button";
import useCart from "@/hooks/useCart";

interface RemoveCartItemButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  cartItemId: string;
}

export default function RemoveCartItemButton({
  cartItemId,
  ...props
}: RemoveCartItemButtonProps) {
  const { deleteCart } = useCart();

  const handleRemoveCartItem = () => {
    deleteCart(cartItemId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Remove item from cart"
      {...props}
      onClick={handleRemoveCartItem}
    >
      <X aria-hidden={true} />
    </Button>
  );
}
