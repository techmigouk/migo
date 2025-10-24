import { Star, Play } from "lucide-react"

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Frontend Developer at Google",
      avatar: "/professional-man.jpg",
      quote:
        "Techmigo transformed my career. The project-based approach helped me build a portfolio that landed me my dream job at Google.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Data Analyst at Microsoft",
      avatar: "/professional-woman-diverse.png",
      quote:
        "The mentorship and real-world projects made all the difference. I went from complete beginner to professional in just 6 months.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "UX Designer at Apple",
      avatar: "/designer-man.jpg",
      quote:
        "Best investment in my education. The quality of instruction rivals top universities at a fraction of the cost.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Full-Stack Engineer at Amazon",
      avatar: "/engineer-woman.jpg",
      quote: "The hands-on projects gave me real confidence. I built 5 production-ready apps during the course.",
      rating: 5,
    },
    {
      name: "Carlos Rodriguez",
      role: "DevOps Engineer at Netflix",
      avatar: "/engineer-man.png",
      quote: "Techmigo doesn't just teach theory—they prepare you for real work. The career support was invaluable.",
      rating: 5,
    },
    {
      name: "Lisa Chen",
      role: "Product Designer at Airbnb",
      avatar: "/stylish-woman.png",
      quote: "The community and mentors are incredible. I still reach out to my instructor for career advice.",
      rating: 5,
    },
  ]

  const stats = [
    { number: "10,000+", label: "Projects Completed" },
    { number: "98%", label: "Recommend Us" },
    { number: "120+", label: "Career Placements" },
  ]

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Real Stories. Real Success.</h1>
        <p className="text-[#d1d5db] text-lg max-w-2xl mx-auto">
          Hear from learners who turned their skills into careers
        </p>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#121826] p-8 rounded-xl hover:scale-105 hover:outline hover:outline-2 hover:outline-[#f59e0b] hover:shadow-xl hover:shadow-[#f59e0b]/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-2 border-[#f59e0b]"
                />
                <div>
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-[#d1d5db] text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-white mb-4 leading-relaxed">{testimonial.quote}</p>
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-[#fbbf24] fill-[#fbbf24]" size={16} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#121826] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Watch Their Journey</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src={`/video-testimonial-.jpg?height=300&width=400&query=video+testimonial+${i}`}
                  alt={`Video testimonial ${i}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                  <div className="w-16 h-16 bg-[#f59e0b] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="text-[#0a1f44] ml-1" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-5xl font-bold text-[#f59e0b] mb-2">{stat.number}</div>
              <div className="text-[#d1d5db] text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1f44] mb-4">Your Story Starts Here</h2>
          <a
            href="/signup"
            className="inline-block px-8 py-4 bg-[#0a1f44] text-white font-semibold rounded-lg hover:bg-[#121826] transition-all duration-300"
          >
            Get Started Free
          </a>
        </div>
      </section>
    </div>
  )
}
