import Image from "next/image"
import art from "../../assets/meditating.png"
import RefreshButton from "./refresh-button"

export default function ErrorScreen(props: { error: Error }) {
  const { error } = props

  return (
    <div className="py-16 px-4 text-center sm:px-6 lg:px-8">
      <Image
        className="mx-auto w-3/4 opacity-75 sm:w-1/2"
        src={art}
        alt=""
        width="400"
        height="314"
      />
      <h3 className="mt-10 text-sm font-medium text-gray-900">
        There was an error.
      </h3>
      <p className="mt-1 text-sm text-gray-500">{error.message}</p>
      <div className="mt-6">
        <RefreshButton />
      </div>
    </div>
  )
}
