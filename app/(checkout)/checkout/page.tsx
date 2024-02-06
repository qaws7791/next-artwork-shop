import CheckoutForm from "@/app/(checkout)/checkout/_components/checkout-form";

interface CheckoutPageProps {
  searchParams: {
    id: string;
  };
}

const CheckoutPage = ({ searchParams: { id } }: CheckoutPageProps) => {
  console.log("id", id);

  return (
    <div className="mx-auto max-w-screen-lg">
      <CheckoutForm orderId={id} />
    </div>
  );
};

export default CheckoutPage;
