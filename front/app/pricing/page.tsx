"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { useState } from "react"

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planName: string, priceId: string) => {
    setLoading(planName)
    try {
      const response = await fetch('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
        setLoading(null)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
      setLoading(null)
    }
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for exploring and getting started with basic learning",
      features: [
        "Access to 5 free courses",
        "Basic project templates",
        "Community forum access",
        "Course completion certificates",
      ],
      cta: "Get Started",
      highlighted: false,
      priceId: null,
    },
    {
      name: "Monthly",
      price: "$24.99",
      period: "per month",
      description: "For learners who want flexibility with month-to-month access",
      features: [
        "Full course library access",
        "Unlimited projects",
        "Verified certificates",
        "Mentor access",
        "Priority support",
        "Cancel anytime",
      ],
      cta: "Start Monthly",
      highlighted: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || "price_1SLGCAJZuJlFWRBhESjwJ5ik",
    },
    {
      name: "Annual",
      price: "$249.90",
      period: "per year",
      description: "Best value! Serious learners save 16% with annual commitment",
      features: [
        "Everything in Monthly",
        "Save $49.98 per year",
        "Priority support",
        "Exclusive workshops",
        "Early access to new content",
        "Career guidance",
        "1-on-1 mentorship sessions",
      ],
      cta: "Get Annual Plan",
      highlighted: true,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "price_1SLGCAJZuJlFWRBhXv7LEw3Q",
      badge: "🔥 MOST POPULAR",
    },
    {
      name: "Lifetime",
      price: "$899.64",
      period: "one-time payment",
      description: "One-time payment for unlimited lifetime access - never pay again!",
      features: [
        "Everything in Annual",
        "Lifetime access to all courses",
        "All future courses included",
        "Lifetime updates",
        "VIP community access",
        "White-glove onboarding",
        "Dedicated account manager",
      ],
      cta: "Get Lifetime Access",
      highlighted: false,
      priceId: "price_lifetime_plan",
      badge: "💎 BEST DEAL",
    },
  ]

  return (
    <div className="bg-linear-to-b from-[#0a1f44] to-[#121826] min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Choose Your Learning Path</h1>
        <p className="text-[#d1d5db] text-lg md:text-xl max-w-2xl mx-auto">
          Start free, upgrade when you're ready. All plans include lifetime access to purchased courses.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#121826] rounded-2xl p-8 ${
                plan.highlighted ? "ring-4 ring-[#f59e0b] scale-105 shadow-2xl shadow-[#f59e0b]/20" : "hover:scale-105"
              } transition-all duration-300`}
            >
              {plan.badge && (
                <div className="bg-[#f59e0b] text-[#0a1f44] text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-[#f59e0b]">{plan.price}</span>
                <span className="text-[#d1d5db] ml-2">/ {plan.period}</span>
              </div>
              <p className="text-[#d1d5db] mb-6">{plan.description}</p>
              {plan.priceId ? (
                <button
                  onClick={() => handleSubscribe(plan.name, plan.priceId!)}
                  disabled={loading === plan.name}
                  className={`block w-full px-6 py-3 font-semibold rounded-lg text-center transition-all duration-300 mb-6 ${
                    plan.highlighted
                      ? "bg-[#f59e0b] text-[#0a1f44] hover:bg-[#fbbf24]"
                      : "border-2 border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10"
                  } ${loading === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading === plan.name ? 'Loading...' : plan.cta}
                </button>
              ) : (
                <Link
                  href="/signup"
                  className={`block w-full px-6 py-3 font-semibold rounded-lg text-center transition-all duration-300 mb-6 ${
                    plan.highlighted
                      ? "bg-[#f59e0b] text-[#0a1f44] hover:bg-[#fbbf24]"
                      : "border-2 border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="text-[#f59e0b] shrink-0 mt-0.5" size={20} />
                    <span className="text-[#d1d5db]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              q: "Can I switch plans anytime?",
              a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time.",
            },
            {
              q: "Do you offer refunds?",
              a: "We offer a 7-day money-back guarantee on all paid plans. No questions asked.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans.",
            },
          ].map((faq, index) => (
            <div key={index} className="bg-[#121826] p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-[#d1d5db]">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-linear-to-r from-[#f59e0b] to-[#fbbf24] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1f44] mb-4">Ready to Start Learning?</h2>
          <p className="text-[#0a1f44] text-lg mb-8">Join 50,000+ learners building real tech skills</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-[#0a1f44] text-white font-semibold rounded-lg hover:bg-[#121826] transition-all duration-300"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
