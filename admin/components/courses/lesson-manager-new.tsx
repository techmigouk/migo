"use client"

import { useState, useEffect } from "react"
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
import { Plus, Video, FileText, Code, HelpCircle, Eye, Trash2, Upload, LinkIcon, X, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Programming languages for code snippets
const PROGRAMMING_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Ruby', 'Go', 'Rust',
  'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell', 'Lua', 'Dart',
  'HTML', 'CSS', 'SCSS', 'LESS', 'SQL', 'GraphQL', 'JSON', 'XML', 'YAML', 'Markdown',
  'Shell', 'Bash', 'PowerShell', 'Objective-C', 'Assembly', 'COBOL', 'Fortran', 'Ada',
  'Elixir', 'Erlang', 'F#', 'Clojure', 'Groovy', 'Julia', 'Solidity', 'Vue', 'Svelte'
];

interface Course {
  _id: string
  title: string
  price: number
}

interface Lesson {
  _id?: string
  courseId: string
  title: string
  description: string
  content: string
  type: "Video" | "Text" | "Quiz" | "Code"
  duration: number // in minutes
  order: number
  aiEnabled: boolean
  videoType?: "upload" | "youtube"
  videoUrl?: string
  youtubeUrl?: string
  codeSnippets?: { language: string; code: string }[]
  attachments?: { name: string; url: string; type: string }[]
  quizzes?: { question: string; options: string[]; correctAnswer: number }[]
  isPreview?: boolean
}

interface LessonForm {
  courseId: string
  title: string
  description: string
  content: string
  type: "Video" | "Text" | "Quiz" | "Code"
  duration: number
  order: number
  aiEnabled: boolean
  videoType: "upload" | "youtube"
  videoFile: File | null
  videoUrl: string
  youtubeUrl: string
  codeSnippets: { language: string; code: string }[]
  attachmentFiles: File[]
  attachments: { name: string; url: string; type: string }[]
  quizzes: { question: string; options: string[]; correctAnswer: number }[]
  bulkQuizText: string
}

export function LessonManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [courseFilter, setCourseFilter] = useState("all")
  const [showLessonDialog, setShowLessonDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const [lessonForm, setLessonForm] = useState<LessonForm>({
    courseId: "",
    title: "",
    description: "",
    content: "",
    type: "Video",
    duration: 0,
    order: 1,
    aiEnabled: true,
    videoType: "upload",
    videoFile: null,
    videoUrl: "",
    youtubeUrl: "",
    codeSnippets: [{ language: "JavaScript", code: "" }],
    attachmentFiles: [],
    attachments: [],
    quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
    bulkQuizText: ""
  })

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses()
  }, [])

  // Fetch lessons when course filter changes
  useEffect(() => {
    if (courseFilter && courseFilter !== "all") {
      fetchLessons(courseFilter)
    }
  }, [courseFilter])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load courses')
    }
  }

  const fetchLessons = async (courseId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/courses/${courseId}/lessons`)
      const data = await response.json()
      setLessons(data.lessons || [])
    } catch (err) {
      console.error('Error fetching lessons:', err)
      setError('Failed to load lessons')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLesson = () => {
    setEditingLesson(null)
    setLessonForm({
      courseId: courseFilter !== "all" ? courseFilter : "",
      title: "",
      description: "",
      content: "",
      type: "Video",
      duration: 0,
      order: lessons.length + 1,
      aiEnabled: true,
      videoType: "upload",
      videoFile: null,
      videoUrl: "",
      youtubeUrl: "",
      codeSnippets: [{ language: "JavaScript", code: "" }],
      attachmentFiles: [],
      attachments: [],
      quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
      bulkQuizText: ""
    })
    setShowLessonDialog(true)
    setError("")
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonForm({
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      type: lesson.type,
      duration: lesson.duration,
      order: lesson.order,
      aiEnabled: lesson.aiEnabled,
      videoType: lesson.videoType || "upload",
      videoFile: null,
      videoUrl: lesson.videoUrl || "",
      youtubeUrl: lesson.youtubeUrl || "",
      codeSnippets: lesson.codeSnippets || [{ language: "JavaScript", code: "" }],
      attachmentFiles: [],
      attachments: lesson.attachments || [],
      quizzes: lesson.quizzes || [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
      bulkQuizText: ""
    })
    setShowLessonDialog(true)
    setError("")
  }

  const handleSaveLesson = async () => {
    try {
      setUploading(true)
      setError("")

      // Validation
      if (!lessonForm.courseId) {
        setError("Please select a course")
        return
      }
      if (!lessonForm.title.trim()) {
        setError("Please enter a lesson title")
        return
      }

      // Upload video if needed
      let videoUrl = lessonForm.videoUrl
      if (lessonForm.type === "Video" && lessonForm.videoType === "upload" && lessonForm.videoFile) {
        const formData = new FormData()
        formData.append('file', lessonForm.videoFile)
        formData.append('type', 'video')

        const uploadResponse = await fetch('/api/upload-cloudinary', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadResponse.json()
        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Video upload failed')
        }
        videoUrl = uploadData.url
      } else if (lessonForm.type === "Video" && lessonForm.videoType === "youtube") {
        videoUrl = lessonForm.youtubeUrl
      }

      // Upload attachments
      const uploadedAttachments = [...lessonForm.attachments]
      for (const file of lessonForm.attachmentFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'document')

        const uploadResponse = await fetch('/api/upload-cloudinary', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadResponse.json()
        if (uploadData.success) {
          uploadedAttachments.push({
            name: file.name,
            url: uploadData.url,
            type: file.type
          })
        }
      }

      // Prepare lesson data
      const lessonData: any = {
        courseId: lessonForm.courseId,
        title: lessonForm.title,
        description: lessonForm.description,
        content: lessonForm.content,
        type: lessonForm.type,
        duration: lessonForm.duration,
        order: lessonForm.order,
        aiEnabled: lessonForm.aiEnabled,
        videoType: lessonForm.videoType,
        videoUrl,
        youtubeUrl: lessonForm.youtubeUrl,
        codeSnippets: lessonForm.codeSnippets.filter(s => s.code.trim()),
        attachments: uploadedAttachments,
        quizzes: lessonForm.quizzes.filter(q => q.question.trim())
      }

      // Save lesson
      let response
      if (editingLesson) {
        response = await fetch(`/api/lessons/${editingLesson._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lessonData)
        })
      } else {
        response = await fetch(`/api/courses/${lessonForm.courseId}/lessons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lessonData)
        })
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save lesson')
      }

      // Refresh lessons
      await fetchLessons(lessonForm.courseId)
      setShowLessonDialog(false)
      setEditingLesson(null)

    } catch (err: any) {
      console.error('Error saving lesson:', err)
      setError(err.message || 'Failed to save lesson')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!lesson._id) return
    if (!confirm(`Are you sure you want to delete "${lesson.title}"?`)) return

    try {
      const response = await fetch(`/api/lessons/${lesson._id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete lesson')
      }

      // Refresh lessons
      if (lesson.courseId) {
        await fetchLessons(lesson.courseId)
      }
    } catch (err) {
      console.error('Error deleting lesson:', err)
      alert('Failed to delete lesson')
    }
  }

  const addCodeSnippet = () => {
    setLessonForm({
      ...lessonForm,
      codeSnippets: [...lessonForm.codeSnippets, { language: "JavaScript", code: "" }]
    })
  }

  const removeCodeSnippet = (index: number) => {
    setLessonForm({
      ...lessonForm,
      codeSnippets: lessonForm.codeSnippets.filter((_, i) => i !== index)
    })
  }

  const updateCodeSnippet = (index: number, field: 'language' | 'code', value: string) => {
    const updated = [...lessonForm.codeSnippets]
    updated[index] = { ...updated[index], [field]: value }
    setLessonForm({ ...lessonForm, codeSnippets: updated })
  }

  const addQuiz = () => {
    setLessonForm({
      ...lessonForm,
      quizzes: [...lessonForm.quizzes, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]
    })
  }

  const removeQuiz = (index: number) => {
    setLessonForm({
      ...lessonForm,
      quizzes: lessonForm.quizzes.filter((_, i) => i !== index)
    })
  }

  const updateQuiz = (index: number, field: string, value: any) => {
    const updated = [...lessonForm.quizzes]
    updated[index] = { ...updated[index], [field]: value }
    setLessonForm({ ...lessonForm, quizzes: updated })
  }

  const parseBulkQuiz = () => {
    const text = lessonForm.bulkQuizText.trim()
    if (!text) return

    try {
      // Expected format:
      // Q1: What is React?
      // A) A database
      // B) A JavaScript library
      // C) A programming language
      // D) An operating system
      // Answer: B

      const lines = text.split('\n').map(l => l.trim()).filter(l => l)
      const quizzes: { question: string; options: string[]; correctAnswer: number }[] = []
      
      let currentQuestion = ""
      let currentOptions: string[] = []
      let i = 0

      while (i < lines.length) {
        const line = lines[i]
        
        // Question line (starts with Q1:, Q2:, etc or just a question)
        if (line.match(/^Q\d+:/i) || (!line.match(/^[A-D]\)/i) && !line.match(/^Answer:/i) && currentQuestion === "")) {
          currentQuestion = line.replace(/^Q\d+:\s*/i, '')
          currentOptions = []
          i++
          continue
        }

        // Option line (A), B), C), D))
        if (line.match(/^[A-D]\)/i)) {
          const option = line.replace(/^[A-D]\)\s*/i, '')
          currentOptions.push(option)
          i++
          continue
        }

        // Answer line
        if (line.match(/^Answer:/i)) {
          const answer = line.replace(/^Answer:\s*/i, '').trim().toUpperCase()
          let correctIndex = 0
          
          if (answer === 'A') correctIndex = 0
          else if (answer === 'B') correctIndex = 1
          else if (answer === 'C') correctIndex = 2
          else if (answer === 'D') correctIndex = 3

          if (currentQuestion && currentOptions.length >= 2) {
            // Ensure we have exactly 4 options
            while (currentOptions.length < 4) {
              currentOptions.push("")
            }
            
            quizzes.push({
              question: currentQuestion,
              options: currentOptions.slice(0, 4),
              correctAnswer: correctIndex
            })
          }

          currentQuestion = ""
          currentOptions = []
          i++
          continue
        }

        i++
      }

      if (quizzes.length > 0) {
        setLessonForm({ ...lessonForm, quizzes, bulkQuizText: "" })
        alert(`Successfully imported ${quizzes.length} quiz question(s)!`)
      } else {
        alert('No valid quizzes found. Please check the format.')
      }

    } catch (err) {
      console.error('Error parsing bulk quiz:', err)
      alert('Failed to parse quiz text. Please check the format.')
    }
  }

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

  const filteredLessons = courseFilter === "all" ? [] : lessons

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Lesson Manager</h2>
          <p className="text-gray-400">Create and manage course lessons with videos, quizzes, and code examples</p>
        </div>
        <Button onClick={handleCreateLesson} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Lesson
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-gray-300 mb-2 block">Filter by Course</Label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lessons List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : filteredLessons.length === 0 ? (
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="text-center py-12">
            <p className="text-gray-400">
              {courseFilter === "all" 
                ? "Select a course to view its lessons" 
                : "No lessons found for this course. Create your first lesson!"}
            </p>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLessons.map((lesson) => (
            <Card key={lesson._id} className="border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20">
                      {getTypeIcon(lesson.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{lesson.title}</h3>
                        <Badge variant="outline" className="border-amber-600 text-amber-400">
                          {lesson.type}
                        </Badge>
                        {lesson.aiEnabled && (
                          <Badge variant="outline" className="border-purple-600 text-purple-400">
                            AI Q&A
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        Order: {lesson.order} • Duration: {lesson.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300"
                      onClick={() => handleEditLesson(lesson)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                      onClick={() => handleDeleteLesson(lesson)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Lesson Dialog - We'll continue this in the next part... */}
    </div>
  )
}
