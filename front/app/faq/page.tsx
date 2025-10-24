"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const categories = [
    {
      name: "General",
      faqs: [
        {
          q: "What is Techmigo?",
          a: "Techmigo is a premium online learning platform specializing in IT and tech education through project-based courses.",
        },
        {
          q: "How do I get started?",
          a: "Simply sign up for a free account and browse our course catalog. You can start with free courses or upgrade to Pro for full access.",
        },
      ],
    },
    {
      name: "Courses & Certificates",
      faqs: [
        {
          q: "Do I get a certificate after completing a course?",
          a: "Yes! All courses include a certificate of completion. Pro members receive verified certificates.",
        },
        {
          q: "How long do I have access to a course?",
          a: "You have lifetime access to any course you enroll in, including all future updates.",
        },
      ],
    },
    {
      name: "Payments & Refunds",
      faqs: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans.",
        },
        {
          q: "Do you offer refunds?",
          a: "Yes, we offer a 7-day money-back guarantee on all paid plans.",
        },
      ],
    },
  ]

  return (
    <div className="bg-gradient-to-b from-[#121826] to-[#0a1f44] min-h-screen">
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-[#d1d5db] text-lg">Find quick answers about enrollment, payments, and certificates</p>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-4xl">
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-[#f59e0b] mb-6">{category.name}</h2>
            <div className="space-y-4">
              {category.faqs.map((faq, faqIndex) => {
                const globalIndex = catIndex * 10 + faqIndex
                return (
                  <div key={faqIndex} className="bg-[#121826] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-[#0a1f44] transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white pr-4">{faq.q}</h3>
                      {openIndex === globalIndex ? (
                        <ChevronUp className="text-[#f59e0b] flex-shrink-0" size={24} />
                      ) : (
                        <ChevronDown className="text-[#f59e0b] flex-shrink-0" size={24} />
                      )}
                    </button>
                    {openIndex === globalIndex && (
                      <div className="px-6 pb-6">
                        <p className="text-[#d1d5db] leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="bg-[#121826] p-8 rounded-xl text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-[#d1d5db] mb-6">Didn't find your answer?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/help"
              className="px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
            >
              Visit Help Center
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-[#f59e0b] text-[#f59e0b] font-semibold rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
