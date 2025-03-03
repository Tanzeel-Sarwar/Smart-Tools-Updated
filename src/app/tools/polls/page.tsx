"use client"

import { useState, useEffect, Suspense } from "react"
import { Plus, Users, UserPlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import Image from "next/image"

interface Vote {
  userId: string
  optionId: string
  userName: string
}

interface Option {
  id: string
  text: string
  votes: Vote[]
}

interface Poll {
  id: string
  question: string
  options: Option[]
  createdAt: string
  createdBy: string
}

function PollsContent() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [newOptions, setNewOptions] = useState(["", ""])
  const [userName, setUserName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingVoter, setIsAddingVoter] = useState(false)
  const [newVoterName, setNewVoterName] = useState("")
  const { toast } = useToast()

  // Load polls from localStorage
  useEffect(() => {
    const savedPolls = localStorage.getItem("polls")
    if (savedPolls) {
      setPolls(JSON.parse(savedPolls))
    }
  }, [])

  // Save polls to localStorage
  useEffect(() => {
    localStorage.setItem("polls", JSON.stringify(polls))
  }, [polls])

  const addPoll = () => {
    if (!newQuestion.trim() || newOptions.some((opt) => !opt.trim()) || !userName.trim()) return
    const poll: Poll = {
      id: Date.now().toString(),
      question: newQuestion,
      options: newOptions.map((opt) => ({
        id: Math.random().toString(),
        text: opt,
        votes: [],
      })),
      createdAt: new Date().toLocaleString(),
      createdBy: userName,
    }
    setPolls([poll, ...polls])
    setNewQuestion("")
    setNewOptions(["", ""])
    setIsDialogOpen(false)
    toast({
      title: "New Poll Created",
      description: `Poll "${newQuestion}" created by ${userName}`,
    })
  }

  const vote = (pollId: string, optionId: string, voterName: string) => {
    if (!voterName.trim()) return

    setPolls(
      polls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map((opt) => ({
              ...opt,
              votes:
                opt.id === optionId
                  ? [...opt.votes, { userId: Date.now().toString(), optionId, userName: voterName }]
                  : opt.votes,
            })),
          }
        }
        return poll
      }),
    )

    toast({
      title: "Vote Recorded",
      description: `${voterName} voted on the poll`,
    })
  }

  const deletePoll = (pollId: string) => {
    setPolls(polls.filter((poll) => poll.id !== pollId))
    toast({
      title: "Poll Deleted",
      description: "The poll has been deleted",
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
              alt="Polls hero background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Polling System</h1>
          <p className="text-gray-600">Create and participate in polls</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Create New Poll</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-lg">
              <DialogHeader>
                <DialogTitle>Create New Poll</DialogTitle>
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
                  placeholder="Enter your question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                {newOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const updated = [...newOptions]
                        updated[index] = e.target.value
                        setNewOptions(updated)
                      }}
                    />
                    {index >= 2 && (
                      <Button
                        variant="destructive"
                        onClick={() => setNewOptions(newOptions.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                {newOptions.length < 5 && (
                  <Button variant="outline" onClick={() => setNewOptions([...newOptions, ""])} className="w-full">
                    Add Option
                  </Button>
                )}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={addPoll}
                  disabled={!newQuestion.trim() || newOptions.some((opt) => !opt.trim()) || !userName.trim()}
                >
                  Create Poll
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)

            return (
              <Card key={poll.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{poll.question}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Created by {poll.createdBy} on {poll.createdAt}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deletePoll(poll.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => {
                        setNewVoterName("")
                        setIsAddingVoter(true)
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Voter
                    </Button>
                  </div>

                  <Dialog open={isAddingVoter} onOpenChange={setIsAddingVoter}>
                    <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-lg">
                      <DialogHeader>
                        <DialogTitle>Add New Voter</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Input
                          type="text"
                          placeholder="Voter's name"
                          value={newVoterName}
                          onChange={(e) => setNewVoterName(e.target.value)}
                        />
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            if (newVoterName.trim()) {
                              setUserName(newVoterName)
                              setIsAddingVoter(false)
                            }
                          }}
                        >
                          Add Voter
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-4">
                    {poll.options.map((option) => {
                      const percentage = totalVotes === 0 ? 0 : (option.votes.length / totalVotes) * 100

                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>{option.text}</span>
                            <span className="text-sm text-gray-500">
                              {option.votes.length} vote{option.votes.length !== 1 ? "s" : ""} ({percentage.toFixed(1)}
                              %)
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Progress value={percentage} className="flex-1" />
                            <Button
                              onClick={() => vote(poll.id, option.id, userName)}
                              variant="outline"
                              size="sm"
                              disabled={!userName}
                            >
                              Vote
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {!userName && <p className="text-sm text-red-500 mt-4">Please add your name to vote</p>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Polls() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Loader />
        </div>
      }
    >
      <PollsContent />
    </Suspense>
  )
}

