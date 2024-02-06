import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
export default function Cart() {
  return (
    <Button variant="outline" size="icon">
      <ShoppingCart size={20} className="text-foreground" />
    </Button>
  );
}
