"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General Inquiry",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">We'd Love to Hear From You</h1>
        <p className="text-[#d1d5db] text-lg max-w-2xl mx-auto">
          Whether you're a learner, educator, or organization, our team is here to help.
        </p>
      </section>

      {/* Contact Form & Info */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-[#121826] p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Message Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors"
                >
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Partnerships</option>
                  <option>Press</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
              >
                Send Message
              </button>
              {submitted && (
                <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                  ✓ Your message has been sent successfully!
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#121826] p-6 rounded-xl">
              <MapPin className="text-[#f59e0b] mb-3" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Address</h3>
              <p className="text-[#d1d5db]">
                123 Innovation Drive
                <br />
                San Francisco, CA 94105
              </p>
            </div>
            <div className="bg-[#121826] p-6 rounded-xl">
              <Mail className="text-[#f59e0b] mb-3" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Email</h3>
              <p className="text-[#d1d5db]">support@techmigo.com</p>
            </div>
            <div className="bg-[#121826] p-6 rounded-xl">
              <Phone className="text-[#f59e0b] mb-3" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
              <p className="text-[#d1d5db]">+1 (800) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-[#121826] p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need immediate help?</h2>
          <Link
            href="/help"
            className="inline-block px-8 py-3 bg-[#0a1f44] border-2 border-[#f59e0b] text-[#f59e0b] font-semibold rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300"
          >
            Visit Help Center
          </Link>
        </div>
      </section>
    </div>
  )
}
