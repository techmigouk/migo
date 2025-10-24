"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, BarChart, Users, CheckCircle, ChevronDown, ChevronUp, Play, Loader2, Clock } from "lucide-react"

interface CourseData {
  _id: string
  title: string
  description: string
  thumbnail: string
  instructor: any
  price: number
  duration: number
  level: string
  tags: string[]
  status: string
  curriculum?: {
    sections?: Array<{
      title: string
      description?: string
      lessons: Array<{
        title: string
        duration: number
        type: string
        order: number
      }>
      order: number
    }>
  }
  requirements?: string[]
  objectives?: string[]
  stats?: {
    enrollments: number
    completions: number
    ratings: {
      average: number
      count: number
    }
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params?.id as string
  
  const [course, setCourse] = useState<CourseData | null>(null)
  const [relatedCourses, setRelatedCourses] = useState<any[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedModule, setExpandedModule] = useState<number | null>(0)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://techmigo.co.uk'}/api/courses/${courseId}`
          : `http://localhost:3000/api/courses/${courseId}`
        const response = await fetch(apiUrl)
        const data = await response.json()
        
        if (data.success && data.course) {
          setCourse(data.course)
          // Fetch related courses based on same category or level
          fetchRelatedCourses(data.course.tags?.[0] || data.course.level)
        } else {
          setError("Course not found")
        }
      } catch (err) {
        console.error("Error fetching course:", err)
        setError("Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const fetchRelatedCourses = async (categoryOrLevel: string) => {
    try {
      setLoadingRelated(true)
      console.log('Fetching related courses...')
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://techmigo.co.uk'}/api/courses?status=published&limit=10`
        : `http://localhost:3000/api/courses?status=published&limit=10`
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      console.log('Related courses API response:', data)
      
      if (data.success && data.courses) {
        // Filter out current course and get up to 3 related courses
        const filtered = data.courses
          .filter((c: any) => c._id !== courseId)
          .slice(0, 3)
          .map((course: any) => ({
            id: course._id,
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail || '/placeholder.svg',
            level: course.level,
            price: course.price,
            rating: course.stats?.ratings?.average || 4.8,
            enrollments: course.stats?.enrollments || 0,
          }))
        
        console.log('Filtered related courses:', filtered)
        setRelatedCourses(filtered)
      }
    } catch (err) {
      console.error("Error fetching related courses:", err)
    } finally {
      setLoadingRelated(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-white text-lg">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Course Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : 'Techmigo Instructor'
  const curriculum = course.curriculum?.sections || []
  const outcomes = course.objectives || []
  const totalDuration = Math.floor(course.duration / 60) || 0

  // Mock reviews for now - will be replaced with real API
  const reviews = [
    {
      name: "John Davis",
      avatar: "/professional-man.jpg",
      rating: 5,
      comment: "Best course I've ever taken. The projects are challenging but incredibly rewarding.",
      verified: true,
    },
    {
      name: "Lisa Chen",
      avatar: "/professional-woman-diverse.png",
      rating: 5,
      comment: "Great instructor. Clear explanations and perfect pacing.",
      verified: true,
    },
  ]

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a1f44] to-[#121826] py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-[#d1d5db] text-lg mb-6">
                {course.description}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
                  {instructorName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{instructorName}</p>
                  <p className="text-[#d1d5db] text-sm">Course Instructor</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="text-[#fbbf24] fill-[#fbbf24]" size={20} />
                  <span className="text-white font-semibold text-lg">
                    {course.stats?.ratings?.average?.toFixed(1) || '4.8'}
                  </span>
                  <span className="text-[#d1d5db]">
                    ({course.stats?.ratings?.count || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#d1d5db]">
                  <Users size={20} />
                  <span>{course.stats?.enrollments || 0} enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-[#d1d5db]">
                  <Clock size={20} />
                  <span>{totalDuration}h total</span>
                </div>
                <div className="flex items-center gap-2 text-[#d1d5db]">
                  <BarChart size={20} />
                  <span className="capitalize">{course.level}</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={course.thumbnail || "/placeholder.svg"} 
                alt={course.title} 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-[#f59e0b] rounded-full flex items-center justify-center hover:bg-[#fbbf24] transition-all duration-300 hover:scale-110">
                  <Play className="text-[#0a1f44] ml-1" size={32} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="px-8 py-4 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300 text-center">
              {course.price === 0 ? 'Enroll Free' : `Enroll Now - $${course.price}`}
            </button>
            <button className="px-8 py-4 border-2 border-[#f59e0b] text-[#f59e0b] font-semibold rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300">
              Add to Wishlist
            </button>
          </div>
          <p className="text-[#d1d5db] text-sm mt-4">Includes certificate & lifetime access</p>
        </div>
      </section>

      {/* Course Outcomes */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">What You'll Learn</h2>
        {outcomes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-[#121826] rounded-lg hover:outline hover:outline-2 hover:outline-[#f59e0b] transition-all duration-300"
              >
                <CheckCircle className="text-[#f59e0b] flex-shrink-0 mt-1" size={20} />
                <p className="text-white">{outcome}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Learning objectives will be added soon.</p>
        )}
      </section>

      {/* Curriculum */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Course Curriculum</h2>
        {curriculum.length > 0 ? (
          <div className="space-y-4">
            {curriculum.sort((a, b) => a.order - b.order).map((module, index) => (
              <div key={index} className="bg-[#121826] rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 hover:bg-[#0a1f44] transition-colors"
                >
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-white">{module.title}</h3>
                    {module.description && (
                      <p className="text-gray-400 text-sm mt-1">{module.description}</p>
                    )}
                  </div>
                  {expandedModule === index ? (
                    <ChevronUp className="text-[#f59e0b] flex-shrink-0 ml-4" size={24} />
                  ) : (
                    <ChevronDown className="text-[#f59e0b] flex-shrink-0 ml-4" size={24} />
                  )}
                </button>
                {expandedModule === index && module.lessons && (
                  <div className="px-6 pb-6 space-y-3 border-l-2 border-[#f59e0b] ml-6">
                    {module.lessons.sort((a, b) => a.order - b.order).map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className="flex items-center justify-between py-2 hover:text-[#f59e0b] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.type === "video" && <Play size={16} className="text-[#d1d5db]" />}
                          {lesson.type === "quiz" && <CheckCircle size={16} className="text-[#d1d5db]" />}
                          {lesson.type === "article" && <BarChart size={16} className="text-[#d1d5db]" />}
                          <span className="text-white">{lesson.title}</span>
                        </div>
                        <span className="text-[#d1d5db] text-sm">
                          {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Course curriculum will be added soon.</p>
        )}
      </section>

      {/* Instructor Bio */}
      <section className="bg-[#121826] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Your Instructor</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src="/instructor-professional.jpg"
              alt="Sarah Johnson"
              className="w-48 h-48 rounded-xl border-4 border-[#f59e0b] hover:shadow-lg hover:shadow-[#f59e0b]/30 transition-all duration-300"
            />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Sarah Johnson</h3>
              <p className="text-[#f59e0b] mb-4">Senior Full-Stack Engineer at Tech Corp</p>
              <p className="text-[#d1d5db] mb-6 leading-relaxed">
                Sarah has over 10 years of experience building web applications for Fortune 500 companies. She's
                passionate about teaching and has helped thousands of students launch their tech careers. Her teaching
                style focuses on practical, real-world projects that prepare you for actual development work.
              </p>
              <Link
                href="/courses"
                className="inline-block px-6 py-3 border-2 border-[#f59e0b] text-[#f59e0b] font-semibold rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300"
              >
                View All Courses by Sarah
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Learner Reviews</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-[#121826] p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border-2 border-[#f59e0b]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold">{review.name}</h4>
                    {review.verified && (
                      <span className="text-xs bg-[#f59e0b] text-[#0a1f44] px-2 py-1 rounded-full">Verified</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-[#fbbf24] fill-[#fbbf24]" size={14} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#d1d5db]">{review.comment}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button className="px-6 py-3 border-2 border-[#f59e0b] text-[#f59e0b] font-semibold rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300">
            Write a Review
          </button>
        </div>
      </section>

      {/* Related Courses */}
      <section className="bg-[#121826] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">You May Also Like</h2>
          {loadingRelated ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
              <span className="ml-3 text-gray-300">Loading related courses...</span>
            </div>
          ) : relatedCourses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {relatedCourses.map((relatedCourse) => (
                <div
                  key={relatedCourse.id}
                  className="bg-[#0a1f44] rounded-xl overflow-hidden hover:scale-105 hover:shadow-xl hover:shadow-[#f59e0b]/20 transition-all duration-300"
                >
                  <img
                    src={relatedCourse.thumbnail}
                    alt={relatedCourse.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#f59e0b] uppercase">
                        {relatedCourse.level}
                      </span>
                      {relatedCourse.price === 0 && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          FREE
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{relatedCourse.title}</h3>
                    <p className="text-[#d1d5db] text-sm mb-4 line-clamp-2">
                      {relatedCourse.description}
                    </p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-[#d1d5db]">
                      <div className="flex items-center gap-1">
                        <Star className="text-[#fbbf24] fill-[#fbbf24]" size={14} />
                        <span>{relatedCourse.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{relatedCourse.enrollments}</span>
                      </div>
                    </div>
                    <Link
                      href={`/courses/${relatedCourse.id}`}
                      className="block w-full px-4 py-2 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300 text-center"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No related courses available yet. Create more courses in the admin dashboard!</p>
              <Link
                href="/courses"
                className="inline-block px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all"
              >
                Browse All Courses
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1f44] mb-4">Start Learning Now</h2>
          <p className="text-[#0a1f44] text-lg mb-8">Cancel anytime. 7-day money-back guarantee.</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-[#0a1f44] text-white font-semibold rounded-lg hover:bg-[#121826] transition-all duration-300"
          >
            Enroll Today
          </Link>
        </div>
      </section>
    </div>
  )
}
