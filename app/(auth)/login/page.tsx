import LoginForm from "@/app/(auth)/login/_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="sr-only">Login</h1>
      <LoginForm />
    </div>
  );
}
