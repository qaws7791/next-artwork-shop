import { MyArtworkPreview } from "@/components/account/my-artwork-preview";
import { PurchaseHistoryPreview } from "@/components/account/purchase-history-preview";
import UserCard from "@/components/account/user-card";

export default function UserPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div>Profile Page</div>
      <UserCard />
      <MyArtworkPreview />
      {/* <PurchaseHistoryPreview /> */}
    </div>
  );
}
