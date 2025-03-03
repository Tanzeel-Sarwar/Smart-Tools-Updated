import Image from "next/image"

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-[100px]" />
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="About hero background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">About Smart Tools Hub</h1>
          <p className="text-gray-600">Learn more about our platform</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                Smart Tools Hub aims to provide a comprehensive suite of everyday tools that enhance productivity and
                simplify tasks. Our platform brings together essential utilities in one convenient location.
              </p>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Mission illustration"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-8">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Calculator feature"
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-lg font-medium text-white">Calculator</h3>
                </div>
                <p className="text-gray-600">A powerful calculator with support for basic mathematical operations.</p>
              </div>
              <div className="group">
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Todo feature"
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-lg font-medium text-white">To-Do List</h3>
                </div>
                <p className="text-gray-600">Manage your tasks with user attribution and due dates.</p>
              </div>
              <div className="group">
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Notes feature"
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-lg font-medium text-white">Notes</h3>
                </div>
                <p className="text-gray-600">Quick and easy note-taking with rich text support.</p>
              </div>
              <div className="group">
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Polls feature"
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-lg font-medium text-white">Polling System</h3>
                </div>
                <p className="text-gray-600">Create and participate in polls with real-time results.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 order-2 md:order-1">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Contact illustration"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-600">
                Have questions or suggestions? We&apos;d love to hear from you. Reach out to our team for support and
                feedback.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

