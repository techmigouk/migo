import Link from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faArrowRight,
  faBookOpen,
  faWrench,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons'

async function getPublishedCourses() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/courses?status=published&limit=3`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) {
      console.error('Failed to fetch courses:', res.status)
      return []
    }
    
    const data = await res.json()
    
    if (data.success && data.courses) {
      return data.courses.map((course: any) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        instructor: typeof course.instructor === 'object' ? course.instructor.name : 'Techmigo Instructor',
        rating: course.stats?.ratings?.average || 4.8,
        image: course.thumbnail || "/placeholder.svg",
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function HomePage() {
  const courses = await getPublishedCourses()

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Frontend Developer at Google",
      avatar: "/professional-portrait.png",
      quote:
        "Techmigo transformed my career. The project-based approach helped me build a portfolio that landed me my dream job.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Data Analyst at Microsoft",
      avatar: "/professional-woman-diverse.png",
      quote:
        "The mentorship and real-world projects made all the difference. I went from beginner to professional in 6 months.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "UX Designer at Apple",
      avatar: "/designer-portrait.png",
      quote:
        "Best investment in my education. The quality of instruction rivals top universities at a fraction of the cost.",
      rating: 5,
    },
  ]

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826]">
      {/* Hero Section */}
  <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 text-balance">
              Learn Tech. Build Real Projects. Launch Your Career.
            </h1>
            <p className="text-[#d1d5db] text-lg md:text-xl mb-8 text-pretty">
              Master skills through short, practical video lessons paired with real-world projects and mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Link
                href="/signup"
                aria-label="Get started free - sign up"
                className="hero-cta"
              >
                <span>Get Started Free</span>
                <span className="cta-badge">No card</span>
              </Link>
              <Link
                href="/courses"
                className="px-8 py-4 border-2 border-[#f59e0b] text-[#f59e0b] font-semibold rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300 text-center"
              >
                Browse Courses
              </Link>
            </div>
            <p className="text-[#d1d5db] text-sm">No credit card required to register.</p>
          </div>
          <div className="relative">
            <img src="/diverse-students-learning-coding.jpg" alt="Students learning" className="rounded-2xl shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f59e0b]/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Trusted By Section - premium */}
      <section className="bleed trusted-section py-16">
        <div className="container px-4">
          <h3 className="text-center text-2xl md:text-3xl font-semibold text-white mb-3">Trusted by senior teams & industry leaders</h3>
          <p className="trusted-caption">Global and UK-based enterprises partner with us to upskill senior technical teams and leaders. Their training budgets trust outcomes, not promises.</p>

          <div className="trusted-grid mt-6">
            {[
              { id: 'tesco', text: 'TESCO', color: '#E60000' },
              { id: 'hsbc', text: 'HSBC', color: '#DB0011' },
              { id: 'bp', text: 'BP', color: '#009B3A' },
              { id: 'unilever', text: 'UNILEVER', color: '#0072CE' },
              { id: 'gsk', text: 'GSK', color: '#FF6A00' },
              { id: 'barclays', text: 'BARCLAYS', color: '#00AEEF' },
            ].map((logo) => (
              <button key={logo.id} className="trusted-badge trusted-text-badge" aria-label={`${logo.text} - enterprise partner`}>
                <span className="trusted-text" style={{ color: 'white' }}>{logo.text}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Futuristic */}
  <section className="bleed section page-section">
        <div className="container">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-6">How It Works</h2>
          <p className="text-[#d1d5db] text-center mb-10 text-lg max-w-2xl mx-auto">Our guided, adaptive learning experience uses proven pedagogy and modern tooling to take you from zero to job-ready.</p>

          <div className="future-grid">
            {[
              {
                icon: faBookOpen,
                title: 'Smart Learning Path',
                description: 'Personalized roadmap and quick assessments to keep you progressing.',
                number: '01',
              },
              {
                icon: faWrench,
                title: 'Build Real Projects',
                description: 'Practical, mentor-reviewed projects using industry tools.',
                number: '02',
              },
              {
                icon: faBriefcase,
                title: 'Launch Career',
                description: 'Job-ready portfolio, verified certificates, and employer introductions.',
                number: '03',
              },
            ].map((step, idx) => (
              <div key={idx} className="future-card fade-in-up" style={{ animationDelay: `${idx * 0.12}s` }}>
                <div className="future-number">{step.number}</div>
                <div className="relative z-10">
                  <div className="future-icon">
                    <FontAwesomeIcon icon={step.icon} className="text-[#f59e0b] w-5 h-5" aria-hidden />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-[#d1d5db]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses" className="btn-premium inline-flex items-center gap-3 px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg">
              Explore Learning Paths
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">Start Learning Today</h2>
        <p className="text-[#d1d5db] text-center mb-12 text-lg">Our top-rated project-based courses</p>
        {courses.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course: any, index: number) => (
                <div
                  key={course.id || index}
                  className="bg-[#121826] rounded-xl overflow-hidden hover:scale-105 hover:shadow-xl hover:shadow-[#f59e0b]/20 transition-all duration-300"
                >
                  <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-[#d1d5db] text-sm mb-4">{course.description}</p>
                    <p className="text-[#d1d5db] text-sm mb-3">{course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-[#fbbf24] w-4 h-4" aria-hidden />
                        <span className="text-white font-semibold">{course.rating}</span>
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className="px-4 py-2 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
              >
                View All Courses <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" aria-hidden />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#d1d5db] text-lg mb-6">New courses coming soon! Check back later.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
            >
              Browse All Courses <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" aria-hidden />
            </Link>
          </div>
        )}
      </section>

      {/* Testimonials */}
  <section className="bleed bg-[#121826] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">What Learners Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#0a1f44] p-8 rounded-xl hover:scale-105 hover:outline hover:outline-2 hover:outline-[#f59e0b] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-[#f59e0b]"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-[#d1d5db] text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white mb-4">{testimonial.quote}</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="text-[#fbbf24]" style={{ width: 16, height: 16 }} aria-hidden />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
  <section className="bleed bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0a1f44] mb-4">
            Start Learning Today — Your Portfolio Awaits
          </h2>
          <p className="text-[#0a1f44] text-lg mb-8">No credit card required. Cancel anytime.</p>
          <Link
            href="/signup"
            className="join-cta relative inline-block"
            aria-label="Join now - start learning"
          >
            <span>Join Now</span>
            <span className="badge">No card</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
