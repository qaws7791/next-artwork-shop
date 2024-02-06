"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Image from "next/image";
import { addNumbersWithPrecision, getArtworkUrl } from "@/lib/utils";
import Link from "next/link";
import RemoveCartItemButton from "./remove-cart-item-button";
import { useRouter } from "next/navigation";
import orderService from "@/lib/firebase/order";
import useCart from "@/hooks/useCart";

export default function CartList() {
  const { cart } = useCart();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleChangeCheckbox = (
    checked: boolean | "indeterminate",
    cartItemId: string,
  ) => {
    if (checked === "indeterminate") {
      return;
    }
    if (checked) {
      setSelectedItems([...selectedItems, cartItemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== cartItemId));
    }
  };

  const handleSubmitCheckout = () => {
    if (!cart) return;
    const cartToCheckout = cart.filter((cartItem) =>
      selectedItems.includes(cartItem.id),
    );
    if (selectedItems.length !== cartToCheckout.length) {
      return console.error("Some items are not selected");
    }

    const orderDto = cartToCheckout.map((cartItem) => ({
      artworkId: cartItem.artwork.id,
      quantity: 1,
      userId: cartItem.userId,
      price: cartItem.artwork.price,
      discountRate: cartItem.artwork.discountRate,
    }));
    console.log(orderDto);
    orderService.createOrder(orderDto).then((orderId) => {
      router.push(`/checkout?id=${orderId}`);
    });
  };

  useEffect(() => {
    if (!cart) return;
    setSelectedItems((prev) =>
      prev.filter((id) => cart.find((item) => item.id === id)),
    );
  }, [cart]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="select-all" />
          <label htmlFor="select-all" className="select-none">
            Select All
          </label>
        </div>
        <Button variant="ghost">Remove</Button>
      </div>
      <div className="h-full overflow-y-auto">
        <ul>
          {cart?.map((cartItem) => {
            return (
              <li
                key={cartItem.id}
                className="flex items-start gap-2 border-b p-[11px] py-8"
              >
                <div className="flex w-full gap-2">
                  <div className="border rounded h-20 w-20 relative aspect-square">
                    <Image
                      src={getArtworkUrl(
                        `${cartItem.artwork.artworkPath}?w=78`,
                      )}
                      alt={cartItem.artwork.artworkName}
                      width={78}
                      height={78}
                      className="object-contain w-full h-full select-none"
                      draggable={false}
                    />
                    <div className="flex absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                      <Checkbox
                        className=" bg-background"
                        id={cartItem.id}
                        checked={selectedItems.includes(cartItem.id)}
                        onCheckedChange={(check) =>
                          handleChangeCheckbox(check, cartItem.id)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/artwork/${cartItem.artwork.id}`}
                      className="hover:underline"
                    >
                      {cartItem.artwork.artworkName}
                    </Link>
                    <p className="text-muted-foreground">
                      $ {cartItem.artwork.price}
                    </p>
                  </div>
                </div>
                <div>
                  <RemoveCartItemButton
                    className="-translate-y-1/2"
                    cartItemId={cartItem.id}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-auto">
        <div className="flex justify-between text-xl">
          <span className="text-muted-foreground">Total</span>
          <span>
            ${" "}
            {cart?.reduce(
              (acc, item) =>
                addNumbersWithPrecision(acc, item.artwork.price, 2),
              0,
            )}
          </span>
        </div>
        <div className="w-full mt-4">
          <Button
            variant="default"
            className="w-full font-bold"
            size="lg"
            disabled={selectedItems.length === 0}
            // onClick={() => router.push("/checkout?checkoutId=1")}
            onClick={handleSubmitCheckout}
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
