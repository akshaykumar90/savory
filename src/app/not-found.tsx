import Link from "next/link"
import Image from "next/image"
import logo from "../assets/logo_light.svg"

export default function NotFound() {
  return (
    <div>
      <header className="sticky top-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90 px-4 py-4 md:justify-between md:px-16">
        <div>
          <Link href="/">
            <Image className="w-24" src={logo} priority={true} alt="Savory" />
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col items-center py-8 text-center">
          <h3 className="mt-12 mb-8 text-3xl text-gray-800">Page Not Found</h3>
          <p className="mb-4 w-3/4 text-xl text-gray-700">
            We could not find what you were looking for.
          </p>
          <Link href="/">
            <button className="mt-4 select-none rounded bg-primary py-2 px-4 text-lg tracking-wide text-white hover:bg-blue-700 focus:outline-none">
              Go back home
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
