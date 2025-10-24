import Link from "next/link"
import { Calendar, User } from "lucide-react"

export default function BlogPage() {
  const featuredPost = {
    title: "The Future of Tech Education: Why Project-Based Learning Wins",
    excerpt: "Discover why hands-on projects are revolutionizing how we learn programming and technical skills.",
    image: "/tech-education-future.jpg",
    category: "Education",
    author: "Sarah Johnson",
    date: "Jan 15, 2025",
  }

  const posts = [
    {
      title: "10 Essential Skills Every Developer Needs in 2025",
      excerpt: "Stay ahead of the curve with these must-have technical and soft skills.",
      image: "/developer-skills.jpg",
      category: "Career",
      author: "Michael Chen",
      date: "Jan 12, 2025",
    },
    {
      title: "How to Build Your First Full-Stack Application",
      excerpt: "A step-by-step guide to creating a complete web app from scratch.",
      image: "/full-stack-development.png",
      category: "Tutorial",
      author: "Emma Rodriguez",
      date: "Jan 10, 2025",
    },
    {
      title: "Breaking Into Tech: Success Stories from Our Community",
      excerpt: "Real stories from learners who transformed their careers through Techmigo.",
      image: "/success-stories.jpg",
      category: "Inspiration",
      author: "David Kim",
      date: "Jan 8, 2025",
    },
  ]

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Insights & Inspiration</h1>
        <p className="text-[#d1d5db] text-lg max-w-2xl mx-auto">
          Stay ahead with articles from tech experts, mentors, and industry leaders
        </p>
      </section>

      {/* Featured Post */}
      <section className="container mx-auto px-4 py-8">
        <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
          <img
            src={featuredPost.image || "/placeholder.svg"}
            alt={featuredPost.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f44] via-[#0a1f44]/50 to-transparent flex items-end p-8">
            <div>
              <span className="inline-block px-3 py-1 bg-[#f59e0b] text-[#0a1f44] text-sm font-semibold rounded-full mb-3">
                Editor's Pick
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-[#f59e0b] transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-[#d1d5db] mb-4">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 text-[#d1d5db] text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{featuredPost.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-[#121826] rounded-xl overflow-hidden hover:scale-105 hover:outline hover:outline-2 hover:outline-[#f59e0b] transition-all duration-300 cursor-pointer"
            >
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-[#f59e0b] text-[#0a1f44] text-xs font-semibold rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 hover:text-[#f59e0b] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#d1d5db] text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-[#d1d5db] text-sm">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300">
            Load More Articles
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0a1f44] mb-4">Want to learn from our experts?</h2>
          <Link
            href="/courses"
            className="inline-block px-8 py-4 bg-[#0a1f44] text-white font-semibold rounded-lg hover:bg-[#121826] transition-all duration-300"
          >
            Join the Platform
          </Link>
        </div>
      </section>
    </div>
  )
}
