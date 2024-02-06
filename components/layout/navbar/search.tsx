"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("search submitted");
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (!query) return;
    router.push(`/search?query=${query}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <label htmlFor="search">
        <input
          key={query}
          type="search"
          name="search"
          id="search"
          placeholder="Search Images..."
          autoComplete="off"
          defaultValue={query}
          className="flex h-10 w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 indent-6"
        />
        <SearchIcon className="absolute text-foreground w-5 h-5 top-1/2 left-3 -translate-y-1/2" />
      </label>
    </form>
  );
}
