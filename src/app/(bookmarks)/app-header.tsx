import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import Image from "next/image"
import Link from "next/link"
import logo from "../../assets/logo_light.svg"
import OptionalSearchBar from "./search-bar"

const mktSiteUrl = process.env.MKT_SITE_URL

export const gettingStartedUrl = `${mktSiteUrl}/getting-started`
export const feedbackUrl = `${mktSiteUrl}/feedback`

const appLinks = [
  {
    href: "/settings",
    label: "Settings",
  },
]

const outboundLinks = [
  {
    href: gettingStartedUrl,
    label: "Help",
  },
  {
    href: feedbackUrl,
    label: "Questions?",
  },
]

export default function AppHeader() {
  return (
    <div className="px-2 sm:px-4 lg:px-8 border-b bg-default">
      <div className="relative flex h-16 items-center justify-between">
        <div className="flex items-center px-2 lg:px-0 xl:w-64">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                className="h-14 w-auto"
                src={logo}
                priority={true}
                alt="Savory"
              />
            </Link>
          </div>
        </div>

        <OptionalSearchBar />

        <div className="hidden lg:block lg:w-80">
          <div className="flex items-center justify-end">
            <Menu as="div" className="relative ml-4 flex-shrink-0">
              <div>
                <MenuButton className="flex rounded-full bg-indigo-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
                  <span className="sr-only">Open user menu</span>
                  <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-blue-800">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {appLinks.map((link) => (
                  <MenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                    >
                      {link.label}
                    </Link>
                  </MenuItem>
                ))}
                {outboundLinks.map((link) => (
                  <MenuItem key={link.href}>
                    <a
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  </MenuItem>
                ))}
                <MenuItem>
                  <Link
                    href="/api/auth/logout"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                  >
                    Logout
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
}
