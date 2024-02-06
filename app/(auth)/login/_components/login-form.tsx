"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthService from "@/lib/firebase/auth";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      const signInRes = await AuthService.signInWithEmail({
        email: values.email,
        password: values.password,
      });
      if (signInRes.error) throw signInRes.error;
      alert("Logged in");
      router.replace("/");
    } catch (error) {
      console.log(error);
      alert("Error logging in");
    }
  }

  async function onGoogleLogin() {
    try {
      const signInRes = await AuthService.signInWithGoogle();
      if (signInRes.error) throw signInRes.error;
      alert("Logged in");
      router.replace("/");
    } catch (error) {
      console.log(error);
      alert("Error logging in");
    }
  }

  return (
    <Card className="max-w-96 w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <Button
          type="button"
          className="w-full mt-4"
          variant="ghost"
          onClick={onGoogleLogin}
        >
          Google Login
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="flex items-center justify-center text-muted-foreground">
          Don&apos;t have an account?
          <Button variant="link" asChild>
            <Link href="/register">Signup</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
