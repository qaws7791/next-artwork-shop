"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Search from "./search";
import { MENU_ITEMS } from "@/lib/constants";
import Link from "next/link";
import LogoIcon from "@/components/icons/logo";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AuthService from "@/lib/firebase/auth";

export default function MobileMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const handleSignOut = async () => {
    await AuthService.signOut();
    closeMenu();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="icon" aria-label="Open navigation menu">
          <Menu aria-hidden={true} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-background/75 fixed left-0 top-0 w-full h-full backdrop-blur-lg" />
        <Dialog.Content className="fixed left-0 top-0 p-4 w-full flex flex-col h-full">
          <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Select a menu
          </Dialog.Description>
          <div className="flex gap-2 justify-between">
            <Dialog.Close asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Close navigation menu"
              >
                <X aria-hidden={true} />
              </Button>
            </Dialog.Close>
            <Link href="/" className="flex items-center gap-1">
              <LogoIcon className="w-12 h-12" />
              <span>Art Hub</span>
            </Link>
          </div>

          <div className="w-full mt-8">
            <Search />
          </div>

          <ul className="flex flex-col gap-4 mt-4">
            {MENU_ITEMS.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  className="p-2 pl-4 w-full flex hover:bg-accent rounded"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <Button onClick={handleSignOut}>Logout</Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
