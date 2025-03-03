import { Skeleton } from "@/components/ui/skeleton"

export default function ToolsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-[100px]" />
        <div className="relative">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  )
}

