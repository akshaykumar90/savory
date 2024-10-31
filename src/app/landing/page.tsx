import Image from "next/image"
import Link from "next/link"
import logo from "../../assets/logo_light.svg"

export default function Home() {
  return (
    <div className="leading-normal">
      <nav className="sticky top-0 z-50 w-full bg-gray-100 bg-opacity-90">
        <div className="flex h-20 items-center justify-center md:mx-24 md:justify-between">
          <Link href="/">
            <Image className="h-16 w-auto" src={logo} alt="Savory" />
          </Link>
          <div className="hidden md:block">
            <a href="/api/auth/login" className="text-xs hover:underline">
              Sign In
            </a>
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col items-center py-8 text-center">
          <h3 className="mt-12 mb-8 text-3xl text-gray-800">
            Start organizing today
          </h3>
          <p className="mb-4 w-full text-lg text-gray-700 md:w-3/4 md:text-xl">
            Get started for free and re-discover your bookmarks with the power
            of Savory.
          </p>
          <a
            className="block mt-4 rounded bg-primary py-2 px-4 text-lg tracking-wide text-white hover:bg-blue-700 focus:outline-none"
            href="/api/auth/signup"
          >
            Create an Account
          </a>
          <p className="mt-4 text-xs leading-5 text-gray-700">
            Already have an account?{" "}
            <a href="/api/auth/login" className="underline">
              Sign In
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
