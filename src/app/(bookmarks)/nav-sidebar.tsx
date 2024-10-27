"use client"

import {
  FilmIcon,
  FolderIcon,
  InboxIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

type AllTabs = "home" | "tags" | "reading" | "playlist"

function SidebarTab({
  href,
  label,
  isActive,
  Icon,
}: {
  href: string
  label: string
  isActive: boolean
  Icon: any // todo: fix this
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
        isActive
          ? "bg-gray-100 text-gray-900"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <Icon
        className={clsx(
          "mr-3 h-6 w-6 flex-shrink-0",
          isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
        )}
        aria-hidden="true"
      />
      <span className="flex-1">{label}</span>
    </Link>
  )
}

export default function NavSidebar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  let currentTab: AllTabs | undefined

  if (pathname === "/tags") {
    currentTab = "tags"
  } else if (pathname === "/") {
    let tags = searchParams.getAll("name")
    if (tags.includes("reading")) {
      currentTab = "reading"
    } else if (tags.includes("playlist")) {
      currentTab = "playlist"
    } else {
      currentTab = "home"
    }
  }

  return (
    <div className="flex flex-grow flex-col overflow-y-auto  pb-4">
      <div className="mt-5 flex flex-grow flex-col">
        <nav className="flex-1 space-y-1  px-2" aria-label="Sidebar">
          <SidebarTab
            href="/"
            label="Bookmarks"
            Icon={InboxIcon}
            isActive={currentTab === "home"}
          />
          <SidebarTab
            href="/tags"
            label="Tags"
            Icon={FolderIcon}
            isActive={currentTab === "tags"}
          />
          <SidebarTab
            href="/?name=reading"
            label="Reading"
            Icon={NewspaperIcon}
            isActive={currentTab === "reading"}
          />
          <SidebarTab
            href="/?name=playlist"
            label="Playlist"
            Icon={FilmIcon}
            isActive={currentTab === "playlist"}
          />
        </nav>
      </div>
    </div>
  )
}
