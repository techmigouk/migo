import Link from "next/link"
import { Search, BookOpen, CreditCard, Award, MessageCircle, Settings } from "lucide-react"

export default function HelpPage() {
  const topics = [
    { icon: <BookOpen className="text-[#f59e0b]" size={32} />, title: "Getting Started", articles: 12 },
    { icon: <CreditCard className="text-[#f59e0b]" size={32} />, title: "Billing & Payments", articles: 8 },
    { icon: <Award className="text-[#f59e0b]" size={32} />, title: "Certificates", articles: 6 },
    { icon: <MessageCircle className="text-[#f59e0b]" size={32} />, title: "Mentorship", articles: 5 },
    { icon: <Settings className="text-[#f59e0b]" size={32} />, title: "Account Settings", articles: 10 },
  ]

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen">
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Help Center</h1>
        <p className="text-[#d1d5db] text-lg mb-8">
          Find answers, troubleshoot issues, and contact support when you need it
        </p>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#d1d5db]" size={20} />
          <input
            type="text"
            placeholder="Search topics, e.g. 'Reset Password' or 'Cancel Subscription'"
            className="w-full pl-12 pr-4 py-4 bg-[#121826] text-white rounded-xl border-2 border-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Popular Help Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="bg-[#121826] p-6 rounded-xl hover:outline hover:outline-2 hover:outline-[#f59e0b] transition-all duration-300 cursor-pointer"
            >
              <div className="mb-4">{topic.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{topic.title}</h3>
              <p className="text-[#d1d5db] text-sm">{topic.articles} articles</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#121826] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  )
}
