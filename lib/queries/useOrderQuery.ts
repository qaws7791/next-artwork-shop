import { useQuery } from "@tanstack/react-query";
import orderService from "../firebase/order";

export default function useOrderQuery(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrderWithItems(orderId),
  });
}
