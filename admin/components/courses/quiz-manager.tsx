"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, HelpCircle, CheckCircle, XCircle } from "lucide-react"

interface Quiz {
  id: string
  lessonId: string
  lessonTitle: string
  questionCount: number
  passingScore: number
  attempts: number
  successRate: number
}

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    lessonId: "1",
    lessonTitle: "Introduction to React",
    questionCount: 5,
    passingScore: 80,
    attempts: 234,
    successRate: 87,
  },
  {
    id: "2",
    lessonId: "2",
    lessonTitle: "Components and Props",
    questionCount: 8,
    passingScore: 75,
    attempts: 198,
    successRate: 82,
  },
  {
    id: "3",
    lessonId: "3",
    lessonTitle: "State Management Basics",
    questionCount: 10,
    passingScore: 80,
    attempts: 156,
    successRate: 78,
  },
]

export function QuizManager() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes)
  const [showQuizDialog, setShowQuizDialog] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)

  const handleCreateQuiz = () => {
    console.log("[v0] Opening create quiz dialog")
    setEditingQuiz(null)
    setShowQuizDialog(true)
  }

  const handleEditQuiz = (quiz: Quiz) => {
    console.log("[v0] Editing quiz:", quiz.id)
    setEditingQuiz(quiz)
    setShowQuizDialog(true)
  }

  const handleSaveQuiz = () => {
    console.log("[v0] Saving quiz:", editingQuiz ? "edit" : "create")
    setShowQuizDialog(false)
    setEditingQuiz(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Quiz Manager</h2>
          <p className="mt-1 text-gray-400">Create and manage lesson quizzes</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleCreateQuiz}>
          <Plus className="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 text-amber-500">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-100 line-clamp-1">{quiz.lessonTitle}</h3>
                  <p className="text-sm text-gray-400">{quiz.questionCount} questions</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Passing Score</span>
                <Badge className="bg-blue-600">{quiz.passingScore}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Attempts</span>
                <span className="font-medium text-gray-100">{quiz.attempts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Success Rate</span>
                <div className="flex items-center gap-1">
                  {quiz.successRate >= 80 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium text-gray-100">{quiz.successRate}%</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 bg-transparent"
                onClick={() => handleEditQuiz(quiz)}
              >
                Edit Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingQuiz ? "Update quiz details" : "Add a new quiz to a lesson"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Lesson</Label>
              <Select defaultValue={editingQuiz?.lessonId || "1"}>
                <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="1">Introduction to React</SelectItem>
                  <SelectItem value="2">Components and Props</SelectItem>
                  <SelectItem value="3">State Management Basics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Number of Questions</Label>
                <Input
                  type="number"
                  defaultValue={editingQuiz?.questionCount || 5}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Passing Score (%)</Label>
                <Input
                  type="number"
                  defaultValue={editingQuiz?.passingScore || 80}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleSaveQuiz}>
                {editingQuiz ? "Update Quiz" : "Create Quiz"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                onClick={() => setShowQuizDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
