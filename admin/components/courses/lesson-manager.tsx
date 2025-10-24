"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Video, FileText, Code, HelpCircle, Lock, Unlock, Eye, Trash2, Upload, LinkIcon, X } from "lucide-react"

interface Lesson {
  id: string
  courseId: string
  courseName: string
  title: string
  type: "Video" | "Text" | "Quiz" | "Code"
  duration: string
  accessType: "Free" | "Premium"
  aiEnabled: boolean
  order: number
  videoType?: "upload" | "youtube"
  videoFile?: File | null
  youtubeUrl?: string
  textContent?: string
  codeSnippets?: { language: string; code: string }[]
  attachments?: File[]
  quizzes?: { question: string; options: string[]; correctAnswer: number }[]
}

const mockLessons: Lesson[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "React Fundamentals",
    title: "Introduction to React",
    type: "Video",
    duration: "15 min",
    accessType: "Free",
    aiEnabled: true,
    order: 1,
    videoType: "upload",
    videoFile: null,
    youtubeUrl: "",
    textContent: "",
    codeSnippets: [{ language: "javascript", code: "" }],
    attachments: [],
    quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  },
  {
    id: "2",
    courseId: "1",
    courseName: "React Fundamentals",
    title: "Components and Props",
    type: "Video",
    duration: "22 min",
    accessType: "Free",
    aiEnabled: true,
    order: 2,
    videoType: "upload",
    videoFile: null,
    youtubeUrl: "",
    textContent: "",
    codeSnippets: [{ language: "javascript", code: "" }],
    attachments: [],
    quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  },
  {
    id: "3",
    courseId: "1",
    courseName: "React Fundamentals",
    title: "State Management Basics",
    type: "Video",
    duration: "18 min",
    accessType: "Premium",
    aiEnabled: true,
    order: 3,
    videoType: "upload",
    videoFile: null,
    youtubeUrl: "",
    textContent: "",
    codeSnippets: [{ language: "javascript", code: "" }],
    attachments: [],
    quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  },
  {
    id: "4",
    courseId: "2",
    courseName: "Advanced TypeScript",
    title: "Generics Deep Dive",
    type: "Code",
    duration: "30 min",
    accessType: "Premium",
    aiEnabled: true,
    order: 1,
    videoType: "upload",
    videoFile: null,
    youtubeUrl: "",
    textContent: "",
    codeSnippets: [{ language: "typescript", code: "" }],
    attachments: [],
    quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  },
]

export function LessonManager() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)
  const [courseFilter, setCourseFilter] = useState("all")
  const [showLessonDialog, setShowLessonDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  const [lessonForm, setLessonForm] = useState({
    videoType: "upload" as "upload" | "youtube",
    videoFile: null as File | null,
    youtubeUrl: "",
    textContent: "",
    codeSnippets: [{ language: "javascript", code: "" }],
    attachments: [] as File[],
    quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  })

  const filteredLessons = lessons.filter((lesson) => courseFilter === "all" || lesson.courseId === courseFilter)

  const getTypeIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "Video":
        return <Video className="h-4 w-4" />
      case "Text":
        return <FileText className="h-4 w-4" />
      case "Code":
        return <Code className="h-4 w-4" />
      case "Quiz":
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const handleCreateLesson = () => {
    console.log("[v0] Opening create lesson dialog")
    setEditingLesson(null)
    setLessonForm({
      videoType: "upload",
      videoFile: null,
      youtubeUrl: "",
      textContent: "",
      codeSnippets: [{ language: "javascript", code: "" }],
      attachments: [],
      quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
    })
    setShowLessonDialog(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    console.log("[v0] Editing lesson:", lesson.id)
    setEditingLesson(lesson)
    setLessonForm({
      videoType: lesson.videoType || "upload",
      videoFile: lesson.videoFile || null,
      youtubeUrl: lesson.youtubeUrl || "",
      textContent: lesson.textContent || "",
      codeSnippets: lesson.codeSnippets || [{ language: "javascript", code: "" }],
      attachments: lesson.attachments || [],
      quizzes: lesson.quizzes || [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
    })
    setShowLessonDialog(true)
  }

  const handleSaveLesson = () => {
    console.log("[v0] Saving lesson:", editingLesson ? "edit" : "create")
    console.log("[v0] Lesson form data:", lessonForm)
    setShowLessonDialog(false)
    setEditingLesson(null)
  }

  const handleDeleteLesson = (lesson: Lesson) => {
    console.log("[v0] Deleting lesson:", lesson.id)
    if (confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      setLessons(lessons.filter((l) => l.id !== lesson.id))
    }
  }

  const handleViewLesson = (lesson: Lesson) => {
    console.log("[v0] Viewing lesson:", lesson.id)
    setEditingLesson(lesson)
    setShowLessonDialog(true)
  }

  const addCodeSnippet = () => {
    setLessonForm({
      ...lessonForm,
      codeSnippets: [...lessonForm.codeSnippets, { language: "javascript", code: "" }],
    })
  }

  const removeCodeSnippet = (index: number) => {
    setLessonForm({
      ...lessonForm,
      codeSnippets: lessonForm.codeSnippets.filter((_, i) => i !== index),
    })
  }

  const addQuiz = () => {
    setLessonForm({
      ...lessonForm,
      quizzes: [...lessonForm.quizzes, { question: "", options: ["", "", "", ""], correctAnswer: 0 }],
    })
  }

  const removeQuiz = (index: number) => {
    setLessonForm({
      ...lessonForm,
      quizzes: lessonForm.quizzes.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Lesson Manager</h2>
          <p className="mt-1 text-gray-400">Manage lessons, videos, and learning materials</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleCreateLesson}>
          <Plus className="mr-2 h-4 w-4" />
          Create Lesson
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-[250px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="1">React Fundamentals</SelectItem>
            <SelectItem value="2">Advanced TypeScript</SelectItem>
            <SelectItem value="3">Python for Data Science</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredLessons.map((lesson) => (
          <Card key={lesson.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 text-amber-500">
                    {getTypeIcon(lesson.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100">{lesson.title}</h3>
                    <p className="text-sm text-gray-400">{lesson.courseName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {lesson.type}
                  </Badge>
                  <Badge className={lesson.accessType === "Premium" ? "bg-amber-600" : "bg-green-600"}>
                    {lesson.accessType === "Premium" ? (
                      <Lock className="mr-1 h-3 w-3" />
                    ) : (
                      <Unlock className="mr-1 h-3 w-3" />
                    )}
                    {lesson.accessType}
                  </Badge>
                  {lesson.aiEnabled && <Badge className="bg-blue-600">AI Q&A</Badge>}
                  <span className="text-sm text-gray-400">{lesson.duration}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 bg-transparent"
                    onClick={() => handleViewLesson(lesson)}
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 bg-transparent"
                    onClick={() => handleEditLesson(lesson)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 bg-transparent"
                    onClick={() => handleDeleteLesson(lesson)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">{editingLesson ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingLesson
                ? "Update lesson details"
                : "Add a comprehensive lesson with video, text, code, and quizzes"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="bg-gray-700">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="code">Code Snippets</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Course</Label>
                <Select defaultValue={editingLesson?.courseId || "1"}>
                  <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="1">React Fundamentals</SelectItem>
                    <SelectItem value="2">Advanced TypeScript</SelectItem>
                    <SelectItem value="3">Python for Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Lesson Title</Label>
                <Input
                  defaultValue={editingLesson?.title}
                  placeholder="Enter lesson title..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Type</Label>
                  <Select defaultValue={editingLesson?.type || "Video"}>
                    <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Text">Text</SelectItem>
                      <SelectItem value="Code">Code</SelectItem>
                      <SelectItem value="Quiz">Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Duration</Label>
                  <Input
                    defaultValue={editingLesson?.duration}
                    placeholder="e.g., 15 min"
                    className="border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
                <div>
                  <Label className="text-gray-300">Premium Content</Label>
                  <p className="text-sm text-gray-500">Require subscription to access</p>
                </div>
                <Switch defaultChecked={editingLesson?.accessType === "Premium"} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
                <div>
                  <Label className="text-gray-300">Enable AI Q&A</Label>
                  <p className="text-sm text-gray-500">Allow students to ask questions</p>
                </div>
                <Switch defaultChecked={editingLesson?.aiEnabled} />
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Video Source</Label>
                <Select
                  value={lessonForm.videoType}
                  onValueChange={(value: "upload" | "youtube") => setLessonForm({ ...lessonForm, videoType: value })}
                >
                  <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="upload">Upload Video</SelectItem>
                    <SelectItem value="youtube">YouTube URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {lessonForm.videoType === "upload" ? (
                <div className="space-y-2">
                  <Label className="text-gray-300">Upload Video File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setLessonForm({ ...lessonForm, videoFile: e.target.files?.[0] || null })}
                      className="border-gray-700 bg-gray-900 text-gray-100"
                    />
                    <Button variant="outline" className="border-gray-700 bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {lessonForm.videoFile && (
                    <p className="text-sm text-green-500">Selected: {lessonForm.videoFile.name}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-gray-300">YouTube URL</Label>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                    <Input
                      value={lessonForm.youtubeUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="border-gray-700 bg-gray-900 text-gray-100"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Lesson Text Content</Label>
                <Textarea
                  value={lessonForm.textContent}
                  onChange={(e) => setLessonForm({ ...lessonForm, textContent: e.target.value })}
                  placeholder="Enter the lesson content that will accompany the video..."
                  className="border-gray-700 bg-gray-900 text-gray-100 min-h-[200px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Code Snippets (Students can copy)</Label>
                <Button size="sm" onClick={addCodeSnippet} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Snippet
                </Button>
              </div>
              {lessonForm.codeSnippets.map((snippet, index) => (
                <Card key={index} className="border-gray-700 bg-gray-900 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Select
                        value={snippet.language}
                        onValueChange={(value) => {
                          const newSnippets = [...lessonForm.codeSnippets]
                          newSnippets[index].language = value
                          setLessonForm({ ...lessonForm, codeSnippets: newSnippets })
                        }}
                      >
                        <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-gray-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-gray-700 bg-gray-800">
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCodeSnippet(index)}
                        className="border-red-600 text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={snippet.code}
                      onChange={(e) => {
                        const newSnippets = [...lessonForm.codeSnippets]
                        newSnippets[index].code = e.target.value
                        setLessonForm({ ...lessonForm, codeSnippets: newSnippets })
                      }}
                      placeholder="Enter code snippet..."
                      className="border-gray-700 bg-gray-800 text-gray-100 font-mono text-sm min-h-[150px]"
                    />
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="files" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Attachments (PDF, DOC, etc.)</Label>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  onChange={(e) => setLessonForm({ ...lessonForm, attachments: Array.from(e.target.files || []) })}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
                {lessonForm.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {lessonForm.attachments.map((file, index) => (
                      <p key={index} className="text-sm text-green-500">
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Quizzes (Must complete before next lesson)</Label>
                  <p className="text-sm text-gray-500">Students must pass these quizzes to unlock the next lesson</p>
                </div>
                <Button size="sm" onClick={addQuiz} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quiz
                </Button>
              </div>
              {lessonForm.quizzes.map((quiz, quizIndex) => (
                <Card key={quizIndex} className="border-gray-700 bg-gray-900 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Quiz {quizIndex + 1}</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeQuiz(quizIndex)}
                        className="border-red-600 text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Question</Label>
                      <Input
                        value={quiz.question}
                        onChange={(e) => {
                          const newQuizzes = [...lessonForm.quizzes]
                          newQuizzes[quizIndex].question = e.target.value
                          setLessonForm({ ...lessonForm, quizzes: newQuizzes })
                        }}
                        placeholder="Enter quiz question..."
                        className="border-gray-700 bg-gray-900 text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Options</Label>
                      {quiz.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newQuizzes = [...lessonForm.quizzes]
                              newQuizzes[quizIndex].options[optionIndex] = e.target.value
                              setLessonForm({ ...lessonForm, quizzes: newQuizzes })
                            }}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="border-gray-700 bg-gray-900 text-gray-100"
                          />
                          <Button
                            size="sm"
                            variant={quiz.correctAnswer === optionIndex ? "default" : "outline"}
                            onClick={() => {
                              const newQuizzes = [...lessonForm.quizzes]
                              newQuizzes[quizIndex].correctAnswer = optionIndex
                              setLessonForm({ ...lessonForm, quizzes: newQuizzes })
                            }}
                            className={quiz.correctAnswer === optionIndex ? "bg-green-600" : "border-gray-700"}
                          >
                            {quiz.correctAnswer === optionIndex ? "Correct" : "Set Correct"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleSaveLesson}>
              {editingLesson ? "Update Lesson" : "Create Lesson"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
              onClick={() => setShowLessonDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
