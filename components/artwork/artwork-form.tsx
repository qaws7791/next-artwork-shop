"use client";
import { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, getArtworkUrl, getImageRatio } from "@/lib/utils";
import { AI_GENERATORS } from "@/dummy";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import ArtworkService from "@/lib/firebase/artwork";
import { nanoid } from "nanoid";
import ImageUpload from "@/app/artwork/_components/image-upload";
import { Textarea } from "../ui/textarea";
import { Artwork, WithId } from "@/lib/firebase";

const artworkFormSchema = z.object({
  artworkName: z.string().min(2).max(100),
  description: z.string().min(2).max(5000),
  prompt: z.string().min(2).max(5000),
  generatorId: z.string(),
  discountRate: z.number().min(0).max(100),
  price: z.number().min(0).max(1000),
});

interface ArtworkFormProps {
  artwork?: WithId<Artwork>;
}

export default function ArtworkForm({ artwork }: ArtworkFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof artworkFormSchema>>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: artwork
      ? {
          artworkName: artwork.artworkName,
          description: artwork.description,
          prompt: artwork.prompt,
          generatorId: artwork.generatorId,
          discountRate: artwork.discountRate,
          price: artwork.price,
        }
      : {
          artworkName: "",
          description: "",
          prompt: "",
        },
  });

  async function addArtwork(data: z.infer<typeof artworkFormSchema>) {
    console.log(data);
    if (!file) {
      return alert("Please upload image");
    }
    try {
      const newArtworkId = nanoid();
      const artworkPath = await ArtworkService.uploadArtworkImage(
        file,
        newArtworkId,
      );
      const artwork = {
        ...data,
        artworkPath,
        artworkRatio: await getImageRatio(file),
      };
      await ArtworkService.createArtwork(newArtworkId, artwork);
      alert("Artwork uploaded successfully");
    } catch (e) {
      console.log(e);
      alert("Error uploading artwork");
    }
  }

  async function updateArtwork(
    artwork: WithId<Artwork>,
    data: z.infer<typeof artworkFormSchema>,
  ) {
    try {
      const newArtwork = {
        artworkPath: file
          ? await ArtworkService.uploadArtworkImage(file, artwork.id)
          : artwork.artworkPath,
        artworkRatio: file ? await getImageRatio(file) : artwork.artworkRatio,
        ...data,
      };
      await ArtworkService.updateArtwork(artwork.id, newArtwork);
    } catch (e) {
      console.log(e);
      alert("Error updating artwork");
    }
  }

  async function onSubmit(data: z.infer<typeof artworkFormSchema>) {
    if (!artwork) {
      return addArtwork(data);
    } else {
      return updateArtwork(artwork, data);
    }
  }

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[600px] p-4 border rounded-lg"
      >
        <ImageUpload
          onImageChange={setFile}
          defaultImage={
            artwork ? getArtworkUrl(artwork.artworkPath) : undefined
          }
        />

        <FormField
          control={form.control}
          name="artworkName"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The artworkName of your artwork</FormDescription>
              <FormDescription />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="generatorId"
          render={({ field }) => {
            const selectedGenerator = AI_GENERATORS.find(
              (generator) => generator.id === field.value,
            );

            return (
              <FormItem className="flex flex-col">
                <FormLabel>Generator</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[250px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {selectedGenerator ? (
                          <>
                            <Image
                              src={selectedGenerator.logoUrl}
                              width={20}
                              height={20}
                              alt={selectedGenerator.generatorName}
                              className="rounded-full mr-2"
                            />
                            {selectedGenerator.generatorName}
                          </>
                        ) : (
                          "Select Generator"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Select AI Generator"
                        autoComplete="off"
                      />
                      <CommandEmpty>No generator found.</CommandEmpty>
                      <CommandGroup>
                        {AI_GENERATORS.map((generator) => (
                          <CommandItem
                            value={generator.generatorName}
                            key={generator.generatorName}
                            onSelect={() => {
                              form.setValue("generatorId", generator.id);
                            }}
                          >
                            <Image
                              src={generator.logoUrl}
                              width={20}
                              height={20}
                              alt={generator.generatorName}
                              className="rounded-full mr-2"
                            />

                            {generator.generatorName}
                            <CommandShortcut>
                              {generator.id === field.value && (
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    generator.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              )}
                            </CommandShortcut>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the language that will be used in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="discountRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Rate(0-100%)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    console.log(e.target.value);

                    return +field.onChange(+e.target.value ?? 0);
                  }}
                />
              </FormControl>
              <FormDescription>USD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => +field.onChange(+e.target.value ?? 0)}
                />
              </FormControl>
              <FormDescription>USD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                The prompt that will be used to generate the artwork.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                The description that will be used to generate the artwork.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full">Submit</Button>
      </form>
    </Form>
  );
}
