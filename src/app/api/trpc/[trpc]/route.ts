import { appRouter } from "@/crud/routers/_app"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
  })

export { handler as GET, handler as POST }
