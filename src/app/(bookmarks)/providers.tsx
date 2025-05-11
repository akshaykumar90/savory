"use client"

import type { AppRouter } from "@/crud/routers/_app"
import { TRPCProvider } from "@/lib/trpc"
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { Provider as JotaiProvider } from "jotai"
import { useState } from "react"
import superjson from "superjson"
import { makeQueryClient } from "../query-client"

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/trpc`,
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <JotaiProvider>{children}</JotaiProvider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}
