"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function InvalidateCart() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["cart"],
    });
  }, [queryClient]);

  return null;
}
