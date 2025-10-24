"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, Star, Clock, BarChart, Users, Loader2 } from "lucide-react"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://techmigo.co.uk'}/api/courses?status=published`
          : 'http://localhost:3000/api/courses?status=published'
        const response = await fetch(apiUrl)
        const data = await response.json()
        
        if (data.success && data.courses) {
          const mappedCourses = data.courses.map((course: any) => ({
            id: course._id,
            title: course.title,
            description: course.description,
            category: course.category || 'General',
            level: course.level.charAt(0).toUpperCase() + course.level.slice(1),
            duration: `${Math.floor((course.duration || 0) / 60)}h`,
            enrolled: course.stats?.enrollments || 0,
            rating: course.stats?.ratings?.average || 4.8,
            image: course.thumbnail || "/placeholder.svg",
            price: course.price || 0,
          }))
          setCourses(mappedCourses)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  const categories = Array.from(new Set(courses.map(c => c.category)))

  const resetFilters = () => {
    setSelectedCategory("All")
    setSelectedLevel("All Levels")
    setSearchQuery("")
  }

  return (
    <div className="bg-gradient-to-b from-[#121826] to-[#0a1f44] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#121826] to-[#0a1f44] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Explore Our Courses</h1>
          <p className="text-[#d1d5db] text-lg mb-8">
            Find your path. Every course includes real projects, quizzes, and certificates.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#d1d5db]" size={20} />
            <input
              type="text"
              placeholder="Search by topic, skill, or keyword…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#0a1f44] text-white rounded-xl border-2 border-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:shadow-lg focus:shadow-[#f59e0b]/20"
            />
          </div>
          <p className="text-[#d1d5db] text-sm mt-4">
            {loading ? 'Loading...' : `Showing ${filteredCourses.length} courses • Updated weekly`}
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-[#101521] border-b border-[#374151] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-[#0a1f44] text-white rounded-lg border border-[#374151] focus:border-[#f59e0b] focus:outline-none"
            >
              <option>All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 bg-[#0a1f44] text-white rounded-lg border border-[#374151] focus:border-[#f59e0b] focus:outline-none"
            >
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 border border-[#f59e0b] text-[#f59e0b] rounded-lg hover:bg-[#f59e0b]/10 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
            <span className="ml-3 text-gray-300 text-lg">Loading courses...</span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#121826] rounded-xl overflow-hidden hover:scale-105 hover:outline hover:outline-2 hover:outline-[#f59e0b] hover:shadow-xl hover:shadow-[#f59e0b]/20 transition-all duration-300"
              >
                <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-[#f59e0b] text-[#0a1f44] text-xs font-semibold rounded-full">
                      {course.category}
                    </span>
                    {course.price === 0 && (
                      <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-[#d1d5db] text-sm mb-4">{course.description}</p>
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="text-[#fbbf24] fill-[#fbbf24]" size={16} />
                    <span className="text-white font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#d1d5db] text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart size={16} />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.enrolled.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="block w-full px-4 py-2 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300 text-center"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#d1d5db] text-lg mb-4">No courses found matching your criteria.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Promo Strip */}
      <section className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a1f44] mb-4">Want personalized recommendations?</h2>
          <Link
            href="/quiz"
            className="inline-block px-8 py-4 bg-[#0a1f44] text-white font-semibold rounded-lg hover:bg-[#121826] transition-all duration-300"
          >
            Take the Skill Quiz
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#121826] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Learning Journey Today</h2>
          <p className="text-[#d1d5db] text-lg mb-8">Join 10,000+ learners building real tech skills</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
