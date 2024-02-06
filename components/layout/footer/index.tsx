import GithubIcon from "@/components/icons/github";
import LogoIcon from "@/components/icons/logo";
import { PUBLIC_MENU_ITEMS } from "@/lib/constants";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-6 flex flex-col gap-6 md:p-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-1">
          <LogoIcon className="w-12 h-12" />
          <span className="font-semibold">Art Hub</span>
        </Link>
        <nav>
          <ul>
            {PUBLIC_MENU_ITEMS.map((item) => (
              <li key={item.title}>
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-col gap-4 md:flex-row items-center md:justify-between">
        <p>© 2023 qaws7792. All rights reserved.</p>
        <Link href="https://github.com/qaws7791">
          <GithubIcon />
        </Link>
      </div>
    </footer>
  );
}
