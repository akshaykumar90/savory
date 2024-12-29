import AppHeader from "@/components/app-header"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header>
        <div className="h-16"></div>
        <div className="fixed top-0 z-10 h-16 w-full transition-shadow group-[[data-scroll='true']]:shadow-lg">
          <AppHeader />
        </div>
      </header>
      {children}
    </>
  )
}
