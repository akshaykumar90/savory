import EditTags from "@/components/edit-tags"
import { useNewBookmark } from "@/lib/queries"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid"
import { HTTPError } from "ky"
import { useEffect } from "react"
import browser from "webextension-polyfill"

export default function Popup() {
  return (
    <div className="w-[300px] p-2">
      <PopupContents />
    </div>
  )
}

function PopupContents() {
  const {
    isPending,
    isIdle,
    data: bookmark,
    error,
    mutate: addBookmark,
  } = useNewBookmark()

  useEffect(() => {
    const saveCurrentTab = async () => {
      let queryOptions = { active: true, lastFocusedWindow: true }
      let [tab] = await browser.tabs.query(queryOptions)
      if (tab && tab.url) {
        addBookmark({
          dateAddedMs: Date.now(),
          title: tab.title ?? "",
          url: tab.url,
        })
      }
    }
    saveCurrentTab()
  }, [addBookmark])

  if (isPending || isIdle) {
    return (
      <div className="flex min-h-[187px] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md p-4">
        <PopupError error={error} />
      </div>
    )
  }

  const nowMillis = new Date().getTime()
  const bookmarkCreated = bookmark.date_added
  const tenSecondMillis = 10 * 1000
  const isOldBookmark = bookmarkCreated < nowMillis - tenSecondMillis

  return (
    <Popover className="relative">
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            {isOldBookmark ? (
              <>
                <h3 className="text-sm font-medium text-green-800">
                  Already saved!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Last added on{" "}
                    {new Date(bookmark.date_added).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-medium text-green-800">
                  Added to Savory
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{bookmark.title}</p>
                </div>
              </>
            )}
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <PopoverButton
                  type="button"
                  className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  <span>Add tags</span>
                </PopoverButton>
                <button
                  type="button"
                  className="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  Open Savory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopoverPanel focus className="mt-2">
        <EditTags bookmarkId={bookmark.id} />
      </PopoverPanel>
    </Popover>
  )
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

function PopupError({ error }: { error: Error }) {
  // TODO: Make this work! API should actually return 401 when logged out.
  if (error instanceof HTTPError && error.response.status === 401) {
    return (
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Login to Savory
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            To add this tab to Savory, you need to log in or create a new
            account.
          </p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:text-sm"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">
          There was an error adding to Savory
        </h3>
        <div className="mt-2 text-sm text-red-700">
          <p>{error.toString()}</p>
        </div>
      </div>
    </div>
  )
}
