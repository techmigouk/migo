export default function PrivacyPage() {
  return (
    <div className="bg-gradient-to-b from-[#121826] to-[#0a1f44] min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-[#d1d5db] mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-[#d1d5db] leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including name, email address, and payment information
              when you create an account or enroll in courses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
            <p>
              We use your information to provide, maintain, and improve our services, process transactions, send you
              technical notices and support messages, and communicate with you about products, services, and events.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time. You can also opt
              out of marketing communications.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-[#121826] rounded-xl">
          <p className="text-white mb-4">For questions or requests, contact:</p>
          <a href="mailto:privacy@techmigo.com" className="text-[#f59e0b] hover:underline">
            privacy@techmigo.com
          </a>
        </div>
      </div>
    </div>
  )
}
