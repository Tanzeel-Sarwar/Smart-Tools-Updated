import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import Loader from "@/components/ui/loader"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Tools",
  description: "Your one-stop solution for everyday tasks",
}

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <Loader />
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow relative">
            <Suspense fallback={<PageLoader />}>{children}</Suspense>
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}

