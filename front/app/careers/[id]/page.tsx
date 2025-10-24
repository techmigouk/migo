"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Briefcase, Clock } from "lucide-react"

export default function JobDetailPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    coverLetter: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/careers" className="text-[#f59e0b] hover:underline mb-6 inline-block">
          ← Back to Careers
        </Link>

        <div className="bg-[#121826] p-8 rounded-xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Senior Frontend Engineer</h1>
          <div className="flex flex-wrap gap-4 text-[#d1d5db] mb-6">
            <div className="flex items-center gap-2">
              <Briefcase size={18} />
              <span>Engineering</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>Remote</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>Full-time</span>
            </div>
          </div>

          <div className="space-y-6 text-[#d1d5db] leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">About the Role</h2>
              <p>
                We're looking for an experienced frontend engineer to help build the future of online education. You'll
                work on our core learning platform, creating beautiful and performant user experiences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Build and maintain our Next.js-based learning platform</li>
                <li>Collaborate with designers to implement pixel-perfect UIs</li>
                <li>Optimize application performance and accessibility</li>
                <li>Mentor junior engineers and contribute to code reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>5+ years of experience with React and modern JavaScript</li>
                <li>Strong understanding of Next.js, TypeScript, and Tailwind CSS</li>
                <li>Experience with performance optimization and accessibility</li>
                <li>Excellent communication and collaboration skills</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="bg-[#121826] p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Apply for this Position</h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">LinkedIn / Portfolio URL</label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Cover Letter (Optional)</label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
              >
                Submit Application
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-white mb-2">Application Received!</h3>
              <p className="text-[#d1d5db]">We'll get in touch soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
