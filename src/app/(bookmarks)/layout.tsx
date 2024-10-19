import AppHeader from "./app-header"
import DeleteBookmarksDialog from "./delete-bookmark"
import OptionalNavSidebar from "./nav-sidebar"
import Providers from "./providers"
import TopToolbar from "./top-toolbar"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <div>
        <div className="h-16"></div>
        <div className="fixed top-0 z-10 h-16 w-full transition-shadow group-[[data-scroll='true']]:shadow-lg">
          <AppHeader />
        </div>
        <div className="fixed left-0 top-0 right-0 z-20">
          <TopToolbar />
        </div>
      </div>
      <div className="flex gap-4 sm:mx-2">
        <div className="hidden sm:block sm:flex-shrink-0">
          <div className="w-64">
            <OptionalNavSidebar />
          </div>
        </div>
        <div className="min-w-0 max-w-[36rem] flex-1">
          <main>{children}</main>
        </div>
      </div>
      <footer className="hidden h-16 sm:block"></footer>
      <DeleteBookmarksDialog />
    </Providers>
  )
}
