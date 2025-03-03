"use client"

import { useState, useEffect, Suspense } from "react"
import { Plus, Calendar, User, AlertCircle, Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import Image from "next/image"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
  userName: string
  assignedTo: string
  dueDate: string
  priority: string
}

function TodoContent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [userName, setUserName] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [date, setDate] = useState<Date>()
  const [priority, setPriority] = useState("medium")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!newTodo.trim() || !userName.trim() || !date || !assignedTo) return
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toLocaleString(),
      userName: userName,
      assignedTo: assignedTo,
      dueDate: date.toISOString(),
      priority,
    }
    setTodos([todo, ...todos])
    setNewTodo("")
    setDate(undefined)
    setPriority("medium")
    toast({
      title: "New Task Added",
      description: `Task "${newTodo}" has been assigned to ${assignedTo}`,
    })
    setIsDialogOpen(false)
  }

  const toggleTodo = (todoId: string, completed: boolean) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          toast({
            title: completed ? "Task Completed" : "Task Uncompleted",
            description: `Task "${todo.text}" has been ${completed ? "completed" : "marked as pending"}`,
          })
          return { ...todo, completed }
        }
        return todo
      }),
    )
  }

  const userNames = Array.from(new Set(todos.map((todo) => todo.assignedTo)))
  const filteredTodos = todos.filter((todo) => todo.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))

  const groupedTodos = filteredTodos.reduce(
    (acc, todo) => {
      const status = todo.completed ? "completed" : "pending"
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(todo)
      return acc
    },
    {} as Record<string, Todo[]>,
  )

  return (
    <div className="min-h-screen">
      <section className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-[100px]" />
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Todo hero background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">To-Do List</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 order-2 sm:order-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
              <Input
                type="text"
                placeholder="Search tasks by assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 w-full"
                list="user-list"
              />
              <datalist id="user-list">
                {userNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto order-1 sm:order-2">
                <Plus className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Add New Task</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-lg">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Created By</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Assigned To</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Assignee name"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Task Title</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Due Date</span>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Priority</span>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={addTodo}
                  disabled={!newTodo.trim() || !userName.trim() || !date || !assignedTo}
                >
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {groupedTodos.pending?.map((todo) => (
                <TodoCard key={todo.id} todo={todo} onToggle={toggleTodo} />
              ))}
              {!groupedTodos.pending?.length && (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">No pending tasks</CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-4">
              {groupedTodos.completed?.map((todo) => (
                <TodoCard key={todo.id} todo={todo} onToggle={toggleTodo} />
              ))}
              {!groupedTodos.completed?.length && (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">No completed tasks</CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function TodoCard({ todo, onToggle }: { todo: Todo; onToggle: (id: string, completed: boolean) => void }) {
  return (
    <Card className={cn("transition-all duration-200", todo.completed ? "opacity-75" : "", "hover:shadow-md")}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
            className="mt-1 h-4 w-4 sm:h-5 sm:w-5" // Adjusted checkbox size
          />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className={cn("font-medium", todo.completed && "line-through text-gray-500")}>{todo.text}</p>
              <div
                className={cn(
                  "px-2 py-1 rounded-full text-xs",
                  todo.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : todo.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700",
                )}
              >
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  Created by {todo.userName} • Assigned to {todo.assignedTo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Todo() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Loader />
        </div>
      }
    >
      <TodoContent />
    </Suspense>
  )
}

