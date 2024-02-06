import { Link } from "lucide-react";
import Image from "next/image";

interface OrderFailPageProps {
  searchParams: {
    code: string;
    message: string;
  };
}

export default function OrderFailPage({
  searchParams: { code, message },
}: OrderFailPageProps) {
  return (
    <div className="mx-auto">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/images/gift.png"
          alt="Order Fail"
          width={320}
          height={320}
        />
        <h1 className="text-2xl">
          Your order was
          <span className="text-red-500"> failed</span>
        </h1>
        <p className="text-muted-foreground">
          {code} : {message}
        </p>
        <Link href="/">Go back to home</Link>
      </div>
    </div>
  );
}
