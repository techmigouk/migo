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
import { Plus, Video, FileText, Code, HelpCircle, Lock, Unlock, Eye, Trash2, Upload, LinkIcon, X, Loader2, BookOpen, Check } from "lucide-react"
import { useAdminAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface Lesson {
  _id?: string
  id?: string
  courseId: string
  courseName?: string
  title: string
  description?: string
  type: "Video" | "Text" | "Quiz" | "Code"
  duration: string | number
  aiEnabled?: boolean
  order: number
  videoType?: "upload" | "youtube"
  videoUrl?: string
  videoFile?: File | null
  youtubeUrl?: string
  textContent?: string
  content?: string
  codeSnippets?: { language: string; code: string }[]
  attachments?: File[]
  quiz?: { questions: { question: string; options: string[]; correctAnswer: number }[] }
  quizzes?: { question: string; options: string[]; correctAnswer: number }[]
  isPreview?: boolean
}

const mockLessons: Lesson[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "React Fundamentals",
    title: "Introduction to React",
    type: "Video",
    duration: "15 min",
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
  const { adminToken } = useAdminAuth()
  const { toast } = useToast()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null)
  const [showLessonDialog, setShowLessonDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [videoUploadProgress, setVideoUploadProgress] = useState(0)
  const [filesUploadProgress, setFilesUploadProgress] = useState(0)
  const [showQuizPasteDialog, setShowQuizPasteDialog] = useState(false)
  const [quizPasteText, setQuizPasteText] = useState("")
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const [lessonForm, setLessonForm] = useState({
    videoType: "upload" as "upload" | "youtube",
    videoFile: null as File | null,
    youtubeUrl: "",
    textContent: "",
    codeSnippets: [{ language: "javascript", code: "" }],
    attachments: [] as File[],
    quizzes: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  })

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Fetch lessons when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchLessonsForCourse(selectedCourse._id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse])

  const fetchLessonsForCourse = async (courseId: string) => {
    try {
      setLoading(true)
      console.log('🔄 Fetching lessons for course:', courseId)
      
      const response = await fetch(`/api/lessons?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${adminToken || ''}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('📡 Response status:', response.status)
      
      const data = await response.json()
      console.log('📦 Lessons response data:', data)
      
      if (data.lessons) {
        console.log('✅ Received', data.lessons.length, 'lessons for this course')
        // Map lessons to include type
        const mappedLessons = data.lessons.map((lesson: any) => {
          return {
            ...lesson,
            id: lesson._id || lesson.id,
            courseId: lesson.courseId,
            courseName: selectedCourse?.title || '',
            type: lesson.quiz ? "Quiz" : lesson.codeSnippets?.length > 0 ? "Code" : lesson.videoUrl ? "Video" : "Text",
            duration: typeof lesson.duration === 'number' ? `${lesson.duration} min` : lesson.duration
          }
        })
        console.log('📝 Mapped lessons count:', mappedLessons.length)
        setLessons(mappedLessons)
      } else {
        console.log('⚠️ No lessons in response')
        setLessons([])
      }
    } catch (error) {
      console.error('❌ Error fetching lessons:', error)
      setLessons([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      console.log('🔄 Fetching courses...')
      const response = await fetch('/api/courses', {
        headers: {
          'Authorization': `Bearer ${adminToken || ''}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('📦 Courses response:', data)
      
      if (data.courses) {
        console.log('✅ Received', data.courses.length, 'courses')
        setCourses(data.courses)
      } else {
        console.log('⚠️ No courses in response')
      }
    } catch (error) {
      console.error('❌ Error fetching courses:', error)
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

  const handleCreateLesson = () => {
    if (!selectedCourse) {
      alert('Please select a course first')
      return
    }
    console.log("[v0] Opening create lesson dialog for course:", selectedCourse.title)
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

  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLessonForm({ ...lessonForm, videoFile: file })
    
    // Start uploading immediately
    setUploadingVideo(true)
    setVideoUploadProgress(0)
    setUploadedVideoUrl(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default') // You'll need to configure this in Cloudinary

    try {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setVideoUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          setUploadedVideoUrl(response.secure_url)
          console.log('✅ Video uploaded successfully:', response.secure_url)
          toast({
            title: "Upload Complete",
            description: "Video uploaded successfully!",
          })
        } else {
          console.error('❌ Upload failed:', xhr.statusText)
          toast({
            title: "Upload Failed",
            description: "Video upload failed. Please try again.",
            variant: "destructive",
          })
        }
        setUploadingVideo(false)
      })

      xhr.addEventListener('error', () => {
        console.error('❌ Upload error')
        toast({
          title: "Upload Error",
          description: "Video upload failed. Please try again.",
          variant: "destructive",
        })
        setUploadingVideo(false)
      })

      // Replace with your Cloudinary cloud name
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/video/upload')
      xhr.send(formData)
    } catch (error) {
      console.error('❌ Error uploading video:', error)
      alert('Video upload failed. Please try again.')
      setUploadingVideo(false)
    }
  }

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setLessonForm({ ...lessonForm, attachments: files })
    
    // Start uploading immediately
    setUploadingFiles(true)
    setFilesUploadProgress(0)
    setUploadedFiles([])

    const uploadPromises = files.map((file, index) => {
      return new Promise<string>((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'ml_default')

        const xhr = new XMLHttpRequest()
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            const totalProgress = Math.round(((index + (progress / 100)) / files.length) * 100)
            setFilesUploadProgress(totalProgress)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            resolve(response.secure_url)
          } else {
            reject(new Error('Upload failed'))
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Upload error')))

        // Replace with your Cloudinary cloud name
        xhr.open('POST', 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/auto/upload')
        xhr.send(formData)
      })
    })

    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      setUploadedFiles(uploadedUrls)
      console.log('✅ Files uploaded successfully:', uploadedUrls)
      toast({
        title: "Upload Complete",
        description: `${uploadedUrls.length} file(s) uploaded successfully!`,
      })
    } catch (error) {
      console.error('❌ Error uploading files:', error)
      toast({
        title: "Upload Error",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingFiles(false)
    }
  }

  const handleSaveLesson = async () => {
    console.log("[v0] Saving lesson:", editingLesson ? "edit" : "create")
    console.log("[v0] Lesson form data:", lessonForm)
    
    // TODO: Implement actual API call to create/update lesson
    // For now, just close the dialog and refresh the list
    setShowLessonDialog(false)
    setEditingLesson(null)
    
    // Refresh the lessons list for the selected course
    if (selectedCourse) {
      await fetchLessonsForCourse(selectedCourse._id)
    }
  }

  const handleDeleteLesson = async (lesson: Lesson) => {
    console.log("[v0] Deleting lesson:", lesson.id || lesson._id)
    if (confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      try {
        const lessonId = lesson._id || lesson.id
        const response = await fetch(`/api/lessons/${lessonId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken || ''}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to delete lesson')
        }

        // Refresh the lessons list for the selected course
        if (selectedCourse) {
          await fetchLessonsForCourse(selectedCourse._id)
        }
      } catch (error) {
        console.error('[v0] Error deleting lesson:', error)
        alert('Failed to delete lesson. Please try again.')
      }
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

  const parseQuizText = (text: string) => {
    const quizzes: { question: string; options: string[]; correctAnswer: number }[] = []
    const lines = text.split('\n').filter(line => line.trim())
    
    let currentQuestion = ""
    let currentOptions: string[] = []
    let correctAnswer = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Check if it's a question line (starts with Q followed by number and colon)
      if (/^Q\d+:/.test(line)) {
        // Save previous question if exists
        if (currentQuestion && currentOptions.length > 0) {
          quizzes.push({ question: currentQuestion, options: currentOptions, correctAnswer })
        }
        
        // Start new question
        currentQuestion = line.replace(/^Q\d+:\s*/, '').trim()
        currentOptions = []
        correctAnswer = 0
      }
      // Check if it's an option line (starts with A), B), C), or D))
      else if (/^[A-D]\)/.test(line)) {
        const option = line.replace(/^[A-D]\)\s*/, '').trim()
        currentOptions.push(option)
      }
      // Check if it's the answer line
      else if (/^Answer:\s*[A-D]/.test(line)) {
        const answerLetter = line.replace(/^Answer:\s*/, '').trim()
        correctAnswer = answerLetter.charCodeAt(0) - 'A'.charCodeAt(0)
        
        // Save the completed question
        if (currentQuestion && currentOptions.length > 0) {
          quizzes.push({ question: currentQuestion, options: currentOptions, correctAnswer })
          currentQuestion = ""
          currentOptions = []
        }
      }
    }
    
    return quizzes
  }

  const handlePasteQuizzes = (text: string) => {
    const parsedQuizzes = parseQuizText(text)
    if (parsedQuizzes.length > 0) {
      setLessonForm({
        ...lessonForm,
        quizzes: parsedQuizzes,
      })
      toast({
        title: "Quizzes Imported",
        description: `Successfully imported ${parsedQuizzes.length} quiz question(s)`,
      })
    } else {
      toast({
        title: "Import Failed",
        description: "Could not parse quiz questions. Please check the format.",
        variant: "destructive",
      })
    }
  }

  // Debug render state
  console.log('🎨 Rendering - Loading:', loading, 'Lessons:', lessons.length, 'Courses:', courses.length, 'Selected Course:', selectedCourse?.title)

  // Show course selection view if no course is selected
  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Lesson Manager</h2>
          <p className="mt-1 text-gray-400">Select a course to manage its lessons</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id} className="border-gray-700 bg-gray-800 hover:border-amber-600 cursor-pointer transition-colors" onClick={() => setSelectedCourse(course)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-100">{course.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{course.category}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="border-amber-600 text-amber-500">
                        {course.lessons || 0} Lessons
                      </Badge>
                      <Badge variant="outline" className={course.status === 'published' ? 'border-green-600 text-green-500' : 'border-gray-600 text-gray-400'}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Lessons
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show lessons view for selected course
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" className="mb-2 text-gray-400 hover:text-gray-100" onClick={() => setSelectedCourse(null)}>
            ← Back to Courses
          </Button>
          <h2 className="text-2xl font-bold text-gray-100">Lessons for {selectedCourse.title}</h2>
          <p className="mt-1 text-gray-400">Manage lessons for this course</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleCreateLesson}>
          <Plus className="mr-2 h-4 w-4" />
          Create Lesson
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : lessons.length === 0 ? (
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="py-12 text-center">
                <p className="text-gray-400">No lessons found for this course</p>
                <p className="mt-2 text-sm text-gray-500">Create your first lesson to get started</p>
              </div>
            </CardHeader>
          </Card>
        ) : (
          lessons.map((lesson) => (
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
          ))
        )}
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
              {selectedCourse ? (
                <div className="space-y-2">
                  <Label className="text-gray-300">Course</Label>
                  <div className="p-3 rounded-md border border-gray-700 bg-gray-900 text-gray-100">
                    <div className="flex items-center justify-between">
                      <span>{selectedCourse.title}</span>
                      <Badge variant="outline" className="border-amber-600 text-amber-500">
                        Auto-selected
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Lesson will be created for this course</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-gray-300">Course</Label>
                  <Select defaultValue={editingLesson?.courseId || courses[0]?._id}>
                    <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      {courses.map((course) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                <div className="space-y-3">
                  <Label className="text-gray-300">Upload Video File</Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-gray-900">
                    {!uploadingVideo && !uploadedVideoUrl ? (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 mx-auto text-gray-500" />
                        <div>
                          <label htmlFor="video-upload" className="cursor-pointer">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                              <Upload className="h-4 w-4" />
                              <span>Choose Video File</span>
                            </div>
                            <input
                              id="video-upload"
                              type="file"
                              accept="video/*"
                              onChange={handleVideoFileSelect}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500">Upload will start automatically after selection</p>
                      </div>
                    ) : uploadingVideo ? (
                      <div className="space-y-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">Uploading video...</p>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${videoUploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">{videoUploadProgress}% complete</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-full h-10 w-10 bg-green-600 flex items-center justify-center mx-auto">
                          <Check className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-green-500 font-medium">Upload complete!</p>
                          {lessonForm.videoFile && (
                            <p className="text-xs text-gray-500 mt-1">{lessonForm.videoFile.name}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadedVideoUrl(null)
                            setLessonForm({ ...lessonForm, videoFile: null })
                          }}
                          className="border-gray-700 bg-transparent"
                        >
                          Upload Different Video
                        </Button>
                      </div>
                    )}
                  </div>
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
              <div className="space-y-3">
                <Label className="text-gray-300">Attachments (PDF, DOC, etc.)</Label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-gray-900">
                  {!uploadingFiles && uploadedFiles.length === 0 ? (
                    <div className="space-y-3">
                      <Upload className="h-10 w-10 mx-auto text-gray-500" />
                      <div>
                        <label htmlFor="files-upload" className="cursor-pointer">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                            <Upload className="h-4 w-4" />
                            <span>Choose Files</span>
                          </div>
                          <input
                            id="files-upload"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.zip"
                            onChange={handleFilesSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">Upload will start automatically after selection</p>
                      <p className="text-xs text-gray-600">Supported: PDF, DOC, DOCX, TXT, ZIP</p>
                    </div>
                  ) : uploadingFiles ? (
                    <div className="space-y-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">Uploading {lessonForm.attachments.length} file(s)...</p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${filesUploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">{filesUploadProgress}% complete</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-full h-10 w-10 bg-green-600 flex items-center justify-center mx-auto">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-green-500 font-medium">
                          {uploadedFiles.length} file(s) uploaded successfully!
                        </p>
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                          {lessonForm.attachments.map((file, index) => (
                            <p key={index} className="text-xs text-gray-500">
                              ✓ {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </p>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadedFiles([])
                          setLessonForm({ ...lessonForm, attachments: [] })
                        }}
                        className="border-gray-700 bg-transparent"
                      >
                        Upload Different Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Quizzes (Must complete before next lesson)</Label>
                  <p className="text-sm text-gray-500">Students must pass these quizzes to unlock the next lesson</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowQuizPasteDialog(true)} 
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Paste Quizzes
                  </Button>
                  <Button size="sm" onClick={addQuiz} className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quiz
                  </Button>
                </div>
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

      {/* Quiz Paste Dialog */}
      <Dialog open={showQuizPasteDialog} onOpenChange={setShowQuizPasteDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Paste Quiz Questions</DialogTitle>
            <DialogDescription className="text-gray-400">
              Paste your quiz questions in the following format:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-900 border border-gray-700 rounded-md text-xs font-mono text-gray-300">
              <div>Q1: What is the first lesson Pete says he wishes someone told him earlier?</div>
              <div>A) Always memorize every line of code</div>
              <div>B) You don't need to know everything</div>
              <div>C) Focus only on front-end coding</div>
              <div>D) Never use Google when coding</div>
              <div>Answer: B</div>
              <div className="mt-2">Q2: According to Pete, what's the real way to become fluent in coding?</div>
              <div>A) Watching more tutorials</div>
              <div>B) Reading documentation daily</div>
              <div>C) Practicing by building and breaking things</div>
              <div>D) Memorizing syntax and patterns</div>
              <div>Answer: C</div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Paste Your Quizzes</Label>
              <Textarea
                value={quizPasteText}
                onChange={(e) => setQuizPasteText(e.target.value)}
                placeholder="Paste quiz questions here..."
                className="min-h-[300px] font-mono text-sm border-gray-700 bg-gray-900 text-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  handlePasteQuizzes(quizPasteText)
                  setShowQuizPasteDialog(false)
                  setQuizPasteText("")
                }}
              >
                Import Quizzes
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                onClick={() => {
                  setShowQuizPasteDialog(false)
                  setQuizPasteText("")
                }}
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
