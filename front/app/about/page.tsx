import Link from "next/link"
import { Target, Eye, Heart, Award, Users, BookOpen } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Award className="text-[#f59e0b]" size={40} />,
      title: "Excellence",
      description: "We deliver world-class education that rivals top universities.",
    },
    {
      icon: <Users className="text-[#f59e0b]" size={40} />,
      title: "Community",
      description: "Learning together makes us stronger and more successful.",
    },
    {
      icon: <Heart className="text-[#f59e0b]" size={40} />,
      title: "Innovation",
      description: "We constantly evolve our teaching methods and technology.",
    },
    {
      icon: <BookOpen className="text-[#f59e0b]" size={40} />,
      title: "Integrity",
      description: "Honest, transparent, and committed to learner success.",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Learners" },
    { number: "200+", label: "Industry Experts" },
    { number: "95%", label: "Learner Satisfaction" },
    { number: "120+", label: "Countries" },
  ]

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Empowering the Next Generation of Tech Innovators
        </h1>
        <p className="text-[#d1d5db] text-lg md:text-xl max-w-3xl mx-auto">
          Our mission is to make world-class tech education accessible, practical, and inspiring.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#121826] p-8 rounded-xl">
            <Target className="text-[#f59e0b] mb-4" size={48} />
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-[#d1d5db] leading-relaxed">
              To empower learners worldwide with practical tech skills through project-based education, mentorship, and
              real-world experience. We believe learning should lead to doing, not just knowing.
            </p>
          </div>
          <div className="bg-[#121826] p-8 rounded-xl">
            <Eye className="text-[#f59e0b] mb-4" size={48} />
            <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-[#d1d5db] leading-relaxed">
              A world where anyone, anywhere can prove their skills through projects and launch meaningful tech careers.
              We're building the future of education—one project at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-[#121826] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-[#0a1f44] p-6 rounded-xl hover:outline hover:outline-2 hover:outline-[#f59e0b] hover:shadow-lg hover:shadow-[#f59e0b]/20 transition-all duration-300"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-[#d1d5db]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#f59e0b] mb-2">{stat.number}</div>
              <div className="text-[#d1d5db] text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1f44] mb-4">
            Join Us in Building the Future of Tech Education
          </h2>
          <Link
            href="/courses"
            className="inline-block px-8 py-4 bg-[#0a1f44] text-white font-semibold rounded-lg hover:bg-[#121826] transition-all duration-300"
          >
            Explore Courses
          </Link>
        </div>
      </section>
    </div>
  )
}
