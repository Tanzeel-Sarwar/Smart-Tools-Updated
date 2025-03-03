"use client"

import { useState, useEffect, Suspense } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import Image from "next/image"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  userName: string
  color: string
}

const COLORS = ["bg-pink-100", "bg-blue-100", "bg-purple-100", "bg-green-100", "bg-yellow-100"]

function NotesContent() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newNote, setNewNote] = useState("")
  const [userName, setUserName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const { toast } = useToast()

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const addOrUpdateNote = () => {
    if (!newTitle.trim() || !newNote.trim() || !userName.trim()) return

    if (editingNote) {
      setNotes(
        notes.map((note) => (note.id === editingNote.id ? { ...note, title: newTitle, content: newNote } : note)),
      )
      toast({
        title: "Note Updated",
        description: `Note "${newTitle}" has been updated`,
      })
    } else {
      const note: Note = {
        id: Date.now().toString(),
        title: newTitle,
        content: newNote,
        createdAt: new Date().toLocaleString(),
        userName: userName,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
      setNotes([note, ...notes])
      toast({
        title: "New Note Added",
        description: `Note "${newTitle}" created by ${userName}`,
      })
    }

    setNewTitle("")
    setNewNote("")
    setIsDialogOpen(false)
    setEditingNote(null)
  }

  const startEdit = (note: Note) => {
    setEditingNote(note)
    setNewTitle(note.title)
    setNewNote(note.content)
    setIsDialogOpen(true)
  }

  const deleteNote = (noteId: string, noteTitle: string) => {
    setNotes(notes.filter((n) => n.id !== noteId))
    toast({
      title: "Note Deleted",
      description: `Note "${noteTitle}" has been deleted`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-[100px]" />
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Notes hero background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Notes</h1>
          <p className="text-gray-600">Jot down your thoughts and ideas</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Add New Note</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-lg">
              <DialogHeader>
                <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Note title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Write your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={6}
                  className="resize-y min-h-[100px]"
                />
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={addOrUpdateNote}
                  disabled={!newTitle.trim() || !newNote.trim() || !userName.trim()}
                >
                  {editingNote ? "Update Note" : "Add Note"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <Card
              key={note.id}
              className={`${note.color} shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{note.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(note)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteNote(note.id, note.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="prose max-w-none">
                    <div className="line-clamp-6 text-gray-700">{note.content}</div>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-sm text-gray-500 border-t">
                    <span>{note.userName}</span>
                    <span>{note.createdAt}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Notes() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Loader />
        </div>
      }
    >
      <NotesContent />
    </Suspense>
  )
}

