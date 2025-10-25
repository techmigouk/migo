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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createFrontAPIClient } from "@amigo/shared/client"
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
  const [selectedCategory, setSelectedCategory] = useState("Frontend Development")
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [selectedStatus, setSelectedStatus] = useState<"draft" | "published" | "archived">("draft")
  const [selectedAccessType, setSelectedAccessType] = useState<"Free" | "Premium">("Free")
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

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
      
      const apiClient = createFrontAPIClient(adminToken || '')
      const response = await apiClient.get('/api/courses?status=all') as any
      
      console.log('Fetch courses response:', response)
      
      if (response.success && response.courses) {
        console.log('Number of courses fetched:', response.courses.length)
        // Map _id to id for UI consistency
        const mappedCourses = response.courses.map((course: any) => ({
          ...course,
          id: course._id || course.id,
        }))
        console.log('Mapped courses:', mappedCourses)
        setCourses(mappedCourses)
      } else {
        console.error('Failed to fetch courses:', response)
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
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
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
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      alert('Error uploading image')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleCreateCourse = async (): Promise<void> => {
    try {
      if (!titleRef.current?.value || !descriptionRef.current?.value) {
        alert('Please fill in title and description')
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

      const apiClient = createFrontAPIClient(adminToken || '')
      const response = await apiClient.post('/api/courses', courseData) as any

      console.log('API Response:', response)

      if (response.success) {
        alert('Course created successfully!')
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
        alert('Failed to create course: ' + (response.error || 'Unknown error'))
      }
    } catch (error: any) {
      console.error('Error creating course:', error)
      alert('Error creating course: ' + error.message)
    }
  }

  const handleUpdateCourse = async () => {
    try {
      if (!editingCourse || !titleRef.current?.value || !descriptionRef.current?.value) {
        alert('Please fill in all required fields')
        return
      }

      const courseData = {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        category: selectedCategory,
        level: selectedLevel,
        status: selectedStatus,
        price: selectedAccessType === "Premium" ? 9.99 : 0,
        projectTitle: projectTitleRef.current?.value || undefined,
        projectDescription: projectDescriptionRef.current?.value || undefined,
        thumbnail: thumbnailPreview || editingCourse.thumbnail || '/placeholder.svg',
      }

      const apiClient = createFrontAPIClient(adminToken || '')
      const response = await apiClient.put(`/api/courses/${editingCourse.id || editingCourse._id}`, courseData) as any

      if (response.success) {
        setShowCreateCourseDialog(false)
        setEditingCourse(null)
        fetchCourses() // Refresh the list
      } else {
        alert('Failed to update course: ' + (response.error || 'Unknown error'))
      }
    } catch (error: any) {
      console.error('Error updating course:', error)
      alert('Error updating course: ' + error.message)
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

      const apiClient = createFrontAPIClient(adminToken || '')
      const response = await apiClient.post('/api/courses', courseData) as any

      if (response.success) {
        fetchCourses() // Refresh the list
      } else {
        alert('Failed to duplicate course: ' + (response.error || 'Unknown error'))
      }
    } catch (error: any) {
      console.error('Error duplicating course:', error)
      alert('Error duplicating course: ' + error.message)
    }
  }

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) {
      return
    }

    try {
      const apiClient = createFrontAPIClient(adminToken || '')
      const response = await apiClient.delete(`/api/courses/${course.id || course._id}`) as any

      if (response.success) {
        fetchCourses() // Refresh the list
      } else {
        alert('Failed to delete course: ' + (response.error || 'Unknown error'))
      }
    } catch (error: any) {
      console.error('Error deleting course:', error)
      alert('Error deleting course: ' + error.message)
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
                  <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-gray-700">
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
                    <p className="mt-1 font-medium text-gray-100">{selectedCourse.instructor}</p>
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
          if (thumbnailRef.current) thumbnailRef.current.value = ''
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingCourse ? "Update course information" : "Set up a new course for your platform"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
                <Input
                  type="file"
                  accept="image/*,video/*"
                  className="mt-1 border-gray-700 bg-gray-800 text-gray-100"
                />
              </div>
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
            <div className="flex justify-end gap-2 pt-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
