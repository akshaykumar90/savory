export default function Loading() {
  return (
    <div className="p-4">
      <div className="h-5 w-1/6 rounded-lg bg-blue-100/40"></div>
      <div className="flex items-start gap-4 pt-8">
        <div className="h-5 w-5 rounded-lg bg-blue-100/40"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/5 rounded-lg bg-blue-100/70"></div>
          <div className="h-5 w-4/5 rounded-lg bg-blue-100/40"></div>
          <div className="h-5 w-2/5 rounded-lg bg-blue-100/40"></div>
        </div>
      </div>
    </div>
  )
}
