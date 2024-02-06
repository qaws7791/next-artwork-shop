import { useMutation, useQueryClient } from "@tanstack/react-query";
import CartService from "../firebase/cart";

export default function useAddCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CartService.createCartItem,
    onError: () => {
      alert("Error adding item to cart");
    },
    onSuccess: () => {
      alert("Added to cart");

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}
