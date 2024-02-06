import CartService from "@/lib/firebase/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useCart() {
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.fetchCartAll,
  });

  const addCart = useMutation({
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
  }).mutate;

  const deleteCart = useMutation({
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
  }).mutate;

  return {
    cart,
    isLoading,
    isError,
    error,
    addCart,
    deleteCart,
  };
}
