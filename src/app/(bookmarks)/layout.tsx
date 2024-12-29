import AppHeader from "@/components/app-header"
import NavSidebar from "./nav-sidebar"
import Providers from "./providers"
import SearchBar from "./search-bar"
import TopToolbar from "./top-toolbar"
import { Suspense } from "react"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      {/*
      This div is load bearing! This serves as the common parent for top
      toolbar and the main view, which is required for dismissing edit tags
      popover to work.
      */}
      <div>
        <div className="h-16"></div>
        <div className="fixed top-0 z-10 h-16 w-full transition-shadow group-[[data-scroll='true']]:shadow-lg">
          <AppHeader>
            <Suspense>
              <SearchBar />
            </Suspense>
          </AppHeader>
        </div>
        <div className="fixed left-0 top-0 right-0 z-20">
          <TopToolbar />
        </div>
        <div className="flex gap-4 sm:mx-2">
          <div className="hidden sm:block sm:flex-shrink-0">
            <div className="w-64">
              <Suspense>
                <NavSidebar />
              </Suspense>
            </div>
          </div>
          <div className="min-w-0 max-w-[36rem] flex-1">
            <main>{children}</main>
          </div>
        </div>
        <footer className="hidden h-16 sm:block"></footer>
      </div>
    </Providers>
  )
}
