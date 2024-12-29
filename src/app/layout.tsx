import type { Metadata } from "next"
import "@/styles/app.css"
import ScrollObserver from "@/components/scroll-observer"
import { Inter } from "next/font/google"

export const metadata: Metadata = {
  title: "Savory",
  icons: [
    { rel: "icon", type: "image/png", url: "/icon16.png", sizes: "16x16" },
    { rel: "icon", type: "image/png", url: "/icon32.png", sizes: "32x32" },
    { rel: "icon", type: "image/png", url: "/icon48.png", sizes: "48x48" },
  ],
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
