"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCart, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import CartList from "./cart-list";

export default function CartModal() {
  const path = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path, searchParams]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="icon" aria-label="Open cart modal">
          <ShoppingCart aria-hidden={true} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-background/50 fixed right-0 top-0 w-full h-full " />
        <Dialog.Content className="fixed right-0 top-0 p-4 w-full flex flex-col h-full md:w-[420px] border backdrop-blur-lg bg-background/75">
          <div className="flex gap-2 justify-between items-center">
            <Dialog.Title>My Cart</Dialog.Title>
            <Dialog.Close asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Close cart modal"
              >
                <X aria-hidden={true} />
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-muted-foreground my-2">
            Review your items before checking out
          </Dialog.Description>
          <CartList />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
