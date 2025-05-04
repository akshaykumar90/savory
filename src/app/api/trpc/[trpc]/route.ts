import { appRouter } from "@/crud/routers/_app"
import { createTRPCContext } from "@/crud/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  })

export { handler as GET, handler as POST }
