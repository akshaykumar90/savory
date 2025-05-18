import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import { cache } from "react"

function makeDbSession() {
  const client = postgres(process.env.POSTGRES_URL!)
  return drizzle(client, { schema, logger: false })
}

export const getSession = cache(makeDbSession)

export type Session = ReturnType<typeof getSession>
