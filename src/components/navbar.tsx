"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown, Menu, Boxes } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

const tools = [
  { title: "Calculator", href: "/tools/calculator" },
  { title: "To-Do List", href: "/tools/todo" },
  { title: "Notes", href: "/tools/notes" },
  { title: "Polling System", href: "/tools/polls" },
  { title: "Weather", href: "/tools/weather" },
]

function NavLinks() {
  const pathname = usePathname()

  return (
    <Suspense
      fallback={
        <div className="hidden md:flex space-x-4">
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
        </div>
      }
    >
      <nav className="hidden md:flex space-x-4">
        <Link
          href="/"
          className={cn("px-4 py-2 hover:text-blue-600 transition-colors", pathname === "/" && "text-blue-600")}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={cn("px-4 py-2 hover:text-blue-600 transition-colors", pathname === "/about" && "text-blue-600")}
        >
          About
        </Link>
        <div className="relative group">
          <button
            className={cn(
              "px-4 py-2 hover:text-blue-600 transition-colors flex items-center",
              pathname.startsWith("/tools") && "text-blue-600",
            )}
          >
            Tools <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {tools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={cn(
                    "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors",
                    pathname === tool.href && "bg-gray-100 text-gray-900",
                  )}
                  role="menuitem"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </Suspense>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-7 w-7" /> {/* Increased icon size */}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Boxes className="h-6 w-6" />
            Smart Tools Hub
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-8">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={cn(
              "px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors",
              pathname === "/" && "bg-gray-100 text-blue-600",
            )}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className={cn(
              "px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors",
              pathname === "/about" && "bg-gray-100 text-blue-600",
            )}
          >
            About
          </Link>
          <div className="px-4 py-2">
            <h3 className="font-semibold mb-2">Tools</h3>
            <div className="space-y-2 pl-4">
              {tools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors",
                    pathname === tool.href && "bg-gray-100 text-blue-600",
                  )}
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )

  return (
    <header className="border-b relative z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <Boxes className="h-6 w-6 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Smart Tools Hub
          </span>
        </Link>

        <MobileMenu />
        <NavLinks />
      </div>
    </header>
  )
}

