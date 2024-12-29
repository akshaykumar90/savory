import { createRoot } from "react-dom/client"
import Popup from "./popup"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Popup />
    </QueryClientProvider>
  )
}

const domNode = document.getElementById("savory-chrome-extension-app")
if (domNode) {
  const root = createRoot(domNode)
  root.render(<App />)
}
