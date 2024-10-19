import type { Metadata } from "next"
import "@/styles/app.css"
import ScrollObserver from "@/components/scroll-observer"
import { Inter } from "next/font/google"

export const metadata: Metadata = {
  title: "Savory",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        data-scroll="false"
        className={`theme-light bg-default ${inter.variable} font-sans text-base text-default group`}
      >
        <ScrollObserver />
        {children}
      </body>
    </html>
  )
}
