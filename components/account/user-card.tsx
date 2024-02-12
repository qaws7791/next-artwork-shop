"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import useCurrentUserQuery from "@/lib/queries/useCurrentUserQuery";
import EditProfileModal from "./edit-profile-modal";

export default function UserCard() {
  const user = useCurrentUserQuery();

  if (user.isLoading) return <div>Loading...</div>;
  if (user.isError) return <div>Error: {user.error.message}</div>;

  if (!user.data) return <div>Not Found User</div>;

  return (
    <section className="border p-4 rounded-lg flex flex-col gap-4">
      <div className="flex flex-col gap-4 items-center">
        <Image
          src={`${user.data.avatar}`}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full flex-shrink-0 w-20 h-20"
        />
        <div className="text-center">
          <p>{user.data.username}</p>
          <p className="text-muted-foreground"> {user.data.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <EditProfileModal />
        <Button variant="outline" asChild>
          <Link href="/account/password">Change Password</Link>
        </Button>
      </div>
    </section>
  );
}
