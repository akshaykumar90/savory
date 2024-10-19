import clsx from "clsx"

export default function TagButton({
  name,
  accented,
  showRemove,
  onClick,
}: {
  name: string
  accented?: boolean
  showRemove?: boolean
  onClick: () => void
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium flex-none",
        accented ? "bg-pink-100 text-pink-800" : "bg-indigo-100 text-indigo-800"
      )}
      onClick={onClick}
    >
      {name}
      {showRemove && (
        <span
          className={clsx(
            "ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md focus:text-white focus:outline-none",
            accented
              ? "text-pink-400 hover:bg-pink-200 hover:text-pink-500 focus:bg-pink-500"
              : "text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500"
          )}
        >
          <span className="sr-only">Remove tag</span>
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </span>
      )}
    </button>
  )
}
