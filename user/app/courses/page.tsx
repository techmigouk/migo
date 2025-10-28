"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  ChevronDown,
  Play,
  Lock,
  CheckCircle,
  Loader2,
  Award,
  TrendingUp,
  Code,
  Palette,
  Database,
  Crown,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Course {
  _id: string
  title: string
  description: string
  category: string
  thumbnail?: string
  thumbnailUrl?: string
  price: number
  duration?: number
  lessons?: number
  instructor?: {
    name: string
    email: string
    avatar?: string
  } | string
  level?: 'Beginner' | 'Intermediate' | 'Advanced'
  status: 'draft' | 'published'
  rating?: number
  studentsEnrolled?: number
  whatYouWillLearn?: string[]
  introVideoUrl?: string
  createdAt: string
}

interface Enrollment {
  courseId: string
  progress: number
  status: 'active' | 'completed'
  enrolledAt: string
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({})
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [userSubscription, setUserSubscription] = useState<'Free' | 'Pro'>('Free')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Load user subscription tier
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        const isPro = userData.role === 'pro' || userData.role === 'admin'
        setUserSubscription(isPro ? 'Pro' : 'Free')
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  // Fetch courses and enrollments
  useEffect(() => {
    fetchCoursesAndEnrollments()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...courses]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter)
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter)
    }

    // Price filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'free') {
        filtered = filtered.filter(course => course.price === 0)
      } else if (priceFilter === 'paid') {
        filtered = filtered.filter(course => course.price > 0)
      }
    }

    setFilteredCourses(filtered)
  }, [courses, searchQuery, categoryFilter, levelFilter, priceFilter])

  const fetchCoursesAndEnrollments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Fetch courses
      const coursesResponse = await fetch('/api/courses', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      
      if (!coursesResponse.ok) {
        throw new Error('Failed to fetch courses')
      }

      const coursesData = await coursesResponse.json()
      setCourses(coursesData.courses || [])

      // Fetch enrollments if logged in
      if (token) {
        const enrollmentsResponse = await fetch('/api/enrollments', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (enrollmentsResponse.ok) {
          const enrollmentsData = await enrollmentsResponse.json()
          setEnrollments(enrollmentsData.enrollments || {})
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (course: Course) => {
    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      router.push(`/login?redirect=/courses`)
      return
    }

    // Check if course is paid and user is not Pro
    if (course.price > 0 && userSubscription !== 'Pro') {
      setSelectedCourse(course)
      setShowUpgradeModal(true)
      return
    }

    try {
      setEnrolling(course._id)

      const response = await fetch(`/api/courses/${course._id}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to enroll')
      }

      const data = await response.json()

      // Refresh enrollments
      await fetchCoursesAndEnrollments()

      // Redirect to course page
      router.push(`/courses/${course._id}`)
    } catch (error) {
      console.error('Error enrolling:', error)
      alert(error instanceof Error ? error.message : 'Failed to enroll in course')
    } finally {
      setEnrolling(null)
    }
  }

  const handleCourseClick = (course: Course) => {
    const enrollment = enrollments[course._id]
    
    if (enrollment) {
      // Already enrolled - go to course page
      router.push(`/courses/${course._id}`)
    } else {
      // Not enrolled - show preview modal
      setSelectedCourse(course)
      setShowPreviewModal(true)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development':
      case 'web dev':
        return <Code size={20} />
      case 'data science':
        return <Database size={20} />
      case 'design':
      case 'ux/ui':
        return <Palette size={20} />
      default:
        return <BookOpen size={20} />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development':
      case 'web dev':
        return 'bg-blue-600'
      case 'data science':
        return 'bg-purple-600'
      case 'design':
      case 'ux/ui':
        return 'bg-pink-600'
      default:
        return 'bg-gray-600'
    }
  }

  const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            className="mb-4 text-gray-400 hover:text-white"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Explore Courses</h1>
              <p className="text-gray-400">
                {courses.length} courses available • {Object.keys(enrollments).length} enrolled
              </p>
            </div>
            
            {userSubscription !== 'Pro' && (
              <Button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-bold"
                onClick={() => setShowUpgradeModal(true)}
              >
                <Crown className="mr-2" size={18} />
                Upgrade to Pro
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Pro Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCourses.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrollment = enrollments[course._id]
              const isEnrolled = !!enrollment
              const isCompleted = enrollment?.status === 'completed'
              const isPaid = course.price > 0
              const canAccess = !isPaid || userSubscription === 'Pro' || isEnrolled
              const instructorName = typeof course.instructor === 'string' 
                ? course.instructor 
                : course.instructor?.name || 'Unknown'

              return (
                <Card
                  key={course._id}
                  className="bg-gray-800 border-gray-700 overflow-hidden hover:border-amber-500 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleCourseClick(course)}
                >
                  {/* Course Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail || course.thumbnailUrl || '/placeholder.svg'}
                      alt={course.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!canAccess && !isEnrolled ? 'blur-sm' : ''}`}
                    />
                    
                    {/* Overlay badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge className={getCategoryColor(course.category || 'Other')}>
                        {getCategoryIcon(course.category || 'Other')}
                        <span className="ml-1">{course.category}</span>
                      </Badge>
                    </div>

                    <div className="absolute top-2 right-2 flex gap-2">
                      {isCompleted && (
                        <Badge className="bg-green-600">
                          <CheckCircle className="mr-1" size={14} />
                          Completed
                        </Badge>
                      )}
                      {isEnrolled && !isCompleted && (
                        <Badge className="bg-blue-600">
                          <TrendingUp className="mr-1" size={14} />
                          In Progress
                        </Badge>
                      )}
                      {isPaid && !isEnrolled && (
                        <Badge className="bg-amber-600 text-gray-900">
                          <Crown className="mr-1" size={14} />
                          Pro
                        </Badge>
                      )}
                      {!isPaid && (
                        <Badge className="bg-gray-700">
                          Free
                        </Badge>
                      )}
                    </div>

                    {/* Lock overlay for paid courses (non-Pro users) */}
                    {!canAccess && (
                      <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                        <Lock className="text-amber-500" size={40} />
                      </div>
                    )}

                    {/* Progress bar for enrolled courses */}
                    {isEnrolled && enrollment.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900">
                        <div
                          className="h-full bg-amber-500 transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Course Title */}
                    <div>
                      <h3 className="font-bold text-white text-lg line-clamp-2 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {course.description || 'No description available'}
                      </p>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center text-sm text-gray-400">
                      <Users size={14} className="mr-1" />
                      <span>{instructorName}</span>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {course.lessons && (
                        <div className="flex items-center">
                          <BookOpen size={14} className="mr-1" />
                          <span>{course.lessons} lessons</span>
                        </div>
                      )}
                      {course.duration && (
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{course.duration}h</span>
                        </div>
                      )}
                    </div>

                    {/* Progress for enrolled courses */}
                    {isEnrolled && enrollment.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Progress</span>
                          <span>{enrollment.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-2">
                      {isEnrolled ? (
                        <Button
                          className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/courses/${course._id}`)
                          }}
                        >
                          <Play className="mr-2" size={16} />
                          {isCompleted ? 'Review Course' : 'Continue Learning'}
                        </Button>
                      ) : canAccess ? (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                          disabled={enrolling === course._id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEnroll(course)
                          }}
                        >
                          {enrolling === course._id ? (
                            <>
                              <Loader2 className="mr-2 animate-spin" size={16} />
                              Enrolling...
                            </>
                          ) : (
                            <>
                              <BookOpen className="mr-2" size={16} />
                              Enroll Now
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowUpgradeModal(true)
                          }}
                        >
                          <Crown className="mr-2" size={16} />
                          Upgrade to Unlock
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Course Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCourse.title}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  by {typeof selectedCourse.instructor === 'string' 
                    ? selectedCourse.instructor 
                    : selectedCourse.instructor?.name || 'Unknown'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Course Image */}
                <img
                  src={selectedCourse.thumbnail || selectedCourse.thumbnailUrl || '/placeholder.svg'}
                  alt={selectedCourse.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">About this course</h3>
                  <p className="text-gray-400">{selectedCourse.description}</p>
                </div>

                {/* What you'll learn */}
                {selectedCourse.whatYouWillLearn && selectedCourse.whatYouWillLearn.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">What you'll learn</h3>
                    <ul className="space-y-2">
                      {selectedCourse.whatYouWillLearn.map((item, index) => (
                        <li key={index} className="flex items-start text-gray-400">
                          <CheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-green-500" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Course Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg">
                  {selectedCourse.lessons && (
                    <div>
                      <p className="text-sm text-gray-400">Lessons</p>
                      <p className="font-semibold">{selectedCourse.lessons}</p>
                    </div>
                  )}
                  {selectedCourse.duration && (
                    <div>
                      <p className="text-sm text-gray-400">Duration</p>
                      <p className="font-semibold">{selectedCourse.duration} hours</p>
                    </div>
                  )}
                  {selectedCourse.level && (
                    <div>
                      <p className="text-sm text-gray-400">Level</p>
                      <p className="font-semibold">{selectedCourse.level}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="font-semibold">
                      {selectedCourse.price === 0 ? 'Free' : `£${selectedCourse.price}`}
                    </p>
                  </div>
                </div>

                {/* Enroll Button */}
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold text-lg py-6"
                  disabled={enrolling === selectedCourse._id}
                  onClick={() => {
                    handleEnroll(selectedCourse)
                    setShowPreviewModal(false)
                  }}
                >
                  {enrolling === selectedCourse._id ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Enrolling...
                    </>
                  ) : selectedCourse.price > 0 && userSubscription !== 'Pro' ? (
                    <>
                      <Crown className="mr-2" size={20} />
                      Upgrade to Enroll
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2" size={20} />
                      Enroll Now - Start Learning
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Crown className="mr-2 text-amber-500" size={28} />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Unlock all premium courses and features
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded-lg space-y-2">
              <div className="flex items-center text-green-500">
                <CheckCircle className="mr-2" size={16} />
                <span>Access to all premium courses</span>
              </div>
              <div className="flex items-center text-green-500">
                <CheckCircle className="mr-2" size={16} />
                <span>Live mentoring sessions</span>
              </div>
              <div className="flex items-center text-green-500">
                <CheckCircle className="mr-2" size={16} />
                <span>Downloadable resources</span>
              </div>
              <div className="flex items-center text-green-500">
                <CheckCircle className="mr-2" size={16} />
                <span>Certificate of completion</span>
              </div>
              <div className="flex items-center text-green-500">
                <CheckCircle className="mr-2" size={16} />
                <span>Priority support</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-bold text-lg py-6"
              onClick={() => router.push('/settings?tab=billing')}
            >
              <Crown className="mr-2" size={20} />
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
