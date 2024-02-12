"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import AuthService from "@/lib/firebase/auth";
import { useState } from "react";

const changePasswordModalSchema = z.object({
  currentPassword: z.string().min(8).max(20),
  newPassword: z.string().min(8).max(20),
});

export function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof changePasswordModalSchema>>({
    resolver: zodResolver(changePasswordModalSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof changePasswordModalSchema>,
  ) => {
    const { currentPassword, newPassword } = values;
    try {
      await AuthService.updatePassword(currentPassword, newPassword);
      alert("Password updated successfully");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.log(error);
      alert("Failed to update password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter a new password for your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Current Password"
                      {...field}
                      autoComplete="current-password"
                      type="password"
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New Password"
                      {...field}
                      autoComplete="new-password"
                      type="password"
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Change Password</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
