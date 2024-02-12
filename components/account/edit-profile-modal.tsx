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
import useCurrentUserQuery from "@/lib/queries/useCurrentUserQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Label } from "../ui/label";
import UserService from "@/lib/firebase/user";
import { useQueryClient } from "@tanstack/react-query";
const profileFormSchema = z.object({
  username: z.string().min(2).max(16),
});

export default function EditProfileModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const user = useCurrentUserQuery();
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user.data?.username || "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      await UserService.updateUserProfile({
        username: values.username,
        avatar: file,
      });
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
      form.reset();
      setOpen(false);
      alert("Profile Updated");
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  if (user.isLoading) return <div>Loading...</div>;
  if (user.isError) return <div>Error: {user.error.message}</div>;

  if (!user.data) return <div>Not Found User</div>;

  const avatarUrl = file ? URL.createObjectURL(file) : user.data.avatar;

  const hasChanges = !(form.formState.isDirty || file !== null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-center">
          <Image
            src={avatarUrl}
            alt="avatar"
            width={80}
            height={80}
            className="rounded-full flex-shrink-0 w-20 h-20"
          />
          <input type="file" id="file" onChange={handleFileChange} hidden />
          <Button variant="outline" asChild>
            <Label htmlFor="file">
              <ImageIcon className="mr-2" />
              Change Avatar
            </Label>
          </Button>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter at least 3 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={hasChanges}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
