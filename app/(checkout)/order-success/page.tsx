import { Link } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import InvalidateCart from "./invalidate-cart";

interface OrderSuccessPageProps {
  searchParams: {
    paymentType: "NORMAL" | "BRANDPAY" | "KEYIN";
    orderId: string;
    paymentKey: string;
    amount: string;
  };
}

export default async function OrderSuccessPage({
  searchParams: { paymentType, orderId, paymentKey, amount },
}: OrderSuccessPageProps) {
  if (!paymentKey || !orderId || !amount)
    return (
      <div className="mx-auto">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/gift.png"
            alt="Order Success"
            width={320}
            height={320}
          />
          <h1 className="text-2xl">Invalid payment</h1>
          <Link href="/">Go back to home</Link>x
        </div>
      </div>
    );

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  });

  console.log("res", await res.json());

  if (!res.ok) {
    const json = await res.json();

    return redirect(`/order-fail?message=${json.message}&code=${json.code}`);
  }

  return (
    <div className="mx-auto">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/images/gift.png"
          alt="Order Success"
          width={320}
          height={320}
        />
        <h1 className="text-2xl">Your order was received successfully</h1>
        <p className="text-muted-foreground">Thank you for your order!</p>
        <InvalidateCart />
      </div>
    </div>
  );
}
