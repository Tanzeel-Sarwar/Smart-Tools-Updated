import { Suspense } from "react"
import { Calculator, ListTodo, StickyNote, BarChart3, Cloud } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

function ToolsGrid() {
  const tools = [
    {
      icon: <Calculator className="w-8 h-8 text-blue-500" />,
      title: "Calculator",
      description: "Perform quick calculations",
      href: "/tools/calculator",
    },
    {
      icon: <ListTodo className="w-8 h-8 text-blue-500" />,
      title: "To-Do List",
      description: "Manage your tasks efficiently",
      href: "/tools/todo",
    },
    {
      icon: <StickyNote className="w-8 h-8 text-blue-500" />,
      title: "Notes",
      description: "Take and save quick notes",
      href: "/tools/notes",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      title: "Polling System",
      description: "Create and participate in real-time polls",
      href: "/tools/polls",
    },
    {
      icon: <Cloud className="w-8 h-8 text-blue-500" />,
      title: "Weather",
      description: "Check weather forecasts worldwide",
      href: "/tools/weather",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {tools.map((tool, index) => (
        <Link key={tool.title} href={tool.href}>
          <Card
            className="h-full transform-gpu transition-all duration-300 hover:scale-105 hover:-translate-y-1
                      bg-gradient-to-br from-white to-gray-50
                      shadow-[0.25rem_0.25rem_0.75rem_rgba(0,0,0,0.15),
                              inset_0.5rem_0.5rem_0.5rem_rgba(255,255,255,0.9),
                              inset_-0.25rem_-0.25rem_0.5rem_rgba(0,0,0,0.05)]
                      rounded-xl border border-gray-200/50
                      animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                {tool.icon}
              </div>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {tool.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              <p>{tool.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen page-transition">
      <section className="relative py-12 md:py-20 text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-[100px]" />
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Hero background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Welcome to Smart Tools Hub
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8 animate-fade-in">
            Your one-stop solution for everyday tasks
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-[200px] rounded-xl" />
              ))}
            </div>
          }
        >
          <ToolsGrid />
        </Suspense>
      </section>
    </div>
  )
}

