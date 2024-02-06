import { useQuery } from "@tanstack/react-query";
import CartService from "../firebase/cart";

export default function useCartQuery() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: CartService.fetchCartAll,
  });
}
