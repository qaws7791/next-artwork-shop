"use client";
import { USER_MENU_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function UserNav() {
  const path = usePathname();

  return (
    <div className="overflow-x-auto w-full">
      <ul className="flex  whitespace-nowrap">
        {USER_MENU_ITEMS.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={cn(
                item.path === path && "font-semibold",
                "flex px-4 py-2 items-center rounded-md hover:bg-muted",
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
