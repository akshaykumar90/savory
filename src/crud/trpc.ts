import { getSession } from "@/db/drizzle"
import { getUser } from "@/db/queries/user"
import { initTRPC, TRPCError } from "@trpc/server"
import { cache } from "react"
import superjson from "superjson"

export const createTRPCContext = cache(async () => {
  const user = await getUser()
  const db = getSession()

  return {
    userId: user?.id ?? null,
    db,
  }
})

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }
  return next({
    ctx: {
      userId: ctx.userId,
    },
  })
})
