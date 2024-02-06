import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../../../components/ui/button";
import { getArtworkUrl } from "@/lib/utils";

import usePaymentWidgetQuery from "@/lib/queries/usePaymentWidgetQuery.query";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import useUser from "@/hooks/useUser";
import useOrderQuery from "@/lib/queries/useOrderQuery.query";

interface OrderInfoProps {
  orderId: string;
  onOrder?: () => void;
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
const customerKey = nanoid();

export default function OrderInfo({ orderId, onOrder }: OrderInfoProps) {
  console.log("orderId", orderId);
  const orderInfo = useOrderQuery(orderId);
  const user = useUser();
  const { data: paymentWidget } = usePaymentWidgetQuery(clientKey, customerKey);
  const [loading, setLoading] = useState(true);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const agreementsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderAgreement"]
  > | null>(null);
  const [price, setPrice] = useState(50_000);

  const handleRequestPayment = async () => {
    if (!orderInfo.data) return;
    if (!user) return;
    try {
      // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
      await paymentWidget?.requestPayment({
        orderId: orderInfo.data.id,
        orderName:
          orderInfo.data.orderItems[0].artwork.artworkName +
          " 외" +
          (orderInfo.data.orderItems.length - 1) +
          "개",
        customerName: user.username,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/order-success`,
        failUrl: `${window.location.origin}/order-fail`,
      });
    } catch (error) {
      // 에러 처리하기
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!orderInfo.data) return;
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: orderInfo.data.totalAmount },
      { variantKey: "DEFAULT" },
    );

    paymentMethodsWidgetRef.current = paymentMethodsWidget;

    paymentWidget.renderAgreement("#agreement", {
      variantKey: "AGREEMENT",
    });
  }, [loading, orderInfo, paymentWidget]);

  if (orderInfo.isLoading) {
    return (
      <div className="border p-8 rounded-lg">
        <p>Loading...</p>
      </div>
    );
  }
  if (orderInfo.isError || !orderInfo.data) {
    console.error(orderInfo.error);

    return (
      <div className="border p-8 rounded-lg">
        <p>Error...</p>
      </div>
    );
  }
  console.log("orderInfo", orderInfo.data);

  return (
    <div className="border p-8 rounded-lg">
      <ul>
        {orderInfo.data.orderItems.map((orderItem) => (
          <li key={orderItem.id} className="mt-4">
            <div className="flex w-full gap-2">
              <div className="border rounded h-20 w-20 relative aspect-square">
                <Image
                  src={getArtworkUrl(orderItem.artwork.artworkPath + "?w=78")}
                  alt={orderItem.artwork.artworkName}
                  width={78}
                  height={78}
                  className="object-contain w-full h-full select-none"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/artwork/${orderItem.artwork.id}`}
                  className="hover:underline"
                >
                  {orderItem.artwork.artworkName}
                </Link>
                <p className="text-muted-foreground">$ {orderItem.amount}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-xl mt-12">
        <span className="text-muted-foreground">Total</span>
        <span>$ {orderInfo.data.totalAmount}</span>
      </div>
      <div id="payment-widget" style={{ width: "100%" }} />
      <div id="agreement" style={{ width: "100%" }} />
      <Button onClick={handleRequestPayment} className="w-full">
        Order
      </Button>
    </div>
  );
}
