import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import { cache } from "react"
import { getCloudflareContext } from "@opennextjs/cloudflare"

async function makeDbSession() {
  const { env } = await getCloudflareContext({ async: true })
  const connectionString = env.CRDB.connectionString
  const client = postgres(connectionString)
  return drizzle(client, { schema, logger: false })
}

export const getSession = cache(makeDbSession)

export type Session = Awaited<ReturnType<typeof getSession>>
