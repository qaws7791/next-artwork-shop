import { useQuery } from "@tanstack/react-query";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
export default function usePaymentWidgetQuery(
  clientKey: string,
  customerKey: string,
) {
  return useQuery({
    queryKey: ["payment-widget", clientKey, customerKey],
    queryFn: () => {
      return loadPaymentWidget(clientKey, customerKey);
    },
  });
}
