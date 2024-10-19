import * as bapi from "@/lib/bapi"

export async function POST(request: Request) {
  const body = await request.json()
  let bapiResponse = await bapi.addBookmark(body)
  return new Response(JSON.stringify(bapiResponse))
}
