"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
      },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
