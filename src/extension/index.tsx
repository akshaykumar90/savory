import { createRoot } from "react-dom/client"
import Popup from "./popup"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import type { AppRouter } from "@/crud/routers/_app"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import superjson from "superjson"
import { TRPCProvider } from "@/lib/trpc"

function App() {
  const queryClient = new QueryClient()
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${import.meta.env.VITE_APP_BASE_URL}/api/trpc`,
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <Popup />
      </TRPCProvider>
    </QueryClientProvider>
  )
}

const domNode = document.getElementById("savory-chrome-extension-app")
if (domNode) {
  const root = createRoot(domNode)
  root.render(<App />)
}
