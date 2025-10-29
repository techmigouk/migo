"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Grid3x3,
  List,
  MoreVertical,
  Users,
  BookOpen,
  Clock,
  Star,
  Eye,
  Edit,
  Trash2,
  Copy,
  Loader2,
  CheckCircle,
  XCircle,
  Info,
  Lock,
  X,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdminAuth } from "@/lib/auth-context"

interface Course {
  _id?: string
  id?: string
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  instructor: any
  status: "draft" | "published" | "archived"
  price?: number
  thumbnail?: string
  thumbnailUrl?: string
  enrollmentCount?: number
  enrollments?: number
  rating: number
  duration?: number | string
  lessons?: number
  projectTitle?: string
  projectDescription?: string
  projectMedia?: string
  introVideoUrl?: string
  hasCertificate?: boolean
  whatYouWillLearn?: string[]
  courseCurriculum?: Array<{
    section: string
    lectures: Array<{ title: string; duration: string }>
  }>
  createdAt?: Date
  updatedAt?: Date
}

export function CourseLibrary() {
  const { adminToken } = useAdminAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showCourseDialog, setShowCourseDialog] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCreateCourseDialog, setShowCreateCourseDialog] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // Form refs for create/edit dialog
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const projectTitleRef = useRef<HTMLInputElement>(null)
  const projectDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const thumbnailRef = useRef<HTMLInputElement>(null)
  const introVideoRef = useRef<HTMLInputElement>(null)
  const projectMediaRef = useRef<HTMLInputElement>(null)
  const durationRef = useRef<HTMLInputElement>(null)
  const lessonsCountRef = useRef<HTMLInputElement>(null)
  const [selectedCategory, setSelectedCategory] = useState("Frontend Development")
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [selectedStatus, setSelectedStatus] = useState<"draft" | "published" | "archived">("draft")
  const [selectedAccessType, setSelectedAccessType] = useState<"Free" | "Premium">("Free")
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [introVideoUrl, setIntroVideoUrl] = useState<string>("")
  const [uploadingIntroVideo, setUploadingIntroVideo] = useState(false)
  const [projectMediaUrl, setProjectMediaUrl] = useState<string>("")
  const [uploadingProjectMedia, setUploadingProjectMedia] = useState(false)
  const [hasCertificate, setHasCertificate] = useState<boolean>(true)
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([''])
  const [courseCurriculum, setCourseCurriculum] = useState<Array<{
    section: string
    lectures: Array<{ title: string; duration: string }>
  }>>([{ section: '', lectures: [{ title: '', duration: '' }] }])

  // Toast Notification System
  const [toasts, setToasts] = useState<Array<{id: number, type: 'success' | 'error' | 'warning' | 'info', message: string, icon?: React.ReactNode}>>([])
  
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string, icon?: React.ReactNode) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message, icon }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      console.log('Fetching courses...')
      console.log('Admin token:', adminToken ? 'Present' : 'Missing')
      
      // Call admin API directly instead of front API
      const response = await fetch('/api/courses?status=all', {
        headers: {
          'Authorization': `Bearer ${adminToken || ''}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Fetch courses response:', data)
      
      if (data.courses) {
        console.log('Number of courses fetched:', data.courses.length)
        // Map _id to id for UI consistency
        const mappedCourses = data.courses.map((course: any) => ({
          ...course,
          id: course._id || course.id,
        }))
        console.log('Mapped courses:', mappedCourses)
        setCourses(mappedCourses)
      } else {
        console.error('Failed to fetch courses:', data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('warning', 'Please select an image file', <Info size={16} />)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('warning', 'Image size should be less than 5MB', <Info size={16} />)
      return
    }

    try {
      setUploadingThumbnail(true)
      
      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (data.success && data.url) {
        setThumbnailPreview(data.url)
      } else {
        showToast('error', 'Failed to upload image', <XCircle size={16} />)
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      showToast('error', 'Error uploading image', <XCircle size={16} />)
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleIntroVideoChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      showToast('warning', 'Please select a video file', <Info size={16} />)
      return
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      showToast('warning', 'Video size should be less than 100MB', <Info size={16} />)
      return
    }

    try {
      setUploadingIntroVideo(true)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (data.success && data.url) {
        setIntroVideoUrl(data.url)
        showToast('success', 'Intro video uploaded successfully!', <CheckCircle size={16} />)
      } else {
        showToast('error', 'Failed to upload video', <XCircle size={16} />)
      }
    } catch (error) {
      console.error('Error uploading intro video:', error)
      showToast('error', 'Error uploading video', <XCircle size={16} />)
    } finally {
      setUploadingIntroVideo(false)
    }
  }

  const handleProjectMediaChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type (image or video)
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      showToast('warning', 'Please select an image or video file', <Info size={16} />)
      return
    }

    // Validate file size
    const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      showToast('warning', `File size should be less than ${maxSizeMB}MB`, <Info size={16} />)
      return
    }

    try {
      setUploadingProjectMedia(true)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (data.success && data.url) {
        setProjectMediaUrl(data.url)
        showToast('success', 'Project media uploaded successfully!', <CheckCircle size={16} />)
      } else {
        showToast('error', 'Failed to upload file', <XCircle size={16} />)
      }
    } catch (error) {
      console.error('Error uploading project media:', error)
      showToast('error', 'Error uploading file', <XCircle size={16} />)
    } finally {
      setUploadingProjectMedia(false)
    }
  }

  const handleCreateCourse = async (): Promise<void> => {
    try {
      if (!titleRef.current?.value || !descriptionRef.current?.value) {
        showToast('warning', 'Please fill in title and description', <Info size={16} />)
        return
      }

      const courseData = {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        category: selectedCategory,
        level: selectedLevel,
        status: selectedStatus,
        price: selectedAccessType === "Premium" ? 9.99 : 0, // Convert to price
        duration: 0, // Default duration, can be updated later
        projectTitle: projectTitleRef.current?.value || undefined,
        projectDescription: projectDescriptionRef.current?.value || undefined,
        thumbnail: thumbnailPreview || '/placeholder.svg',
      }

      console.log('Creating course with data:', courseData)
      console.log('Admin token:', adminToken ? 'Present' : 'Missing')

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`
        },
        body: JSON.stringify(courseData)
      })
      
      const data = await response.json()

      console.log('API Response:', data)

      if (data.success) {
        showToast('success', 'Course created successfully!', <CheckCircle size={16} />)
        setShowCreateCourseDialog(false)
        fetchCourses() // Refresh the list
        // Reset form
        if (titleRef.current) titleRef.current.value = ''
        if (descriptionRef.current) descriptionRef.current.value = ''
        if (projectTitleRef.current) projectTitleRef.current.value = ''
        if (projectDescriptionRef.current) projectDescriptionRef.current.value = ''
        if (thumbnailRef.current) thumbnailRef.current.value = ''
        setSelectedLevel('beginner')
        setSelectedStatus('draft')
        setSelectedAccessType('Free')
        setThumbnailPreview('')
        setSelectedAccessType('Free')
      } else {
        showToast('error', 'Failed to create course: ' + (data.error || 'Unknown error'), <XCircle size={16} />)
      }
    } catch (error: any) {
      console.error('Error creating course:', error)
      showToast('error', 'Error creating course: ' + error.message, <XCircle size={16} />)
    }
  }

  const handleUpdateCourse = async () => {
    try {
      if (!editingCourse || !titleRef.current?.value || !descriptionRef.current?.value) {
        showToast('warning', 'Please fill in all required fields', <Info size={16} />)
        return
      }

      const courseId = editingCourse.id || editingCourse._id
      console.log('📝 Updating course with ID:', courseId)
      console.log('📝 Full course object:', editingCourse)

      const courseData = {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        category: selectedCategory,
        level: selectedLevel,
        status: selectedStatus,
        price: selectedAccessType === "Premium" ? 9.99 : 0,
        duration: durationRef.current?.value ? Number(durationRef.current.value) : editingCourse.duration || 0,
        lessons: lessonsCountRef.current?.value ? Number(lessonsCountRef.current.value) : editingCourse.lessons || 0,
        hasCertificate,
        whatYouWillLearn: whatYouWillLearn.filter(item => item.trim() !== ''),
        courseCurriculum: courseCurriculum.filter(section => 
          section.section.trim() !== '' || section.lectures.some(l => l.title.trim() !== '')
        ),
        projectTitle: projectTitleRef.current?.value || editingCourse.projectTitle || '',
        projectDescription: projectDescriptionRef.current?.value || editingCourse.projectDescription || '',
        projectMedia: projectMediaUrl || editingCourse.projectMedia || '',
        introVideoUrl: introVideoUrl || editingCourse.introVideoUrl || '',
        thumbnail: thumbnailPreview || editingCourse.thumbnail || '/placeholder.svg',
      }

      const url = `/api/courses/${courseId}`
      console.log('📝 Update URL:', url)

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`
        },
        body: JSON.stringify(courseData)
      })
      
      console.log('📝 Response status:', response.status)
      const data = await response.json()
      console.log('📝 Response data:', data)

      if (data.success) {
        showToast('success', 'Course updated successfully!', <CheckCircle size={16} />)
        setShowCreateCourseDialog(false)
        setEditingCourse(null)
        fetchCourses() // Refresh the list
      } else {
        showToast('error', 'Failed to update course: ' + (data.error || 'Unknown error'), <XCircle size={16} />)
      }
    } catch (error: any) {
      console.error('Error updating course:', error)
      showToast('error', 'Error updating course: ' + error.message, <XCircle size={16} />)
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const viewCourseDetails = (course: Course) => {
    setSelectedCourse(course)
    setShowCourseDialog(true)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setSelectedCategory(course.category)
    setSelectedLevel(course.level)
    setSelectedStatus(course.status)
    setSelectedAccessType((course.price || 0) > 0 ? "Premium" : "Free")
    setThumbnailPreview(course.thumbnail || '')
    setIntroVideoUrl(course.introVideoUrl || '')
    setProjectMediaUrl(course.projectMedia || '')
    setHasCertificate(course.hasCertificate !== false)
    setWhatYouWillLearn(course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? course.whatYouWillLearn : [''])
    setCourseCurriculum(course.courseCurriculum && course.courseCurriculum.length > 0 
      ? course.courseCurriculum 
      : [{ section: '', lectures: [{ title: '', duration: '' }] }]
    )
    setShowCreateCourseDialog(true)
  }

  const handleDuplicateCourse = async (course: Course) => {
    try {
      const courseData = {
        title: `${course.title} (Copy)`,
        description: course.description,
        category: course.category,
        level: course.level,
        status: 'draft' as const,
        price: course.price || 0,
        duration: course.duration || 0,
        projectTitle: course.projectTitle,
        projectDescription: course.projectDescription,
      }

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`
        },
        body: JSON.stringify(courseData)
      })
      
      const data = await response.json()

      if (data.success) {
        showToast('success', 'Course duplicated successfully!', <Copy size={16} />)
        fetchCourses() // Refresh the list
      } else {
        showToast('error', 'Failed to duplicate course: ' + (data.error || 'Unknown error'), <XCircle size={16} />)
      }
    } catch (error: any) {
      console.error('Error duplicating course:', error)
      showToast('error', 'Error duplicating course: ' + error.message, <XCircle size={16} />)
    }
  }

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/courses/${course.id || course._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`
        }
      })
      
      const data = await response.json()

      if (data.success) {
        showToast('success', 'Course deleted successfully!', <CheckCircle size={16} />)
        fetchCourses() // Refresh the list
      } else {
        showToast('error', 'Failed to delete course: ' + (data.error || 'Unknown error'), <XCircle size={16} />)
      }
    } catch (error: any) {
      console.error('Error deleting course:', error)
      showToast('error', 'Error deleting course: ' + error.message, <XCircle size={16} />)
    }
  }

  const handleSaveCourseSettings = () => {
    console.log("[v0] Saving course settings for:", selectedCourse?.id)
    setShowCourseDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-700 bg-gray-800 pl-10 text-gray-100"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-gray-100">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Frontend Development">Frontend Development</SelectItem>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "border-amber-600 text-amber-600" : "border-gray-700 text-gray-400"}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "border-amber-600 text-amber-600" : "border-gray-700 text-gray-400"}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => {
              console.log("[v0] Opening create course dialog")
              setEditingCourse(null)
              setShowCreateCourseDialog(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Course Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <span className="ml-2 text-gray-400">Loading courses...</span>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first course to get started"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id || course._id} className="border-gray-700 bg-gray-800 overflow-hidden">
              <div className="relative h-48 bg-gray-700">
                <img
                  src={course.thumbnail || course.thumbnailUrl || "/placeholder.svg"}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${(course.price || 0) > 0 ? "bg-amber-600" : "bg-green-600"}`}
                >
                  {(course.price || 0) > 0 ? 'Premium' : 'Free'}
                </Badge>
                <Badge
                  className={`absolute top-2 left-2 ${course.status === "published" ? "bg-blue-600" : "bg-gray-600"}`}
                >
                  {course.status}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-100 line-clamp-1">{course.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Unknown'}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-gray-700 bg-gray-800">
                      <DropdownMenuItem onClick={() => viewCourseDetails(course)} className="text-gray-300">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300" onClick={() => handleEditCourse(course)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300" onClick={() => handleDuplicateCourse(course)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400" onClick={() => handleDeleteCourse(course)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons || 0} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {typeof course.duration === 'number' ? `${course.duration}h` : course.duration || '0h'}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-medium text-gray-100">{course.rating || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Users className="h-4 w-4" />
                    {course.enrollmentCount || course.enrollments || 0} enrolled
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="border-gray-700 bg-gray-800">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-lg bg-gray-700">
                    <img
                      src={course.thumbnailUrl || "/placeholder.svg"}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-100">{course.title}</h3>
                          <Badge className={(course.price || 0) > 0 ? "bg-amber-600" : "bg-green-600"}>
                            {(course.price || 0) > 0 ? 'Premium' : 'Free'}
                          </Badge>
                          <Badge className={course.status === "published" ? "bg-blue-600" : "bg-gray-600"}>
                            {course.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                          {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Unknown'} • {course.category}
                        </p>
                        <p className="mt-2 text-sm text-gray-400">{course.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-gray-700 bg-gray-800">
                          <DropdownMenuItem onClick={() => viewCourseDetails(course)} className="text-gray-300">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-300" onClick={() => handleEditCourse(course)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-300" onClick={() => handleDuplicateCourse(course)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400" onClick={() => handleDeleteCourse(course)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {course.rating || "N/A"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrollments} enrolled
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Details Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-4xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl">Course Details</DialogTitle>
            <DialogDescription className="text-gray-400">{selectedCourse?.title}</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="bg-gray-700">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Instructor</p>
                    <p className="mt-1 font-medium text-gray-100">
                      {typeof selectedCourse.instructor === 'string' 
                        ? selectedCourse.instructor 
                        : selectedCourse.instructor?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="mt-1 font-medium text-gray-100">{selectedCourse.category}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Level</p>
                    <p className="mt-1 font-medium text-gray-100">{selectedCourse.level}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Access Type</p>
                    <p className="mt-1 font-medium text-gray-100">{(selectedCourse.price || 0) > 0 ? 'Premium' : 'Free'}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Enrollments</p>
                    <p className="mt-1 text-2xl font-bold text-amber-500">{selectedCourse.enrollmentCount || selectedCourse.enrollments || 0}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Rating</p>
                    <p className="mt-1 text-2xl font-bold text-amber-500">{selectedCourse.rating || "N/A"}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="curriculum">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                  <p className="text-gray-400">Curriculum builder coming soon</p>
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Course Title</Label>
                    <Input
                      defaultValue={selectedCourse.title}
                      className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      defaultValue={selectedCourse.description}
                      className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                      rows={4}
                    />
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSaveCourseSettings}>
                    Save Changes
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="analytics">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                  <p className="text-gray-400">Analytics dashboard coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Course Dialog */}
      <Dialog open={showCreateCourseDialog} onOpenChange={(open) => {
        setShowCreateCourseDialog(open)
        if (!open) {
          // Reset form when closing
          setEditingCourse(null)
          setThumbnailPreview('')
          setIntroVideoUrl('')
          setProjectMediaUrl('')
          setHasCertificate(true)
          setWhatYouWillLearn([''])
          setCourseCurriculum([{ section: '', lectures: [{ title: '', duration: '' }] }])
          if (thumbnailRef.current) thumbnailRef.current.value = ''
          if (introVideoRef.current) introVideoRef.current.value = ''
          if (projectMediaRef.current) projectMediaRef.current.value = ''
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] border-gray-700 bg-gray-800 text-gray-100 flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingCourse ? "Update course information" : "Set up a new course for your platform"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            <div>
              <Label className="text-gray-300">Course Title</Label>
              <Input
                ref={titleRef}
                defaultValue={editingCourse?.title}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="Introduction to Web Development"
              />
            </div>
            <div>
              <Label className="text-gray-300">Description</Label>
              <Textarea
                ref={descriptionRef}
                defaultValue={editingCourse?.description}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="Describe what students will learn..."
                rows={3}
              />
            </div>
            <div className="space-y-2 rounded-lg border border-gray-700 bg-gray-900 p-4">
              <Label className="text-gray-300">Featured Image</Label>
              <p className="text-sm text-gray-500">
                This image will be displayed on the course card (recommended: 1280x720px)
              </p>
              {thumbnailPreview && (
                <div className="mt-2">
                  <img 
                    src={thumbnailPreview} 
                    alt="Course thumbnail preview" 
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-700"
                  />
                </div>
              )}
              <Input
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={uploadingThumbnail}
                className="mt-2 border-gray-700 bg-gray-800 text-gray-100"
              />
              {uploadingThumbnail && (
                <p className="text-sm text-amber-500 mt-1">Uploading image...</p>
              )}
            </div>
            <div className="space-y-2 rounded-lg border border-gray-700 bg-gray-900 p-4">
              <Label className="text-gray-300">Intro Video</Label>
              <p className="text-sm text-gray-500">
                Upload a video file or paste a YouTube URL for the course introduction
              </p>
              {introVideoUrl && (
                <div className="mt-2">
                  {introVideoUrl.includes('youtube.com') || introVideoUrl.includes('youtu.be') ? (
                    <div className="w-full max-w-md aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400 text-sm">YouTube: {introVideoUrl}</p>
                    </div>
                  ) : (
                    <video 
                      src={introVideoUrl} 
                      className="w-full max-w-md aspect-video object-cover rounded-lg border border-gray-700"
                      controls
                    />
                  )}
                </div>
              )}
              <Input
                placeholder="YouTube URL (e.g., https://youtube.com/watch?v=...)"
                value={introVideoUrl}
                onChange={(e) => setIntroVideoUrl(e.target.value)}
                className="mt-2 border-gray-700 bg-gray-800 text-gray-100"
              />
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>or</span>
              </div>
              <Input
                ref={introVideoRef}
                type="file"
                accept="video/*"
                onChange={handleIntroVideoChange}
                disabled={uploadingIntroVideo}
                className="border-gray-700 bg-gray-800 text-gray-100"
              />
              {uploadingIntroVideo && (
                <p className="text-sm text-amber-500 mt-1">Uploading video...</p>
              )}
            </div>
            <div className="space-y-2 rounded-lg border border-gray-700 bg-gray-900 p-4">
              <Label className="text-gray-300">Course Project</Label>
              <p className="text-sm text-gray-500">
                Students will complete this project after finishing 75% of the course
              </p>
              <Input
                ref={projectTitleRef}
                defaultValue={editingCourse?.projectTitle}
                placeholder="Project title (e.g., Build a Todo App)"
                className="mt-2 border-gray-700 bg-gray-800 text-gray-100"
              />
              <Textarea
                ref={projectDescriptionRef}
                defaultValue={editingCourse?.projectDescription}
                placeholder="Project description and requirements..."
                className="mt-2 border-gray-700 bg-gray-800 text-gray-100"
                rows={3}
              />
              <div className="mt-2">
                <Label className="text-gray-300 text-sm">Project Image/Video</Label>
                {projectMediaUrl && (
                  <div className="mt-2 mb-2">
                    {projectMediaUrl.includes('.mp4') || projectMediaUrl.includes('video') ? (
                      <video 
                        src={projectMediaUrl} 
                        className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-700"
                        controls
                      />
                    ) : (
                      <img 
                        src={projectMediaUrl} 
                        alt="Project media preview" 
                        className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-700"
                      />
                    )}
                  </div>
                )}
                <Input
                  ref={projectMediaRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleProjectMediaChange}
                  disabled={uploadingProjectMedia}
                  className="mt-1 border-gray-700 bg-gray-800 text-gray-100"
                />
                {uploadingProjectMedia && (
                  <p className="text-sm text-amber-500 mt-1">Uploading file...</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-gray-300">Duration (hours)</Label>
                <Input
                  ref={durationRef}
                  type="number"
                  min="0"
                  defaultValue={editingCourse?.duration}
                  placeholder="24"
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div>
                <Label className="text-gray-300">Number of Lessons</Label>
                <Input
                  ref={lessonsCountRef}
                  type="number"
                  min="0"
                  defaultValue={editingCourse?.lessons}
                  placeholder="32"
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div>
                <Label className="text-gray-300">Certificate</Label>
                <Select value={hasCertificate ? "yes" : "no"} onValueChange={(val) => setHasCertificate(val === "yes")}>
                  <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="yes">Included</SelectItem>
                    <SelectItem value="no">Not Included</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 rounded-lg border border-gray-700 bg-gray-900 p-4">
              <Label className="text-gray-300">What You'll Learn</Label>
              <p className="text-sm text-gray-500">
                Add key learning outcomes (one per line)
              </p>
              {whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...whatYouWillLearn]
                      newItems[index] = e.target.value
                      setWhatYouWillLearn(newItems)
                    }}
                    placeholder="e.g., Master core concepts and advanced techniques"
                    className="border-gray-700 bg-gray-800 text-gray-100"
                  />
                  {whatYouWillLearn.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== index))}
                      className="border-gray-700 text-gray-400 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWhatYouWillLearn([...whatYouWillLearn, ''])}
                className="mt-2 border-gray-700 text-gray-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Learning Point
              </Button>
            </div>
            <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Course Curriculum</Label>
                  <p className="text-sm text-gray-500">
                    Organize your course into sections with lectures
                  </p>
                </div>
              </div>
              {courseCurriculum.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-2 rounded border border-gray-700 bg-gray-800 p-3">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        value={section.section}
                        onChange={(e) => {
                          const newCurriculum = [...courseCurriculum]
                          newCurriculum[sectionIndex].section = e.target.value
                          setCourseCurriculum(newCurriculum)
                        }}
                        placeholder={`Section ${sectionIndex + 1}: e.g., Introduction to Fundamentals`}
                        className="border-gray-700 bg-gray-900 text-gray-100"
                      />
                    </div>
                    {courseCurriculum.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setCourseCurriculum(courseCurriculum.filter((_, i) => i !== sectionIndex))}
                        className="border-gray-700 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="ml-4 space-y-2">
                    {section.lectures.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className="flex gap-2">
                        <Input
                          value={lecture.title}
                          onChange={(e) => {
                            const newCurriculum = [...courseCurriculum]
                            newCurriculum[sectionIndex].lectures[lectureIndex].title = e.target.value
                            setCourseCurriculum(newCurriculum)
                          }}
                          placeholder="Lecture title"
                          className="flex-1 border-gray-700 bg-gray-900 text-gray-100 text-sm"
                        />
                        <Input
                          value={lecture.duration}
                          onChange={(e) => {
                            const newCurriculum = [...courseCurriculum]
                            newCurriculum[sectionIndex].lectures[lectureIndex].duration = e.target.value
                            setCourseCurriculum(newCurriculum)
                          }}
                          placeholder="15m"
                          className="w-20 border-gray-700 bg-gray-900 text-gray-100 text-sm"
                        />
                        {section.lectures.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newCurriculum = [...courseCurriculum]
                              newCurriculum[sectionIndex].lectures = section.lectures.filter((_, i) => i !== lectureIndex)
                              setCourseCurriculum(newCurriculum)
                            }}
                            className="border-gray-700 text-gray-400 hover:text-red-400 h-8 w-8"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newCurriculum = [...courseCurriculum]
                        newCurriculum[sectionIndex].lectures.push({ title: '', duration: '' })
                        setCourseCurriculum(newCurriculum)
                      }}
                      className="text-xs border-gray-700 text-gray-400"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Lecture
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCourseCurriculum([...courseCurriculum, { section: '', lectures: [{ title: '', duration: '' }] }])}
                className="border-gray-700 text-gray-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-gray-300">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Level</Label>
                <Select value={selectedLevel} onValueChange={(val) => setSelectedLevel(val as any)}>
                  <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Access Type</Label>
                <Select value={selectedAccessType} onValueChange={(val) => setSelectedAccessType(val as any)}>
                  <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as any)}>
                  <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-700 mt-4">
            <Button variant="outline" onClick={() => setShowCreateCourseDialog(false)} className="border-gray-700">
              Cancel
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
            >
              {editingCourse ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium Toast Notifications */}
      <div className="fixed top-4 right-4 z-100 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-in slide-in-from-right-full duration-300 flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border min-w-[320px] max-w-md"
            style={{
              background: toast.type === 'success' 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)'
                : toast.type === 'error'
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)'
                : toast.type === 'warning'
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
              borderColor: toast.type === 'success'
                ? 'rgba(16, 185, 129, 0.3)'
                : toast.type === 'error'
                ? 'rgba(239, 68, 68, 0.3)'
                : toast.type === 'warning'
                ? 'rgba(245, 158, 11, 0.3)'
                : 'rgba(59, 130, 246, 0.3)',
            }}
          >
            <div 
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: toast.type === 'success'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : toast.type === 'error'
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : toast.type === 'warning'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: toast.type === 'success'
                  ? '0 0 20px rgba(16, 185, 129, 0.4)'
                  : toast.type === 'error'
                  ? '0 0 20px rgba(239, 68, 68, 0.4)'
                  : toast.type === 'warning'
                  ? '0 0 20px rgba(245, 158, 11, 0.4)'
                  : '0 0 20px rgba(59, 130, 246, 0.4)',
              }}
            >
              {toast.icon || (
                toast.type === 'success' ? <CheckCircle size={20} className="text-white" /> :
                toast.type === 'error' ? <XCircle size={20} className="text-white" /> :
                toast.type === 'warning' ? <Info size={20} className="text-white" /> :
                <Info size={20} className="text-white" />
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-white font-medium text-sm leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="shrink-0 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
