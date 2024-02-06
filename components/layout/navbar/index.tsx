"use client";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import LogoIcon from "@/components/icons/logo";
import { MENU_ITEMS } from "@/lib/constants";
import Search from "./search";
import Cart from "@/components/cart";
import CartModal from "@/components/cart/cart-modal";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/user.store";

export default function Navbar() {
  const { user } = useUserStore();

  return (
    <nav className="flex items-center justify-between p-4">
      <div className="block flex-none md:hidden">
        <MobileMenu />
      </div>
      <div className="flex w-full items-center">
        {/* left */}
        <div className="flex w-full justify-center md:w-1/2 md:justify-start">
          <Link href="/" className="flex items-center gap-1">
            <LogoIcon className="w-12 h-12" />
            <span className="font-semibold">Art Hub</span>
          </Link>
          <ul className="gap-6 hidden md:flex md:items-center">
            {MENU_ITEMS.map((item) => (
              <li key={item.title}>
                <Link href={item.path} className="p-2">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* right */}
        <div className="flex gap-6 md:w-1/2 md:justify-end items-center">
          <div className="w-full hidden md:block max-w-96">
            <Search />
          </div>
          {user ? (
            <CartModal />
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
