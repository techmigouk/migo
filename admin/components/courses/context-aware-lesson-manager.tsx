"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Video, FileText, Code, HelpCircle, Eye, Trash2, Upload, LinkIcon, X, Loader2, ArrowLeft, ChevronUp, ChevronDown, BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Programming languages for code snippets
const PROGRAMMING_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Ruby', 'Go', 'Rust',
  'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell', 'Lua', 'Dart',
  'HTML', 'CSS', 'SCSS', 'LESS', 'SQL', 'GraphQL', 'JSON', 'XML', 'YAML', 'Markdown',
  'Shell', 'Bash', 'PowerShell', 'Objective-C', 'Assembly', 'COBOL', 'Fortran', 'Ada',
  'Elixir', 'Erlang', 'F#', 'Clojure', 'Groovy', 'Julia', 'Solidity', 'Vue', 'Svelte'
];

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

interface ContextAwareLessonManagerProps {
  courseId: string
  courseName: string
  onBack: () => void
}

export function ContextAwareLessonManager({ courseId, courseName, onBack }: ContextAwareLessonManagerProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [showLessonDialog, setShowLessonDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const [error, setError] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [bulkQuizText, setBulkQuizText] = useState("")

  const [lessonForm, setLessonForm] = useState<LessonForm>({
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

  // Fetch lessons on mount and when courseId changes
  useEffect(() => {
    fetchLessons()
  }, [courseId])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await fetch(`/api/lessons?courseId=${courseId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch lessons')
      }
      
      // Handle both { lessons: [...] } and direct array response
      const lessonsArray = data.lessons || data || []
      setLessons(lessonsArray)
    } catch (err: any) {
      console.error('Error fetching lessons:', err)
      setError(err.message || 'Failed to load lessons')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLesson = () => {
    setEditingLesson(null)
    setLessonForm({
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
    setVideoFile(null)
    setAttachmentFiles([])
    setBulkQuizText("")
    setShowLessonDialog(true)
    setError("")
    setUploadProgress("")
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonForm({
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
    setVideoFile(null)
    setAttachmentFiles([])
    setBulkQuizText("")
    setShowLessonDialog(true)
    setError("")
    setUploadProgress("")
  }

  const handleSaveLesson = async () => {
    setError("")
    setUploadProgress("🔄 Initializing upload...")
    
    // Force a small delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!lessonForm.title.trim()) {
      setError("Please enter a lesson title")
      setUploadProgress("")
      return
    }

    try {
      setUploading(true)
      let uploadedVideoUrl = lessonForm.videoUrl
      const uploadedAttachments = [...lessonForm.attachments]

      // Upload video file if selected
      if (videoFile && lessonForm.videoType === "upload") {
        setUploadProgress("📹 Uploading video to Cloudinary...")
        
        // Small delay to ensure state updates
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const formData = new FormData()
        formData.append('file', videoFile)
        formData.append('type', 'video')
        
        const uploadResponse = await fetch('/api/upload-cloudinary', {
          method: 'POST',
          body: formData,
        })
        
        const uploadData = await uploadResponse.json()
        
        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Failed to upload video')
        }
        
        uploadedVideoUrl = uploadData.url
        
        // Show success message with Cloudinary link prominently
        setUploadProgress(`✅ Video uploaded successfully!\n\n� Cloudinary URL:\n${uploadData.url}\n\n📦 Public ID: ${uploadData.publicId}\n📁 Format: ${uploadData.format}`)
        
        // Keep success visible for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      // Upload attachment files
      if (attachmentFiles.length > 0) {
        for (let i = 0; i < attachmentFiles.length; i++) {
          const file = attachmentFiles[i]
          setUploadProgress(`📎 Uploading file ${i + 1}/${attachmentFiles.length}: ${file.name}...`)
          
          // Small delay to ensure state updates
          await new Promise(resolve => setTimeout(resolve, 100))
          
          const formData = new FormData()
          formData.append('file', file)
          formData.append('type', 'document')
          
          const uploadResponse = await fetch('/api/upload-cloudinary', {
            method: 'POST',
            body: formData,
          })
          
          const uploadData = await uploadResponse.json()
          
          if (!uploadData.success) {
            throw new Error(`Failed to upload ${file.name}`)
          }
          
          uploadedAttachments.push({
            name: file.name,
            url: uploadData.url,
            type: file.type
          })
          
          // Show success with Cloudinary link prominently
          setUploadProgress(`✅ File ${i + 1}/${attachmentFiles.length} uploaded successfully!\n\n📎 ${file.name}\n\n🔗 Cloudinary URL:\n${uploadData.url}\n\n📦 Public ID: ${uploadData.publicId}`)
          
          // Keep success visible for 1.5 seconds
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
      }

      // Prepare lesson data
      setUploadProgress("💾 Saving lesson to database...")
      
      // Small delay to show the message
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const lessonData: any = {
        courseId: courseId,
        title: lessonForm.title,
        description: lessonForm.description || "",
        content: lessonForm.content || "",
        type: lessonForm.type,
        duration: lessonForm.duration,
        order: lessonForm.order,
        aiEnabled: lessonForm.aiEnabled,
        videoType: lessonForm.videoType,
        codeSnippets: lessonForm.codeSnippets.filter(s => s.code.trim()),
        attachments: uploadedAttachments,
        quizzes: lessonForm.quizzes.filter(q => q.question.trim())
      }

      if (lessonForm.videoType === "upload" && uploadedVideoUrl) {
        lessonData.videoUrl = uploadedVideoUrl
      } else if (lessonForm.videoType === "youtube" && lessonForm.youtubeUrl) {
        lessonData.videoUrl = lessonForm.youtubeUrl  // Save YouTube URL to videoUrl field
        lessonData.youtubeUrl = lessonForm.youtubeUrl // Keep for backwards compatibility
      }

      const url = editingLesson 
        ? `/api/lessons/${editingLesson._id}`
        : `/api/lessons`
      
      const method = editingLesson ? 'PUT' : 'POST'
      
      console.log('Saving lesson with data:', lessonData)
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonData),
      })

      const data = await response.json()
      
      console.log('API Response:', { status: response.status, data })

      if (!response.ok) {
        console.error('Failed to save lesson:', data)
        throw new Error(data.error || 'Failed to save lesson')
      }

      // Show final success with all Cloudinary links
      let successSummary = `✅ Lesson "${lessonForm.title}" ${editingLesson ? 'updated' : 'created'} successfully!\n\n`
      
      // Add uploaded resources info
      if (uploadedVideoUrl || uploadedAttachments.length > 0) {
        successSummary += '📦 Uploaded to Cloudinary:\n\n'
        
        if (uploadedVideoUrl) {
          successSummary += `📹 Video:\n   ${uploadedVideoUrl}\n\n`
        }
        
        if (uploadedAttachments.length > 0) {
          successSummary += `📎 Files (${uploadedAttachments.length}):\n`
          uploadedAttachments.forEach((att, i) => {
            successSummary += `   ${i + 1}. ${att.name}\n      🔗 ${att.url}\n\n`
          })
        }
      }
      
      // Show success in progress alert first
      setUploadProgress(`✅ Lesson saved successfully!\n\n${successSummary}`)
      
      // Keep the success message visible for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Clear progress message
      setUploadProgress("")
      
      // Refresh lessons
      await fetchLessons()
      
      // Close dialog and reset form
      setShowLessonDialog(false)
      setEditingLesson(null)
      setVideoFile(null)
      setAttachmentFiles([])
      setBulkQuizText("")
      
      // Show final alert with all details
      alert(successSummary)

    } catch (err: any) {
      console.error('Error saving lesson:', err)
      setError(err.message || 'Failed to save lesson')
      setUploadProgress("")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!lesson._id) return
    
    if (!confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/lessons/${lesson._id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete lesson')
      }

      await fetchLessons()
      alert(`✅ Lesson "${lesson.title}" deleted successfully!`)
    } catch (err: any) {
      console.error('Error deleting lesson:', err)
      setError(err.message || 'Failed to delete lesson')
    } finally {
      setLoading(false)
    }
  }

  const handleMoveLesson = async (lesson: Lesson, direction: 'up' | 'down') => {
    const currentIndex = lessons.findIndex(l => l._id === lesson._id)
    if (currentIndex === -1) return
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= lessons.length) return

    const newLessons = [...lessons]
    const [movedLesson] = newLessons.splice(currentIndex, 1)
    newLessons.splice(targetIndex, 0, movedLesson)

    // Update order values
    const updatedLessons = newLessons.map((l, index) => ({
      ...l,
      order: index + 1
    }))

    setLessons(updatedLessons)

    // Save new order to backend
    try {
      await Promise.all(
        updatedLessons.map(async (l) => {
          if (l._id) {
            await fetch(`/api/lessons/${l._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order: l.order }),
            })
          }
        })
      )
    } catch (err) {
      console.error('Error updating lesson order:', err)
      // Revert on error
      await fetchLessons()
    }
  }

  // File handling functions
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setLessonForm(prev => ({ ...prev, videoFile: file }))
    }
  }

  const handleAttachmentFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachmentFiles(prev => [...prev, ...files])
    setLessonForm(prev => ({ ...prev, attachmentFiles: [...prev.attachmentFiles, ...files] }))
  }

  const removeAttachmentFile = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index))
    setLessonForm(prev => ({
      ...prev,
      attachmentFiles: prev.attachmentFiles.filter((_, i) => i !== index)
    }))
  }

  const removeExistingAttachment = (index: number) => {
    setLessonForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  // Code snippet functions
  const addCodeSnippet = () => {
    setLessonForm(prev => ({
      ...prev,
      codeSnippets: [...prev.codeSnippets, { language: "JavaScript", code: "" }]
    }))
  }

  const removeCodeSnippet = (index: number) => {
    setLessonForm(prev => ({
      ...prev,
      codeSnippets: prev.codeSnippets.filter((_, i) => i !== index)
    }))
  }

  const updateCodeSnippet = (index: number, field: 'language' | 'code', value: string) => {
    setLessonForm(prev => ({
      ...prev,
      codeSnippets: prev.codeSnippets.map((snippet, i) => 
        i === index ? { ...snippet, [field]: value } : snippet
      )
    }))
  }

  // Quiz functions
  const parseBulkQuiz = (text: string) => {
    const lines = text.trim().split('\n')
    const quizzes: { question: string; options: string[]; correctAnswer: number }[] = []
    
    let currentQuestion = ""
    let currentOptions: string[] = []
    let correctAnswer = 0
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (trimmedLine.match(/^Q\d+:/)) {
        // Save previous question if exists
        if (currentQuestion && currentOptions.length === 4) {
          quizzes.push({ question: currentQuestion, options: currentOptions, correctAnswer })
        }
        // Start new question
        currentQuestion = trimmedLine.replace(/^Q\d+:/, '').trim()
        currentOptions = []
        correctAnswer = 0
      } else if (trimmedLine.match(/^[A-D]\)/)) {
        const option = trimmedLine.substring(2).trim()
        currentOptions.push(option)
      } else if (trimmedLine.startsWith('Answer:')) {
        const answer = trimmedLine.replace('Answer:', '').trim().toUpperCase()
        const answerMap: { [key: string]: number } = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
        correctAnswer = answerMap[answer] || 0
      }
    }
    
    // Save last question
    if (currentQuestion && currentOptions.length === 4) {
      quizzes.push({ question: currentQuestion, options: currentOptions, correctAnswer })
    }
    
    return quizzes
  }

  const handleBulkImport = () => {
    if (!bulkQuizText.trim()) {
      alert("Please enter quiz questions in the format shown")
      return
    }
    
    const newQuizzes = parseBulkQuiz(bulkQuizText)
    
    if (newQuizzes.length === 0) {
      alert("No valid quizzes found. Please check the format.")
      return
    }
    
    const currentCount = lessonForm.quizzes.filter(q => q.question.trim()).length
    const totalAfterImport = currentCount + newQuizzes.length
    
    if (totalAfterImport > 10) {
      alert(`⚠️ Cannot import ${newQuizzes.length} quizzes. You have ${currentCount} quizzes already. Maximum is 10 quizzes per lesson.\n\nOnly ${10 - currentCount} more can be added.`)
      return
    }
    
    // Append to existing quizzes
    const updatedQuizzes = [...lessonForm.quizzes.filter(q => q.question.trim()), ...newQuizzes]
    
    setLessonForm(prev => ({
      ...prev,
      quizzes: updatedQuizzes
    }))
    
    setBulkQuizText("")
    alert(`✅ Successfully imported ${newQuizzes.length} ${newQuizzes.length === 1 ? 'quiz' : 'quizzes'}!\n\nTotal questions: ${updatedQuizzes.length}/10`)
  }

  const addQuiz = () => {
    const currentCount = lessonForm.quizzes.filter(q => q.question.trim()).length
    if (currentCount >= 10) {
      alert("Maximum 10 quizzes per lesson")
      return
    }
    
    setLessonForm(prev => ({
      ...prev,
      quizzes: [...prev.quizzes, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]
    }))
  }

  const removeQuiz = (index: number) => {
    setLessonForm(prev => ({
      ...prev,
      quizzes: prev.quizzes.filter((_, i) => i !== index)
    }))
  }

  const updateQuiz = (index: number, field: 'question' | 'correctAnswer', value: string | number) => {
    setLessonForm(prev => ({
      ...prev,
      quizzes: prev.quizzes.map((quiz, i) => 
        i === index ? { ...quiz, [field]: value } : quiz
      )
    }))
  }

  const updateQuizOption = (quizIndex: number, optionIndex: number, value: string) => {
    setLessonForm(prev => ({
      ...prev,
      quizzes: prev.quizzes.map((quiz, i) => 
        i === quizIndex ? {
          ...quiz,
          options: quiz.options.map((opt, j) => j === optionIndex ? value : opt)
        } : quiz
      )
    }))
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

  const validQuizCount = lessonForm.quizzes.filter(q => q.question.trim()).length

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{courseName}</h2>
            <p className="text-gray-400">Manage lessons for this course</p>
          </div>
          <Button onClick={handleCreateLesson} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Lesson
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-900/20 border-red-700 text-red-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lessons List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : lessons.length === 0 ? (
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">No Lessons Yet</h3>
                <p className="text-gray-400 mb-6">
                  Get started by creating the first lesson for {courseName}
                </p>
                <Button onClick={handleCreateLesson} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Lesson
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="text-gray-300">
              {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {lessons.map((lesson, index) => (
              <Card key={lesson._id} className="border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
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
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 h-6 w-8 p-0"
                          onClick={() => handleMoveLesson(lesson, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 h-6 w-8 p-0"
                          onClick={() => handleMoveLesson(lesson, 'down')}
                          disabled={index === lessons.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                      
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
        </div>
      )}

      {/* Lesson Dialog - Same as before but without course selector */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingLesson ? 'Update lesson details' : 'Add a new lesson to ' + courseName}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert className="bg-red-900/20 border-red-700 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploadProgress && (
            <Alert className="bg-blue-900/20 border-blue-700 text-blue-300">
              <AlertDescription className="whitespace-pre-line">{uploadProgress}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab - NO COURSE SELECTOR */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Lesson Title *</Label>
                <Input
                  id="title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Introduction to React Hooks"
                  className="border-gray-700 bg-gray-800 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the lesson"
                  className="border-gray-700 bg-gray-800 text-gray-100 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-300">Lesson Type</Label>
                  <Select 
                    value={lessonForm.type} 
                    onValueChange={(value: any) => setLessonForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="border-gray-700 bg-gray-800 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Text">Text</SelectItem>
                      <SelectItem value="Quiz">Quiz</SelectItem>
                      <SelectItem value="Code">Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-300">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="border-gray-700 bg-gray-800 text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order" className="text-gray-300">Lesson Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={lessonForm.order}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  className="border-gray-700 bg-gray-800 text-gray-100"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ai-enabled"
                  checked={lessonForm.aiEnabled}
                  onCheckedChange={(checked) => setLessonForm(prev => ({ ...prev, aiEnabled: checked }))}
                />
                <Label htmlFor="ai-enabled" className="text-gray-300">Enable AI Q&A for this lesson</Label>
              </div>
            </TabsContent>

            {/* Video Tab */}
            <TabsContent value="video" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant={lessonForm.videoType === "upload" ? "default" : "outline"}
                    onClick={() => setLessonForm(prev => ({ ...prev, videoType: "upload" }))}
                    className={lessonForm.videoType === "upload" ? "bg-amber-600" : "border-gray-700"}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload to Cloudinary
                  </Button>
                  <Button
                    type="button"
                    variant={lessonForm.videoType === "youtube" ? "default" : "outline"}
                    onClick={() => setLessonForm(prev => ({ ...prev, videoType: "youtube" }))}
                    className={lessonForm.videoType === "youtube" ? "bg-red-600" : "border-gray-700"}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    YouTube URL
                  </Button>
                </div>

                {lessonForm.videoType === "upload" ? (
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer bg-gray-800/50"
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      <Video className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400 mb-2">
                        {videoFile ? videoFile.name : 'Click to select a video file'}
                      </p>
                      <p className="text-xs text-gray-500">MP4, MOV, AVI, or WebM (Max 100MB)</p>
                    </div>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />
                    {videoFile && (
                      <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700 rounded-lg">
                        <span className="text-sm text-green-300">{videoFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setVideoFile(null)
                            setLessonForm(prev => ({ ...prev, videoFile: null }))
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {lessonForm.videoUrl && !videoFile && (
                      <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <p className="text-sm text-blue-300">Current video: {lessonForm.videoUrl}</p>
                      </div>
                    )}
                    <Button
                      type="button"
                      onClick={() => document.getElementById('video-upload')?.click()}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Video File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="youtube-url" className="text-gray-300">YouTube Video URL</Label>
                    <Input
                      id="youtube-url"
                      value={lessonForm.youtubeUrl}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="border-gray-700 bg-gray-800 text-gray-100"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-300">Lesson Content</Label>
                <Textarea
                  id="content"
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter the main content of the lesson here..."
                  className="border-gray-700 bg-gray-800 text-gray-100 min-h-[300px]"
                />
              </div>
            </TabsContent>

            {/* Code Tab */}
            <TabsContent value="code" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Code Snippets</Label>
                <Button
                  type="button"
                  onClick={addCodeSnippet}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Code
                </Button>
              </div>

              {lessonForm.codeSnippets.map((snippet, index) => (
                <div key={index} className="space-y-2 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Code Snippet {index + 1}</Label>
                    {lessonForm.codeSnippets.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeCodeSnippet(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <Select
                    value={snippet.language}
                    onValueChange={(value) => updateCodeSnippet(index, 'language', value)}
                  >
                    <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800 max-h-[300px]">
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    value={snippet.code}
                    onChange={(e) => updateCodeSnippet(index, 'code', e.target.value)}
                    placeholder={`Enter ${snippet.language} code here...`}
                    className="border-gray-700 bg-gray-900 text-gray-100 font-mono text-sm min-h-[200px]"
                  />
                </div>
              ))}
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-800/50"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 mb-2">Click to select files</p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, or ZIP files</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  onChange={handleAttachmentFilesChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>

                {/* Existing Attachments */}
                {lessonForm.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Current Attachments</Label>
                    {lessonForm.attachments.map((att, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700 rounded-lg">
                        <span className="text-sm text-green-300">{att.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExistingAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Files to Upload */}
                {attachmentFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Files to Upload</Label>
                    {attachmentFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <span className="text-sm text-blue-300">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachmentFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="space-y-4 mt-4">
              {/* Bulk Import Section */}
              <div className="p-4 border-2 border-dashed border-purple-600/50 rounded-lg bg-purple-900/10 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-purple-300 font-semibold">Bulk Import Quizzes</Label>
                  <Badge variant="outline" className="border-purple-600 text-purple-300">
                    Format: Q1:/A)/B)/C)/D)/Answer:
                  </Badge>
                </div>

                <div className="p-3 bg-gray-900/50 rounded border border-gray-700 text-xs font-mono text-gray-400 overflow-x-auto">
                  <div>Q1: What is React?</div>
                  <div>A) A database</div>
                  <div>B) A JavaScript library</div>
                  <div>C) A programming language</div>
                  <div>D) An operating system</div>
                  <div>Answer: B</div>
                </div>

                <Textarea
                  value={bulkQuizText}
                  onChange={(e) => setBulkQuizText(e.target.value)}
                  placeholder="Paste your quiz questions here in the format shown above..."
                  className="border-gray-700 bg-gray-900 text-gray-100 font-mono text-sm min-h-[150px]"
                />

                <Button
                  type="button"
                  onClick={handleBulkImport}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Quizzes
                </Button>
              </div>

              {/* Manual Quiz Entry */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Manual Quiz Entry</Label>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={validQuizCount >= 10 ? "border-red-600 text-red-400" : "border-gray-600 text-gray-400"}
                    >
                      {validQuizCount}/10
                    </Badge>
                    <Button
                      type="button"
                      onClick={addQuiz}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={validQuizCount >= 10}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Quiz
                    </Button>
                  </div>
                </div>

                {lessonForm.quizzes.map((quiz, qIndex) => (
                  <div key={qIndex} className="space-y-3 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Question {qIndex + 1}</Label>
                      {lessonForm.quizzes.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeQuiz(qIndex)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <Input
                      value={quiz.question}
                      onChange={(e) => updateQuiz(qIndex, 'question', e.target.value)}
                      placeholder="Enter your question"
                      className="border-gray-700 bg-gray-900 text-gray-100"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      {quiz.options.map((option, oIndex) => (
                        <div key={oIndex} className="space-y-1">
                          <Label className="text-xs text-gray-400">Option {String.fromCharCode(65 + oIndex)}</Label>
                          <div className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateQuizOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                              className="border-gray-700 bg-gray-900 text-gray-100"
                            />
                            <Button
                              type="button"
                              onClick={() => updateQuiz(qIndex, 'correctAnswer', oIndex)}
                              size="sm"
                              variant={quiz.correctAnswer === oIndex ? "default" : "outline"}
                              className={quiz.correctAnswer === oIndex ? "bg-green-600" : "border-gray-700"}
                              title="Set as correct answer"
                            >
                              {quiz.correctAnswer === oIndex ? "✓" : "○"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowLessonDialog(false)
                setError("")
                setUploadProgress("")
              }}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveLesson}
              disabled={uploading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingLesson ? 'Update Lesson' : 'Create Lesson'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
