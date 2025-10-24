import Link from "next/link"
import { Linkedin, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0a1f44] border-t border-[#374151]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="text-2xl font-extrabold uppercase mb-4" style={{ fontWeight: 900 }}>
              <span className="text-[#f59e0b]">TECH</span>
              <span className="text-white">MIGO</span>
            </div>
            <p className="text-[#d1d5db] text-sm">
              Empowering the next generation of tech innovators through practical, project-based learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Courses", "Pricing", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-[#d1d5db] hover:text-[#f59e0b] transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Help Center", href: "/help" },
                { label: "Terms", href: "/terms" },
                { label: "Privacy", href: "/privacy" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#d1d5db] hover:text-[#f59e0b] transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-[#d1d5db] hover:text-[#f59e0b] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-[#d1d5db] hover:text-[#f59e0b] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[#d1d5db] hover:text-[#f59e0b] transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#374151] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#d1d5db] text-sm">© 2025 Techmigo. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <select className="bg-[#121826] text-[#d1d5db] px-4 py-2 rounded-lg border border-[#374151] text-sm">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  )
}
