import { useMutation, useQueryClient } from "@tanstack/react-query";
import CartService from "../firebase/cart";

export default function useDeleteCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CartService.removeCartItem,
    onError: () => {
      alert("Error removing item from cart");
    },
    onSuccess: () => {
      alert("Remove to cart");

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}
