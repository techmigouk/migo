"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Header() {
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  // Only apply scroll class after mount; SSR always renders default
  let headerClass = "bg-gradient-to-r from-[#0a1f44] to-[#121826] py-4"
  if (hasMounted && isScrolled) {
    headerClass = "bg-[#0a1f44]/95 backdrop-blur-sm shadow-lg py-3"
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${headerClass}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="TECHMIGO home">
            <div className="text-2xl md:text-2xl font-extrabold tracking-wide uppercase" style={{ fontWeight: 900 }}>
              <span className="text-[#f59e0b]">TECH</span>
              <span className="text-white">MIGO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-medium text-sm hover:text-[#f59e0b] transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f59e0b] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <a
                  href={process.env.NODE_ENV === 'production' 
                    ? 'https://app.techmigo.co.uk' 
                    : 'http://localhost:3004'}
                  className="flex items-center gap-2 px-4 py-2 border border-[#f59e0b] text-[#f59e0b] rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300"
                >
                  <User size={18} />
                  <span>{user.name}</span>
                </a>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-[#f59e0b] text-[#f59e0b] rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#374151] pt-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-[#f59e0b] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                {user ? (
                  <>
                    <a
                      href={process.env.NODE_ENV === 'production' 
                        ? 'https://app.techmigo.co.uk' 
                        : 'http://localhost:3004'}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-[#f59e0b] text-[#f59e0b] rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>{user.name}</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 border border-[#f59e0b] text-[#f59e0b] rounded-lg text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
