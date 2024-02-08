"use client";
import AuthService from "@/lib/firebase/auth";
import useUserStore from "@/store/user.store";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

export default function Provider({ children }: { children: React.ReactNode }) {
  const { loginUser, logoutUser, user } = useUserStore();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
  );

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      if (user) {
        loginUser(user);
        console.log("logged in");
      } else {
        logoutUser();
        console.log("logged out");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loginUser, logoutUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallback={
          <div>
            <h1>Something went wrong</h1>
          </div>
        }
      >
        {user === undefined ? <div>Loading...</div> : children}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
