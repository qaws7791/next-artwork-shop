import Image from "next/image";

export default function AccessDeniedPage() {
  return (
    <div className="mx-auto">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/images/access-denied.png"
          alt="Order Success"
          width={320}
          height={320}
        />
        <h1 className="text-2xl">You do not have access to this page</h1>
        <p className="text-muted-foreground">
          Please become a member or sign in to continue.
        </p>
      </div>
    </div>
  );
}
