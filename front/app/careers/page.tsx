import Link from "next/link"
import { MapPin, Briefcase, Clock } from "lucide-react"

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
    },
    {
      title: "Content Creator",
      department: "Content",
      location: "Remote",
      type: "Contract",
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
    },
  ]

  return (
    <div className="bg-gradient-to-b from-[#0a1f44] to-[#121826] min-h-screen">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Join Our Mission</h1>
        <p className="text-[#d1d5db] text-lg max-w-2xl mx-auto mb-8">
          We're redefining how the world learns tech — and we want you on board
        </p>
        <Link
          href="#positions"
          className="inline-block px-8 py-4 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
        >
          View Open Roles
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Join Techmigo?</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            "Remote-first, globally distributed team",
            "Built by creators, educators, and engineers",
            "Competitive salary and equity",
            "Unlimited PTO and flexible hours",
            "Learning stipend for continuous growth",
            "Health, dental, and vision coverage",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-[#d1d5db]">
              <div className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="positions" className="bg-[#121826] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <Link
                key={index}
                href={`/careers/${index + 1}`}
                className="block bg-[#0a1f44] p-6 rounded-xl hover:outline hover:outline-2 hover:outline-[#f59e0b] hover:shadow-lg hover:shadow-[#f59e0b]/20 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-3">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-[#d1d5db] text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{job.type}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0a1f44] mb-4">We're building something extraordinary. Join us.</h2>
          <a
            href="mailto:careers@techmigo.com"
            className="inline-block px-8 py-4 bg-[#0a1f44] text-white font-semibold rounded-lg hover:bg-[#121826] transition-all duration-300"
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  )
}
