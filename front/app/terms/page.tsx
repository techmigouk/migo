export default function TermsPage() {
  return (
    <div className="bg-gradient-to-b from-[#121826] to-[#0a1f44] min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-[#d1d5db] mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-[#d1d5db] leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Techmigo, you accept and agree to be bound by the terms and provision of this
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Account Terms</h2>
            <p>
              You must be 13 years or older to use this service. You are responsible for maintaining the security of
              your account and password.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Course Access</h2>
            <p>
              Upon enrollment, you receive lifetime access to course materials. We reserve the right to modify or
              discontinue courses with notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
            <p>
              All course content, including videos, text, and projects, are owned by Techmigo and protected by copyright
              laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Refund Policy</h2>
            <p>
              We offer a 7-day money-back guarantee on all paid plans. Refunds are processed within 5-10 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
