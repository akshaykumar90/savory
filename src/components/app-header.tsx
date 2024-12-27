import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import logo from "../assets/logo_light.svg"

const mktSiteUrl = process.env.MKT_SITE_URL

const appLinks = [
  {
    href: "/settings",
    label: "Settings",
  },
]

const outboundLinks = [
  {
    href: `${mktSiteUrl}/getting-started`,
    label: "Help",
  },
  {
    href: `${mktSiteUrl}/feedback`,
    label: "Give feedback",
  },
]

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  return (
    <MenuItem>
      {href.startsWith("/auth") ? (
        <a
          href={href}
          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
        >
          {label}
        </a>
      ) : href.startsWith("/") ? (
        <Link
          href={href}
          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
        >
          {label}
        </Link>
      ) : (
        <a
          href={href}
          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
          target="_blank"
        >
          {label}
        </a>
      )}
    </MenuItem>
  )
}

function MobileNavLink({ href, label }: { href: string; label: string }) {
  const child = (
    <DisclosureButton
      as="div"
      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
    >
      {label}
    </DisclosureButton>
  )
  return href.startsWith("/auth") ? (
    <a href={href}>{child}</a>
  ) : href.startsWith("/") ? (
    <Link href={href}>{child}</Link>
  ) : (
    <a href={href} target="_blank">
      {child}
    </a>
  )
}

export default function AppHeader({
  children,
}: Readonly<{
  children?: React.ReactNode
}>) {
  return (
    <Disclosure as="nav" className="border-b bg-default">
      <div className="px-2 sm:px-4 lg:px-8">
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

          {/* Optional search section */}
          {children}

          <div className="flex lg:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                className="block h-6 w-6 group-data-[open]:hidden"
                aria-hidden="true"
              />
              <XMarkIcon
                className="hidden h-6 w-6 group-data-[open]:block"
                aria-hidden="true"
              />
            </DisclosureButton>
          </div>

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
                    <DesktopNavLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                    />
                  ))}
                  {outboundLinks.map((link) => (
                    <DesktopNavLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                    />
                  ))}
                  <DesktopNavLink href="/auth/logout" label="Logout" />
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 pt-2 pb-3">
          <MobileNavLink href="/" label="Bookmarks" />
          <MobileNavLink href="/tags" label="Tags" />
          <MobileNavLink href="/?name=reading" label="Reading" />
          <MobileNavLink href="/?name=playlist" label="Playlist" />
        </div>
        <div className="space-y-1 border-t border-gray-200 pt-2 pb-3">
          {appLinks.map((link) => (
            <MobileNavLink
              key={link.href}
              href={link.href}
              label={link.label}
            />
          ))}
          {outboundLinks.map((link) => (
            <MobileNavLink
              key={link.href}
              href={link.href}
              label={link.label}
            />
          ))}
          <MobileNavLink href="/auth/logout" label="Logout" />
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
