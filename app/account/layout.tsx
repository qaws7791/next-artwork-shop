import UserNav from "../../components/account/user-nav";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center flex-col p-4">
      <UserNav />
      {children}
    </div>
  );
}
