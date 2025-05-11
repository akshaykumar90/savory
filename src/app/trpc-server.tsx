import "server-only"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { cache } from "react"
import { appRouter } from "@/crud/routers/_app"
import { createTRPCContext } from "@/crud/trpc"
import { makeQueryClient } from "./query-client"

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
const getQueryClient = cache(makeQueryClient)

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
})
