"use client";
import OrderInfo from "./order-info";

interface CheckoutFormProps {
  orderId: string;
}

export default function CheckoutForm({ orderId }: CheckoutFormProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
      {/* <PaymentForm form={form} /> */}
      <OrderInfo orderId={orderId} />
    </div>
  );
}
