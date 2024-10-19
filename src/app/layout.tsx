import type { Metadata } from "next"
import "@/styles/app.css"

export const metadata: Metadata = {
  title: "Savory",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="theme-light bg-default font-sans text-base text-default">
        {children}
      </body>
    </html>
  )
}
