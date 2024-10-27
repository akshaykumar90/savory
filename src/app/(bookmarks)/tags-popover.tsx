import EditTags from "@/components/edit-tags"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useSearchParams } from "next/navigation"

export default function TagsPopover({
  bookmarkId,
  className,
  children,
}: {
  bookmarkId: string | string[]
  className?: string
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const pageTags = searchParams.getAll("name")

  return (
    <Popover className="relative">
      <PopoverButton type="button" className={className}>
        {children}
      </PopoverButton>
      <PopoverPanel
        focus
        className="absolute left-0 z-50 mt-3 w-screen max-w-xs px-2 sm:px-0"
      >
        <EditTags bookmarkId={bookmarkId} pageTags={pageTags} />
      </PopoverPanel>
    </Popover>
  )
}
