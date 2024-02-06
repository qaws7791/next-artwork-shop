import RegisterForm from "@/app/(auth)/login/_components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="sr-only">Register</h1>
      <RegisterForm />
    </div>
  );
}
