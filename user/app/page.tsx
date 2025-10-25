"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  BookOpen,
  FolderKanban,
  FileText,
  Users,
  TrendingUp,
  MessageSquare,
  Bell,
  Settings,
  Crown,
  Play,
  Award,
  Calendar,
  ShoppingBag,
  Gift,
  Sparkles,
  Lock,
  Check,
  X,
  Search,
  Sun,
  Moon,
  LifeBuoy,
  Clock,
  ChevronDown,
  ChevronRight,
  Video,
  Download,
  Edit,
  Share2,
  Star,
  Trophy,
  Target,
  Briefcase,
  Send,
  Plus,
  Filter,
  User,
  Copy,
  ExternalLink,
  CreditCard,
  History,
  Shield,
  MessageCircle,
  ThumbsUp,
  Eye,
  Code,
  BookMarked,
  Archive,
  CheckCircle,
  Info,
  Loader2,
  Upload,
  CalendarIcon,
  Percent,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface IUserStats {
  userName: string
  userAvatarUrl: string
  subscriptionTier: "Free" | "Pro"
  coursesCompleted: number
  learningHours: number
  skillsMastered: number
  weeklyData: number[]
}

interface ICourse {
  courseId: string
  title: string
  category: "Web Dev" | "Data Science" | "UX/UI"
  instructor: string
  status: "enrolled" | "preview" | "completed" | "locked"
  progressPercentage: number
  hasCertificate: boolean
  imageUrl: string
  lessonsLeft?: number
}

interface ILesson {
  lessonId: string
  title: string
  videoUrl: string
  description: string
  codeSnippets: string[]
  isProContent: boolean
  downloadFiles: IFileLink[]
  duration: string
  isCompleted: boolean
}

interface IFileLink {
  fileName: string
  fileType: "python" | "txt" | "pdf" | "js"
  url: string
}

interface IQuizQuestion {
  questionId: string
  text: string
  type: "multiple-choice" | "true-false"
  options: string[]
  correctAnswerIndex: number
}

interface IProject {
  projectId: string
  title: string
  courseId: string
  dueDate: Date
  status: "In Progress" | "Submitted" | "Reviewed"
  progressPercentage: number
  thumbnailUrl: string
  techStack: string[]
}

interface ICertificate {
  certificateId: string
  courseTitle: string
  completionDate: Date
  isProVerified: boolean
}

interface INotification {
  id: string
  type: "System" | "Mentoring" | "Community" | "Feedback"
  summary: string
  timestamp: Date
  isRead: boolean
  isProExclusive: boolean
}

interface IMessage {
  id: string
  sender: "user" | "ai" | "mentor"
  content: string
  timestamp: Date
  contentType: "text" | "code"
}

interface ISession {
  sessionId: string
  title: string
  instructor: string
  dateTime: Date
  durationMinutes: number
  isProExclusive: boolean
  isCohortEvent: boolean
}

interface IRankEntry {
  rank: number
  userId: string
  userName: string
  score: number
  metricType: string
  userLocation: string
  excellingCourse: string
  isProUser: boolean
}

interface IProduct {
  productId: string
  title: string
  type: string
  imageUrl: string
  description: string
  standardPrice: number
  proDiscountPercent: number
}

interface IReferral {
  referralId: string
  referralCodeUsed: string
  referralName: string
  status: "Clicked" | "SignedUp" | "ConvertedToPro"
  conversionDate: Date | null
  isProConversion: boolean
}

interface ITransaction {
  id: string
  date: Date
  description: string
  amount: number
  type: "Subscription" | "Marketplace"
  status: "Paid" | "Failed"
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUserStats: IUserStats = {
  userName: "User",
  userAvatarUrl: "",
  subscriptionTier: "Free",
  coursesCompleted: 3,
  learningHours: 47,
  skillsMastered: 12,
  weeklyData: [2, 3, 5, 4, 6, 3, 7],
}

const mockCourses: ICourse[] = [
  {
    courseId: "1",
    title: "Full Stack Web Development",
    category: "Web Dev",
    instructor: "Sarah Johnson",
    status: "enrolled",
    progressPercentage: 65,
    hasCertificate: true,
    imageUrl: "/web-development-course.png",
    lessonsLeft: 12,
  },
  {
    courseId: "2",
    title: "Data Science with Python",
    category: "Data Science",
    instructor: "Michael Chen",
    status: "preview",
    progressPercentage: 0,
    hasCertificate: true,
    imageUrl: "/data-science-python.png",
  },
  {
    courseId: "3",
    title: "UX/UI Design Masterclass",
    category: "UX/UI",
    instructor: "Emma Williams",
    status: "locked",
    progressPercentage: 0,
    hasCertificate: true,
    imageUrl: "/ux-ui-design-concept.png",
  },
  {
    courseId: "4",
    title: "Advanced React Patterns",
    category: "Web Dev",
    instructor: "David Park",
    status: "completed",
    progressPercentage: 100,
    hasCertificate: true,
    imageUrl: "/react-advanced.jpg",
  },
]

const mockLessons: ILesson[] = [
  {
    lessonId: "1",
    title: "Introduction to React Hooks",
    videoUrl: "https://example.com/video1.mp4",
    description: "Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks.",
    codeSnippets: ["const [count, setCount] = useState(0);", 'useEffect(() => { console.log("mounted"); }, []);'],
    isProContent: false,
    downloadFiles: [
      { fileName: "hooks-cheatsheet.pdf", fileType: "pdf", url: "#" },
      { fileName: "example-code.js", fileType: "js", url: "#" },
    ],
    duration: "24:35",
    isCompleted: true,
  },
  {
    lessonId: "2",
    title: "Advanced State Management",
    videoUrl: "https://example.com/video2.mp4",
    description: "Deep dive into complex state management patterns with useReducer and Context API.",
    codeSnippets: ["const [state, dispatch] = useReducer(reducer, initialState);"],
    isProContent: true,
    downloadFiles: [{ fileName: "state-management.py", fileType: "python", url: "#" }],
    duration: "32:18",
    isCompleted: false,
  },
]

const mockQuizQuestions: IQuizQuestion[] = [
  {
    questionId: "1",
    text: "What is the primary purpose of the useState hook in React?",
    type: "multiple-choice",
    options: [
      "To manage component lifecycle",
      "To manage component state",
      "To handle side effects",
      "To optimize performance",
    ],
    correctAnswerIndex: 1,
  },
  {
    questionId: "2",
    text: "useEffect runs after every render by default.",
    type: "true-false",
    options: ["True", "False"],
    correctAnswerIndex: 0,
  },
  {
    questionId: "3",
    text: "Which hook would you use for expensive computations?",
    type: "multiple-choice",
    options: ["useState", "useEffect", "useMemo", "useCallback"],
    correctAnswerIndex: 2,
  },
]

const mockProjects: IProject[] = [
  {
    projectId: "1",
    title: "E-commerce Dashboard",
    courseId: "1",
    dueDate: new Date("2025-11-15"),
    status: "In Progress",
    progressPercentage: 45,
    thumbnailUrl: "/ecommerce-dashboard.png",
    techStack: ["React", "Node.js", "MongoDB"],
  },
  {
    projectId: "2",
    title: "Data Visualization App",
    courseId: "2",
    dueDate: new Date("2025-10-30"),
    status: "Submitted",
    progressPercentage: 100,
    thumbnailUrl: "/data-visualization-abstract.png",
    techStack: ["Python", "Pandas", "Matplotlib"],
  },
]

const mockCertificates: ICertificate[] = [
  {
    certificateId: "1",
    courseTitle: "Advanced React Patterns",
    completionDate: new Date("2025-09-15"),
    isProVerified: false,
  },
]

const mockNotifications: INotification[] = [
  {
    id: "1",
    type: "System",
    summary: 'New course "Machine Learning Basics" is now available!',
    timestamp: new Date("2025-10-18T10:30:00"),
    isRead: false,
    isProExclusive: false,
  },
  {
    id: "2",
    type: "Mentoring",
    summary: "Your mentor has reviewed your project submission",
    timestamp: new Date("2025-10-17T14:20:00"),
    isRead: false,
    isProExclusive: true,
  },
  {
    id: "3",
    type: "Community",
    summary: "John Doe replied to your discussion post",
    timestamp: new Date("2025-10-16T09:15:00"),
    isRead: true,
    isProExclusive: false,
  },
  {
    id: "4",
    type: "Feedback",
    summary: 'Project feedback available for "E-commerce Dashboard"',
    timestamp: new Date("2025-10-15T16:45:00"),
    isRead: true,
    isProExclusive: true,
  },
]

const mockSessions: ISession[] = [
  {
    sessionId: "1",
    title: "Live Q&A: React Best Practices",
    instructor: "Sarah Johnson",
    dateTime: new Date("2025-10-25T18:00:00"),
    durationMinutes: 60,
    isProExclusive: true,
    isCohortEvent: false,
  },
  {
    sessionId: "2",
    title: "Cohort Kickoff: Data Science Bootcamp",
    instructor: "Michael Chen",
    dateTime: new Date("2025-11-01T10:00:00"),
    durationMinutes: 90,
    isProExclusive: true,
    isCohortEvent: true,
  },
]

const mockLeaderboard: IRankEntry[] = [
  {
    rank: 1,
    userId: "101",
    userName: "Alex Thompson",
    score: 2847,
    metricType: "Hours Logged",
    userLocation: "Nigeria",
    excellingCourse: "Full Stack Web Development",
    isProUser: true,
  },
  {
    rank: 2,
    userId: "102",
    userName: "Priya Sharma",
    score: 2654,
    metricType: "Hours Logged",
    userLocation: "India",
    excellingCourse: "Data Science with Python",
    isProUser: true,
  },
  {
    rank: 3,
    userId: "103",
    userName: "Carlos Rodriguez",
    score: 2431,
    metricType: "Hours Logged",
    userLocation: "Mexico",
    excellingCourse: "UX/UI Design Masterclass",
    isProUser: false,
  },
]

const mockProducts: IProduct[] = [
  {
    productId: "1",
    title: "Premium Project Templates Pack",
    type: "Templates",
    imageUrl: "/project-templates.jpg",
    description: "50+ production-ready project templates",
    standardPrice: 49.99,
    proDiscountPercent: 20,
  },
  {
    productId: "2",
    title: "Complete Interview Prep Guide",
    type: "Guides",
    imageUrl: "/interview-guide.jpg",
    description: "Comprehensive guide with 200+ questions",
    standardPrice: 29.99,
    proDiscountPercent: 20,
  },
]

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function UserDashboard() {
  const router = useRouter()
  const [activeScreen, setActiveScreen] = useState<string>("dashboard")
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [userStats, setUserStats] = useState<IUserStats>(mockUserStats)
  const [courses, setCourses] = useState<ICourse[]>([])
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [certificates, setCertificates] = useState<ICertificate[]>([])
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    courses: false,
    community: false,
    career: false,
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState({
    courses: true,
    notifications: true,
    certificates: true,
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileComplete, setProfileComplete] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Check authentication on mount - redirect to login if not authenticated
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Check URL parameters for token (from login redirect)
    const urlParams = new URLSearchParams(window.location.search)
    const tokenParam = urlParams.get('token')
    
    // If token in URL, we're being redirected from login - allow access
    if (tokenParam) {
      console.log("✅ Token found in URL - allowing access")
      return
    }
    
    // Otherwise, check if already logged in
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    
    console.log("🔍 Auth check:", { hasToken: !!token, hasUser: !!user })
    
    // If no token or user, redirect to login page
    if (!token || !user) {
      console.log("❌ No authentication found - redirecting to login")
      
      // Use production URL in production, localhost in development
      const loginUrl = process.env.NODE_ENV === 'production' 
        ? 'https://techmigo.co.uk/login'
        : 'http://localhost:3000/login'
      
      window.location.href = loginUrl
      return
    }
    
    console.log("✅ Authentication found - staying on dashboard")
  }, [])

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load user data from localStorage on component mount
  useEffect(() => {
    // Make sure we're in the browser
    if (typeof window === 'undefined') return

    const loadUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")

        if (storedUser && storedToken) {
          // User already in localStorage, use it
          try {
            const userData = JSON.parse(storedUser)
            setCurrentUser(userData)
            setUserStats({
              ...mockUserStats,
              userName: userData.name || mockUserStats.userName,
              userAvatarUrl: userData.avatar || mockUserStats.userAvatarUrl,
              subscriptionTier: (userData.role === 'pro' || userData.role === 'admin') ? 'Pro' : 'Free'
            })
            
            // Check if profile is complete
            const isComplete = !!(
              userData.name &&
              userData.avatar &&
              userData.phone &&
              userData.bio &&
              userData.country &&
              userData.city &&
              userData.dateOfBirth &&
              userData.learningGoal
            )
            
            setProfileComplete(isComplete)
            if (!isComplete) {
              setShowProfileModal(true)
            }
            
            setIsLoading(false)
          } catch (error) {
            console.error("Error loading user data:", error)
            setIsLoading(false)
          }
        } else {
          // Check URL parameters for token (login redirect)
          const urlParams = new URLSearchParams(window.location.search)
          const tokenParam = urlParams.get('token')
          
          console.log("🔍 URL Parameters:", { hasToken: !!tokenParam })
          
          if (tokenParam) {
            try {
              console.log("� Fetching user data from API with token...")
              
              // Fetch user data from API using the token
              const response = await fetch((process.env.NODE_ENV === 'production' ? 'https://techmigo.co.uk' : 'http://localhost:3000') + '/api/auth/me', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${tokenParam}`,
                  'Content-Type': 'application/json'
                }
              })

              if (!response.ok) {
                throw new Error('Failed to fetch user data')
              }

              const data = await response.json()
              const userData = data.user
              
              console.log("✅ User data fetched successfully:", userData.name, userData.email)
              
              // Save to localStorage
              localStorage.setItem("user", JSON.stringify(userData))
              localStorage.setItem("token", tokenParam)
              
              setCurrentUser(userData)
              
              // Update state
              setUserStats({
                ...mockUserStats,
                userName: userData.name || mockUserStats.userName,
                userAvatarUrl: userData.avatar || mockUserStats.userAvatarUrl,
                subscriptionTier: (userData.role === 'pro' || userData.role === 'admin') ? 'Pro' : 'Free'
              })
              
              // Check if profile is complete
              const isComplete = !!(
                userData.name &&
                userData.avatar &&
                userData.phone &&
                userData.bio &&
                userData.country &&
                userData.city &&
                userData.dateOfBirth &&
                userData.learningGoal
              )
              
              setProfileComplete(isComplete)
              if (!isComplete) {
                setShowProfileModal(true)
              }
              
              console.log("✅ User data loaded from API and saved to localStorage")
              
              // Clean up URL
              window.history.replaceState({}, '', window.location.pathname)
            } catch (error) {
              console.error("❌ Error fetching user data from API:", error)
            }
          }
          
          setIsLoading(false)
        }
      } catch (error) {
        console.error("❌ Error in user data loading:", error)
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Fetch published courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setDataLoading(prev => ({ ...prev, courses: true }))
        const response = await fetch((process.env.NODE_ENV === 'production' ? 'https://techmigo.co.uk' : 'http://localhost:3000') + '/api/courses')
        const data = await response.json()
        
        if (data.success && data.courses) {
          const mappedCourses: ICourse[] = data.courses.map((apiCourse: any) => ({
            courseId: apiCourse._id || apiCourse.id,
            title: apiCourse.title,
            category: apiCourse.category as any,
            instructor: typeof apiCourse.instructor === 'string' ? apiCourse.instructor : apiCourse.instructor?.name || 'Unknown',
            status: 'preview' as const,
            progressPercentage: 0,
            hasCertificate: true,
            imageUrl: apiCourse.thumbnail || apiCourse.thumbnailUrl || '/placeholder.svg',
            lessonsLeft: apiCourse.lessons || 0,
          }))
          setCourses(mappedCourses)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
        setCourses(mockCourses) // Fallback to mock data
      } finally {
        setDataLoading(prev => ({ ...prev, courses: false }))
      }
    }

    fetchCourses()
  }, [])

  // Fetch user notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setNotifications(mockNotifications)
          setDataLoading(prev => ({ ...prev, notifications: false }))
          return
        }

        setDataLoading(prev => ({ ...prev, notifications: true }))
        const response = await fetch((process.env.NODE_ENV === 'production' ? 'https://techmigo.co.uk' : 'http://localhost:3000') + '/api/notifications?limit=20', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        if (data.notifications) {
          const mappedNotifications: INotification[] = data.notifications.map((notif: any) => ({
            id: notif._id,
            type: notif.type === 'achievement' ? 'Feedback' : 
                  notif.type === 'course' ? 'System' :
                  notif.type === 'success' ? 'Feedback' : 'System',
            summary: notif.message,
            timestamp: new Date(notif.createdAt),
            isRead: notif.isRead,
            isProExclusive: notif.type === 'achievement',
          }))
          setNotifications(mappedNotifications)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setNotifications(mockNotifications)
      } finally {
        setDataLoading(prev => ({ ...prev, notifications: false }))
      }
    }

    fetchNotifications()
  }, [])

  // Fetch user certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setCertificates(mockCertificates)
          setDataLoading(prev => ({ ...prev, certificates: false }))
          return
        }

        setDataLoading(prev => ({ ...prev, certificates: true }))
        const response = await fetch((process.env.NODE_ENV === 'production' ? 'https://techmigo.co.uk' : 'http://localhost:3000') + '/api/certificates', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        if (data.certificates) {
          const mappedCertificates: ICertificate[] = data.certificates.map((cert: any) => ({
            certificateId: cert._id,
            courseTitle: cert.courseId?.title || 'Course',
            completionDate: new Date(cert.completionDate),
            isProVerified: cert.grade === 'A' || cert.grade === 'A+',
          }))
          setCertificates(mappedCertificates)
        }
      } catch (error) {
        console.error('Error fetching certificates:', error)
        setCertificates(mockCertificates)
      } finally {
        setDataLoading(prev => ({ ...prev, certificates: false }))
      }
    }

    fetchCertificates()
  }, [])

  // Check if profile is complete before allowing actions
  const checkProfileComplete = (actionName: string = 'this action') => {
    if (!profileComplete) {
      alert(`Please complete your profile to ${actionName}`)
      setShowProfileModal(true)
      return false
    }
    return true
  }

  // Handle subscription upgrade
  const handleSubscribe = async (planName: string, priceId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to subscribe')
        return
      }

      const response = await fetch((process.env.NODE_ENV === 'production' ? 'https://techmigo.co.uk' : 'http://localhost:3000') + '/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session. Please try again.')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    
    // Redirect to login page - use production URL in production
    const loginUrl = process.env.NODE_ENV === 'production' 
      ? 'https://techmigo.co.uk/login'
      : 'http://localhost:3000/login'
    
    window.location.href = loginUrl
  }

  const isPro = userStats.subscriptionTier === "Pro"

  // ============================================================================
  // SIDEBAR COMPONENT
  // ============================================================================

  const Sidebar = () => (
    <div className={`
      ${isMobile 
        ? `fixed inset-0 z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
        : 'fixed left-0 top-0 h-screen w-72 z-50'
      }
      bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 overflow-y-auto
    `}>
      {/* Mobile close overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="absolute inset-0 bg-black/50 -z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div className={`${isMobile ? 'w-72' : 'w-full'} h-full bg-gray-900`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">
            TECH<span className="text-amber-500">MIGO</span>
          </h1>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white"
            >
              <X size={24} />
            </Button>
          )}
        </div>

        {/* User Profile Panel */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="w-28 h-28 border-4 border-amber-500">
              {userStats.userAvatarUrl ? (
                <AvatarImage src={userStats.userAvatarUrl} />
              ) : null}
              <AvatarFallback className="bg-amber-500 text-gray-900 text-3xl font-bold">
                {userStats.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-bold text-white">{userStats.userName.split(" ")[0]}</p>
              <Badge className={isPro ? "bg-amber-600 text-gray-900" : "bg-gray-700 text-gray-300"}>
                {userStats.subscriptionTier}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <SidebarLink
            icon={<Home size={20} />}
            label="Dashboard"
            active={activeScreen === "dashboard"}
            onClick={() => {
              setActiveScreen("dashboard")
              if (isMobile) setIsMobileMenuOpen(false)
            }}
          />

          {/* My Courses Expandable */}
          <div>
            <SidebarLink
              icon={<BookOpen size={20} />}
              label="My Courses"
              active={activeScreen === "courses"}
              onClick={() => toggleSection("courses")}
              expandable
              expanded={expandedSections.courses}
            />
            {expandedSections.courses && (
              <div className="ml-8 mt-1 space-y-1">
                <SidebarLink
                  icon={<Play size={16} />}
                  label="Courses"
                  active={activeScreen === "courses"}
                  onClick={() => {
                    setActiveScreen("courses")
                    if (isMobile) setIsMobileMenuOpen(false)
                  }}
                  small
                />
                <SidebarLink
                  icon={<FolderKanban size={16} />}
                  label="Projects"
                  active={activeScreen === "projects"}
                  onClick={() => {
                    setActiveScreen("projects")
                    if (isMobile) setIsMobileMenuOpen(false)
                  }}
                  small
                />
                <SidebarLink
                  icon={<Award size={16} />}
                  label="Portfolio"
                  active={activeScreen === "portfolio"}
                  onClick={() => {
                    setActiveScreen("portfolio")
                    if (isMobile) setIsMobileMenuOpen(false)
                  }}
                  small
                />
              </div>
            )}
          </div>

          <SidebarLink
            icon={<FileText size={20} />}
          label="Notes Vault"
          active={activeScreen === "notes"}
          onClick={() => {
            setActiveScreen("notes")
            if (isMobile) setIsMobileMenuOpen(false)
          }}
        />

        {/* Community Expandable */}
        <div>
          <SidebarLink
            icon={<Users size={20} />}
            label="Community"
            active={activeScreen === "community"}
            onClick={() => toggleSection("community")}
            expandable
            expanded={expandedSections.community}
          />
          {expandedSections.community && (
            <div className="ml-8 mt-1 space-y-1">
              <SidebarLink
                icon={<MessageSquare size={16} />}
                label="Discussions"
                active={activeScreen === "community"}
                onClick={() => {
                  setActiveScreen("community")
                  if (isMobile) setIsMobileMenuOpen(false)
                }}
                small
              />
              <SidebarLink
                icon={<Trophy size={16} />}
                label="Leaderboard"
                active={activeScreen === "leaderboard"}
                onClick={() => {
                  setActiveScreen("leaderboard")
                  if (isMobile) setIsMobileMenuOpen(false)
                }}
                small
              />
            </div>
          )}
        </div>

        {/* Career & Growth Expandable */}
        <div>
          <SidebarLink
            icon={<TrendingUp size={20} />}
            label="Career & Growth"
            active={activeScreen === "career"}
            onClick={() => toggleSection("career")}
            expandable
            expanded={expandedSections.career}
          />
          {expandedSections.career && (
            <div className="ml-8 mt-1 space-y-1">
              <SidebarLink
                icon={<Target size={16} />}
                label="Career Tools"
                active={activeScreen === "career"}
                onClick={() => {
                  setActiveScreen("career")
                  if (isMobile) setIsMobileMenuOpen(false)
                }}
                small
              />
              <SidebarLink
                icon={<Briefcase size={16} />}
                label="Mentor Connect"
                active={activeScreen === "mentor"}
                onClick={() => {
                  setActiveScreen("mentor")
                  if (isMobile) setIsMobileMenuOpen(false)
                }}
                small
              />
              <SidebarLink
                icon={<ShoppingBag size={16} />}
                label="Marketplace"
                active={activeScreen === "marketplace"}
                onClick={() => {
                  setActiveScreen("marketplace")
                  if (isMobile) setIsMobileMenuOpen(false)
                }}
                small
              />
            </div>
          )}
        </div>

        <SidebarLink
          icon={<Sparkles size={20} />}
          label="AI Assistant"
          active={activeScreen === "ai-assistant"}
          onClick={() => {
            setActiveScreen("ai-assistant")
            if (isMobile) setIsMobileMenuOpen(false)
          }}
        />

        <SidebarLink
          icon={<Calendar size={20} />}
          label="Live Sessions"
          active={activeScreen === "live-sessions"}
          onClick={() => {
            setActiveScreen("live-sessions")
            if (isMobile) setIsMobileMenuOpen(false)
          }}
        />

        <SidebarLink
          icon={<Bell size={20} />}
          label="Notifications"
          active={activeScreen === "notifications"}
          onClick={() => {
            setActiveScreen("notifications")
            if (isMobile) setIsMobileMenuOpen(false)
          }}
          badge={notifications.filter((n) => !n.isRead).length}
        />

        <SidebarLink
          icon={<Gift size={20} />}
          label="Referrals"
          active={activeScreen === "referrals"}
          onClick={() => {
            setActiveScreen("referrals")
            if (isMobile) setIsMobileMenuOpen(false)
          }}
        />

        <SidebarLink
          icon={<Settings size={20} />}
          label="Settings"
          active={activeScreen === "settings"}
          onClick={() => {
            setActiveScreen("settings")
            if (isMobile) setIsMobileMenuOpen(false)
          }}
        />

        {/* Logout Button */}
        <div className="pt-2 border-t border-gray-700">
          <SidebarLink
            icon={<LogOut size={20} />}
            label="Log Out"
            active={false}
            onClick={handleLogout}
          />
        </div>

        {/* Upgrade CTA */}
        {!isPro && (
          <div className="pt-4">
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-bold shadow-lg shadow-amber-500/50"
              onClick={() => {
                setActiveScreen("settings")
                if (isMobile) setIsMobileMenuOpen(false)
              }}
            >
              <Crown className="mr-2" size={18} />
              Upgrade to Pro
            </Button>
          </div>
        )}
      </nav>
      </div>
    </div>
  )

  // ============================================================================
  // SIDEBAR LINK COMPONENT
  // ============================================================================

  interface SidebarLinkProps {
    icon: React.ReactNode
    label: string
    active: boolean
    onClick: () => void
    expandable?: boolean
    expanded?: boolean
    small?: boolean
    badge?: number
  }

  const SidebarLink: React.FC<SidebarLinkProps> = ({
    icon,
    label,
    active,
    onClick,
    expandable,
    expanded,
    small,
    badge,
  }) => (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all
        ${small ? "py-2 text-sm" : ""}
        ${
          active
            ? "bg-amber-500 text-gray-900 font-semibold shadow-lg shadow-amber-500/30"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }
      `}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        {badge && badge > 0 && <Badge className="bg-amber-500 text-gray-900 text-xs">{badge}</Badge>}
        {expandable && (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </div>
    </button>
  )

  // ============================================================================
  // TOP BAR COMPONENT
  // ============================================================================

  const TopBar = () => (
    <div className="fixed top-0 left-72 right-0 h-16 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search courses, projects, or resources..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Time Spent Today */}
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock size={18} />
            <span className="text-sm">35 min today</span>
          </div>

          {/* Help */}
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <LifeBuoy size={20} />
          </Button>

          {/* Dark/Light Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white relative"
            onClick={() => setActiveScreen("notifications")}
          >
            <Bell size={20} />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
            )}
          </Button>

          {/* Upgrade CTA (Free users only) */}
          {!isPro && (
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
              onClick={() => setActiveScreen("settings")}
            >
              <Crown className="mr-2" size={16} />
              Upgrade Now
            </Button>
          )}

          {/* User Avatar Dropdown */}
          <Avatar className="w-10 h-10 border-2 border-gray-700 hover:border-amber-500 transition-colors cursor-pointer">
            {userStats.userAvatarUrl ? (
              <AvatarImage src={userStats.userAvatarUrl} />
            ) : null}
            <AvatarFallback className="bg-amber-500 text-gray-900 text-sm font-bold">
              {userStats.userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )

  // ============================================================================
  // SCREEN COMPONENTS
  // ============================================================================

  // Screen #1: Dashboard Home
  const DashboardHome = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, {userStats.userName.split(" ")[0]}! 👋
              </h2>
              <p className="text-gray-400">Ready to continue your learning journey?</p>
            </div>
            {!isPro && (
              <Button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-bold shadow-lg shadow-amber-500/50"
                onClick={() => setActiveScreen("settings")}
              >
                <Crown className="mr-2" size={18} />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(userStats.coursesCompleted / 10) * 351.86} 351.86`}
                    className="text-amber-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{userStats.coursesCompleted}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Courses Completed</p>
                <p className="text-xs text-gray-500">Out of 10 enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(userStats.learningHours / 100) * 351.86} 351.86`}
                    className="text-amber-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{userStats.learningHours}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Learning Hours</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(userStats.skillsMastered / 20) * 351.86} 351.86`}
                    className="text-amber-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{userStats.skillsMastered}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Skills Mastered</p>
                <p className="text-xs text-gray-500">Verified by quizzes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataLoading.courses ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
              </div>
            ) : courses.length > 0 ? (
              <>
                <div className="flex items-center space-x-4">
                  <img
                    src={courses[0].imageUrl || "/placeholder.svg"}
                    alt={courses[0].title}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{courses[0].title}</h4>
                    <p className="text-sm text-gray-400">Start learning today</p>
                    <Progress value={courses[0].progressPercentage || 0} className="mt-2 h-2" />
                  </div>
                </div>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold">
                  <Play className="mr-2" size={16} />
                  Start Course
                </Button>
              </>
            ) : (
              <p className="text-gray-400 text-center py-4">No courses available yet</p>
            )}
          </CardContent>
        </Card>

        {/* Analytics Widget */}
        <Card className="bg-gray-800 border-gray-700 relative">
          <CardHeader>
            <CardTitle className="text-white">Weekly Learning Streak</CardTitle>
            <CardDescription>Your activity this week</CardDescription>
          </CardHeader>
          <CardContent>
            {!isPro && (
              <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                <div className="text-center p-6">
                  <Lock className="mx-auto mb-3 text-amber-500" size={32} />
                  <p className="text-white font-semibold mb-2">Full Analytics - Pro Only</p>
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                    onClick={() => setActiveScreen("settings")}
                  >
                    Unlock Now
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-end justify-between h-40 space-x-2">
              {userStats.weeklyData.map((hours, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-amber-500 rounded-t" style={{ height: `${(hours / 7) * 100}%` }}></div>
                  <span className="text-xs text-gray-400 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Feed Preview & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Feed */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Community Highlights</CardTitle>
            <CardDescription>Latest discussions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-white">How to optimize React performance?</p>
                  <p className="text-xs text-gray-400">2 hours ago • 5 replies</p>
                </div>
                {!isPro && <Lock className="text-amber-500" size={16} />}
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-700 bg-transparent"
              onClick={() => setActiveScreen("community")}
            >
              View All Discussions
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Deadlines</CardTitle>
            <CardDescription>Stay on track</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockProjects.map((project) => (
              <div key={project.projectId} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="text-amber-500" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-white">{project.title}</p>
                    <p className="text-xs text-gray-400">Due: {project.dueDate.toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className={project.status === "Submitted" ? "bg-green-600" : "bg-amber-600"}>
                  {project.status}
                </Badge>
              </div>
            ))}
            {mockSessions.slice(0, 1).map((session) => (
              <div key={session.sessionId} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Video className="text-amber-500" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-white">{session.title}</p>
                    <p className="text-xs text-gray-400">
                      {session.dateTime.toLocaleDateString()} at {session.dateTime.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {session.isProExclusive && <Badge className="bg-amber-600 text-gray-900">Pro</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Screen #2: My Courses
  const MyCourses = () => {
    const [filter, setFilter] = useState<string>("all")

    const filteredCourses = courses.filter((course) => {
      if (filter === "all") return true
      return course.status === filter
    })

    if (dataLoading.courses) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <span className="ml-2 text-gray-400">Loading courses...</span>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">My Courses</h2>
            <p className="text-gray-400">Manage your learning journey</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => setFilter("all")}
          >
            All Courses
          </Button>
          <Button
            variant={filter === "enrolled" ? "default" : "outline"}
            className={filter === "enrolled" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => setFilter("enrolled")}
          >
            In Progress
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            className={filter === "completed" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
          <Button
            variant={filter === "preview" ? "default" : "outline"}
            className={filter === "preview" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => setFilter("preview")}
          >
            Preview Available
          </Button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.courseId}
              className="bg-gray-800 border-gray-700 overflow-hidden hover:border-amber-500 transition-colors"
            >
              <div className="relative">
                <img
                  src={course.imageUrl || "/placeholder.svg"}
                  alt={course.title}
                  className={`w-full h-40 object-cover ${course.status === "locked" ? "blur-sm" : ""}`}
                />
                {course.status === "locked" && (
                  <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                    <Lock className="text-amber-500" size={32} />
                  </div>
                )}
                {course.status === "completed" && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600">
                      <Check className="mr-1" size={12} />
                      Completed
                    </Badge>
                  </div>
                )}
                {course.status === "preview" && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-600">Free Preview</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <Badge className="bg-gray-700 text-gray-300 mb-2">{course.category}</Badge>
                  <h3 className="font-bold text-white">{course.title}</h3>
                  <p className="text-sm text-gray-400">by {course.instructor}</p>
                </div>

                {course.status === "enrolled" && (
                  <>
                    <Progress value={course.progressPercentage} className="h-2" />
                    <p className="text-xs text-gray-400">
                      {course.progressPercentage}% complete • {course.lessonsLeft} lessons left
                    </p>
                    <Button
                      className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                      onClick={() => {
                        if (!checkProfileComplete('continue learning')) return
                        setActiveScreen("course-player")
                      }}
                    >
                      Continue Learning
                    </Button>
                  </>
                )}

                {course.status === "preview" && (
                  <Button
                    className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                    onClick={() => {
                      if (!checkProfileComplete('enroll in this course')) return
                      setActiveScreen("settings")
                    }}
                  >
                    <Crown className="mr-2" size={16} />
                    Upgrade to Unlock
                  </Button>
                )}

                {course.status === "locked" && (
                  <Button
                    className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                    onClick={() => setActiveScreen("settings")}
                  >
                    <Lock className="mr-2" size={16} />
                    Upgrade to Unlock Full Catalog
                  </Button>
                )}

                {course.status === "completed" && (
                  <Button
                    className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-gray-900 bg-transparent"
                    variant="outline"
                    onClick={() => setActiveScreen("portfolio")}
                  >
                    <Award className="mr-2" size={16} />
                    View Certificate
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Screen #3: Course Player
  const CoursePlayer = () => {
    const [activeTab, setActiveTab] = useState<"lessons" | "notes" | "discussion">("lessons")
    const currentLesson = mockLessons[0]

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video & Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="relative bg-black aspect-video flex items-center justify-center">
                <Play className="text-amber-500" size={64} />
                <div className="absolute bottom-4 left-4 right-4">
                  <Progress value={35} className="h-1" />
                </div>
                {!isPro && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gray-900/80 text-amber-500">720p • Upgrade for HD</Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Lesson Content */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{currentLesson.title}</CardTitle>
                <CardDescription>{currentLesson.duration} • Instructor: Sarah Johnson</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">{currentLesson.description}</p>

                {/* Code Snippets */}
                {currentLesson.codeSnippets.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Code Examples:</h4>
                    {currentLesson.codeSnippets.map((snippet, index) => (
                      <pre key={index} className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                        <code className="text-amber-500 text-sm">{snippet}</code>
                      </pre>
                    ))}
                  </div>
                )}

                {/* Downloadable Files */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Resources:</h4>
                  {currentLesson.downloadFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="text-amber-500" size={20} />
                        <span className="text-gray-300">{file.fileName}</span>
                      </div>
                      {isPro ? (
                        <Button size="sm" variant="outline" className="border-amber-500 text-amber-500 bg-transparent">
                          <Download className="mr-2" size={14} />
                          Download
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                          onClick={() => setActiveScreen("settings")}
                        >
                          <Lock className="mr-2" size={14} />
                          Unlock Downloads
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="w-full bg-gray-900">
                  <TabsTrigger value="lessons" className="flex-1">
                    Lessons
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex-1">
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="discussion" className="flex-1">
                    Q&A
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="lessons" className="p-4 space-y-2">
                  {mockLessons.map((lesson, index) => (
                    <div
                      key={lesson.lessonId}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index === 0 ? "bg-amber-500 text-gray-900" : "bg-gray-900 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {lesson.isCompleted ? (
                            <CheckCircle className="text-green-500" size={16} />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-600"></div>
                          )}
                          <div>
                            <p className="text-sm font-semibold">{lesson.title}</p>
                            <p className="text-xs opacity-70">{lesson.duration}</p>
                          </div>
                        </div>
                        {lesson.isProContent && !isPro && <Lock size={14} />}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="notes" className="p-4">
                  <Textarea
                    placeholder="Take notes here..."
                    className="min-h-[300px] bg-gray-900 border-gray-700 text-white"
                  />
                  {!isPro && (
                    <div className="mt-3 p-3 bg-gray-900 rounded-lg text-center">
                      <p className="text-sm text-gray-400 mb-2">Note syncing is a Pro feature</p>
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                        onClick={() => setActiveScreen("settings")}
                      >
                        Upgrade to Sync
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="discussion" className="p-4 space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 bg-gray-900 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-white">How does this work with TypeScript?</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!isPro ? (
                    <Button
                      className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                      onClick={() => setActiveScreen("settings")}
                    >
                      <Lock className="mr-2" size={16} />
                      Upgrade to Ask Questions
                    </Button>
                  ) : (
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900">
                      <MessageSquare className="mr-2" size={16} />
                      Post Question
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold">
                <Check className="mr-2" size={16} />
                Mark Complete
              </Button>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={() => setActiveScreen("smart-quiz")}
              >
                Take Smart Quiz →
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Screen #4: Smart Quiz Page
  const SmartQuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
    const [quizComplete, setQuizComplete] = useState(false)
    const [score, setScore] = useState(0)

    const handleAnswer = (questionId: string, answerIndex: number) => {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex })
    }

    const handleSubmit = () => {
      let correctCount = 0
      mockQuizQuestions.forEach((q) => {
        if (selectedAnswers[q.questionId] === q.correctAnswerIndex) {
          correctCount++
        }
      })
      setScore((correctCount / mockQuizQuestions.length) * 100)
      setQuizComplete(true)
    }

    const isPassed = score === 100

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quiz Progress Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Question {currentQuestion + 1} of {mockQuizQuestions.length}
                </h3>
                <Badge className="bg-amber-500 text-gray-900">Knowledge Check</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Knowledge Bar</span>
                  <span>
                    {Object.keys(selectedAnswers).length} / {mockQuizQuestions.length}
                  </span>
                </div>
                <Progress
                  value={(Object.keys(selectedAnswers).length / mockQuizQuestions.length) * 100}
                  className="h-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {!quizComplete ? (
          <>
            {/* Question Display */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{mockQuizQuestions[currentQuestion].text}</h2>

                <div className="space-y-3">
                  {mockQuizQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(mockQuizQuestions[currentQuestion].questionId, index)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        selectedAnswers[mockQuizQuestions[currentQuestion].questionId] === index
                          ? "bg-amber-500 text-gray-900 font-semibold"
                          : "bg-gray-900 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 bg-transparent"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                Previous
              </Button>

              {currentQuestion < mockQuizQuestions.length - 1 ? (
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSubmit}
                  disabled={Object.keys(selectedAnswers).length !== mockQuizQuestions.length}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Gamified Feedback */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex justify-center">
                  {isPassed ? (
                    <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="text-white" size={48} />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center">
                      <X className="text-white" size={48} />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {isPassed ? "Spectacular! 🎉" : "Almost There! 💪"}
                  </h2>
                  <p className="text-xl text-gray-300">You scored {score}%</p>
                </div>

                <div className="p-6 bg-gray-900 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <Sparkles className="text-amber-500 flex-shrink-0" size={32} />
                    <div className="text-left">
                      <p className="font-semibold text-white mb-2">Amigo AI says:</p>
                      <p className="text-gray-300">
                        {isPassed
                          ? "Knowledge Unlocked! You've mastered this concept. Ready for the next challenge?"
                          : "Let's reboot that knowledge! Review the key concepts and try again. You've got this!"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 bg-transparent"
                    onClick={() => setActiveScreen("course-player")}
                  >
                    Review Lesson
                  </Button>
                  {isPassed ? (
                    <Button
                      className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                      onClick={() => setActiveScreen("course-player")}
                    >
                      Next Lesson →
                    </Button>
                  ) : (
                    <Button
                      className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                      onClick={() => {
                        setQuizComplete(false)
                        setSelectedAnswers({})
                        setCurrentQuestion(0)
                      }}
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    )
  }

  // Screen #5: Projects & Assignments
  const ProjectsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Projects & Assignments</h2>
          <p className="text-gray-400">Track your project submissions and feedback</p>
        </div>
        {!isPro && <Badge className="bg-amber-600 text-gray-900">1 of 3 Free Slots Used</Badge>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockProjects.map((project) => (
          <Card key={project.projectId} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} className="bg-gray-700 text-gray-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Due: {project.dueDate.toLocaleDateString()}</span>
                    <Badge
                      className={
                        project.status === "Reviewed"
                          ? "bg-green-600"
                          : project.status === "Submitted"
                            ? "bg-blue-600"
                            : "bg-amber-600"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <img
                  src={project.thumbnailUrl || "/placeholder.svg"}
                  alt={project.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              {project.status === "In Progress" && (
                <>
                  <Progress value={project.progressPercentage} className="h-2" />
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                    onClick={() => {
                      if (!checkProfileComplete('submit a project')) return
                      // Project submission logic here
                    }}
                  >
                    <Upload className="mr-2" size={16} />
                    Submit Project
                  </Button>
                </>
              )}

              {project.status === "Submitted" && (
                <div className="p-4 bg-gray-900 rounded-lg text-center">
                  <Loader2 className="mx-auto mb-2 text-amber-500 animate-spin" size={24} />
                  <p className="text-sm text-gray-400">Awaiting review...</p>
                </div>
              )}

              {project.status === "Reviewed" && (
                <div className="space-y-3">
                  {!isPro ? (
                    <div className="p-4 bg-gray-900 rounded-lg text-center">
                      <Lock className="mx-auto mb-2 text-amber-500" size={24} />
                      <p className="text-sm text-white font-semibold mb-2">Mentor Feedback is a Pro Feature</p>
                      <p className="text-xs text-gray-400 mb-3">You received an automated grade summary</p>
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                        onClick={() => setActiveScreen("settings")}
                      >
                        Upgrade to Get Expert Feedback
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-900/20 border border-green-600 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-white mb-1">Excellent Work!</p>
                          <p className="text-sm text-gray-300">
                            Your implementation is solid. Great use of React hooks and clean code structure.
                          </p>
                          <p className="text-xs text-gray-400 mt-2">Grade: 95/100 • Reviewed by Sarah Johnson</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Screen #6: Portfolio & Certificates
  const PortfolioPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Portfolio & Certificates</h2>
          <p className="text-gray-400">Showcase your achievements</p>
        </div>
        {isPro && (
          <Button className="bg-amber-500 hover:bg-amber-600 text-gray-900">
            <ExternalLink className="mr-2" size={16} />
            Generate Portfolio Site
          </Button>
        )}
      </div>

      {/* Certificates */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Certificates</h3>
        {dataLoading.certificates ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : certificates.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">No certificates earned yet. Complete courses to earn certificates!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert.certificateId}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-amber-500 border-2"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Award className="text-amber-500" size={32} />
                    <Badge className="bg-amber-600 text-gray-900">Verified</Badge>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{cert.courseTitle}</h4>
                    <p className="text-sm text-gray-400">Completed: {cert.completionDate.toLocaleDateString()}</p>
                  </div>
                <div className="flex items-center space-x-2">
                  {isPro ? (
                    <>
                      <Button size="sm" className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-900">
                        <Download className="mr-2" size={14} />
                        Download PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-amber-500 text-amber-500 bg-transparent"
                      >
                        <Linkedin className="mr-2" size={14} />
                        Share
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                      onClick={() => setActiveScreen("settings")}
                    >
                      <Lock className="mr-2" size={14} />
                      Upgrade to Certify
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </div>

      {/* Projects Showcase */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Completed Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockProjects
            .filter((p) => p.status === "Reviewed")
            .map((project) => (
              <Card key={project.projectId} className="bg-gray-800 border-gray-700 overflow-hidden">
                <img
                  src={project.thumbnailUrl || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h4 className="font-bold text-white mb-2">{project.title}</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} className="bg-gray-700 text-gray-300 text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Skill Badges */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Skill Proficiencies</h3>
        <Card className="bg-gray-800 border-gray-700 relative">
          <CardContent className="p-6">
            {!isPro && (
              <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                <div className="text-center p-6">
                  <Lock className="mx-auto mb-3 text-amber-500" size={32} />
                  <p className="text-white font-semibold mb-2">Public Skill Map - Pro Only</p>
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                    onClick={() => setActiveScreen("settings")}
                  >
                    Unlock Sharing
                  </Button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["React", "TypeScript", "Node.js", "Python", "UI/UX", "Data Analysis", "Git", "AWS"].map((skill) => (
                <div key={skill} className="text-center p-4 bg-gray-900 rounded-lg">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Star className="text-amber-500" size={24} />
                  </div>
                  <p className="text-sm font-semibold text-white">{skill}</p>
                  <p className="text-xs text-gray-400">Level 4/5</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Screen #7: Community Hub
  const CommunityHub = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Community Hub</h2>
          <p className="text-gray-400">Connect, learn, and grow together</p>
        </div>
        {isPro ? (
          <Button className="bg-amber-500 hover:bg-amber-600 text-gray-900">
            <Plus className="mr-2" size={16} />
            New Discussion
          </Button>
        ) : (
          <Button className="bg-amber-500 hover:bg-amber-600 text-gray-900" onClick={() => setActiveScreen("settings")}>
            <Lock className="mr-2" size={16} />
            Upgrade to Post
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <Card className="bg-gray-800 border-gray-700 h-fit">
          <CardHeader>
            <CardTitle className="text-white text-sm">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-amber-500 bg-gray-900">
              All Discussions
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300">
              My Courses
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300">
              Trending
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300"
              onClick={() => !isPro && setActiveScreen("settings")}
            >
              Mentor Q&A
              {!isPro && <Lock className="ml-auto" size={14} />}
            </Button>
          </CardContent>
        </Card>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-semibold text-white">User {i}</p>
                      <Badge className="bg-gray-700 text-gray-300 text-xs">Web Dev</Badge>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">How to optimize React component re-renders?</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      I'm working on a large dashboard and noticing performance issues...
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <button className="flex items-center space-x-1 hover:text-amber-500">
                        <ThumbsUp size={14} />
                        <span>12</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-amber-500">
                        <MessageCircle size={14} />
                        <span>5 replies</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-amber-500">
                        <Share2 size={14} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trending Topics */}
        <Card className="bg-gray-800 border-gray-700 h-fit">
          <CardHeader>
            <CardTitle className="text-white text-sm">Trending Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["React Performance", "TypeScript Tips", "Career Advice", "Project Ideas", "Interview Prep"].map(
              (topic) => (
                <div key={topic} className="p-2 bg-gray-900 rounded-lg">
                  <p className="text-sm text-white font-semibold">{topic}</p>
                  <p className="text-xs text-gray-400">24 discussions</p>
                </div>
              ),
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Screen #8: Career & Growth Tools
  const CareerTools = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Career & Growth Tools</h2>
        <p className="text-gray-400">Accelerate your career journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Visualizer */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Skill Gap Analysis</CardTitle>
            <CardDescription>Compare your skills to your target role</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {!isPro && (
              <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                <div className="text-center p-6">
                  <Lock className="mx-auto mb-3 text-amber-500" size={32} />
                  <p className="text-white font-semibold mb-2">Advanced Career Paths - Pro Only</p>
                  <p className="text-sm text-gray-400 mb-3">Free users limited to Junior Developer role</p>
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                    onClick={() => setActiveScreen("settings")}
                  >
                    Unlock Advanced Paths
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Target className="mx-auto mb-4 text-amber-500" size={48} />
                <p className="text-white font-semibold mb-2">Target Role: Senior Full Stack Developer</p>
                <p className="text-sm text-gray-400">Your current proficiency: 72%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Board Preview */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Job Opportunities</CardTitle>
            <CardDescription>Relevant positions for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Frontend Developer", company: "TechCorp", days: 2, verified: true },
              { title: "React Engineer", company: "StartupXYZ", days: 5, verified: true },
              { title: "Full Stack Developer", company: "BigTech Inc", days: 15, verified: false },
            ].map((job, i) => (
              <div key={i} className="p-3 bg-gray-900 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{job.title}</h4>
                    <p className="text-sm text-gray-400">{job.company}</p>
                  </div>
                  {job.verified && job.days < 7 && <Badge className="bg-green-600">New</Badge>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{job.days} days ago</span>
                  {job.verified && job.days < 7 ? (
                    isPro ? (
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-gray-900">
                        Apply Now
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                        onClick={() => setActiveScreen("settings")}
                      >
                        <Lock className="mr-1" size={12} />
                        Pro
                      </Button>
                    )
                  ) : (
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 bg-transparent">
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resume & Interview Tools */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Career Tools</CardTitle>
            <CardDescription>Prepare for success</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <FileText className="text-amber-500" size={24} />
                <div>
                  <h4 className="font-semibold text-white">Resume Builder</h4>
                  <p className="text-xs text-gray-400">AI-powered review</p>
                </div>
              </div>
              {isPro ? (
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900">Launch AI Review</Button>
              ) : (
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                  onClick={() => setActiveScreen("settings")}
                >
                  <Lock className="mr-2" size={14} />
                  Go Pro for AI Review
                </Button>
              )}
            </div>

            <div className="p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <MessageSquare className="text-amber-500" size={24} />
                <div>
                  <h4 className="font-semibold text-white">Interview Simulator</h4>
                  <p className="text-xs text-gray-400">{isPro ? "Unlimited practice" : "1 of 2 free sessions used"}</p>
                </div>
              </div>
              {isPro ? (
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900">Start Practice</Button>
              ) : (
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                  onClick={() => setActiveScreen("settings")}
                >
                  <Lock className="mr-2" size={14} />
                  Unlimited Practice (Pro)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Screen #9: Mentor Connect
  const MentorConnect = () => {
    if (!isPro) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="bg-gray-800 border-gray-700 max-w-md">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
                <Lock className="text-amber-500" size={48} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Unlock 1:1 Professional Guidance</h2>
                <p className="text-gray-400">
                  Connect with expert mentors for personalized career advice, code reviews, and professional growth.
                </p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-bold"
                onClick={() => setActiveScreen("settings")}
              >
                <Crown className="mr-2" size={18} />
                Upgrade to Connect with Your Mentor
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Mentor Connect</h2>
          <p className="text-gray-400">Your personal guide to success</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mentor Profile & Scheduling */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <Avatar className="w-24 h-24 border-4 border-amber-500">
                    <AvatarImage src="/professional-mentor.png" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">Sarah Johnson</h3>
                    <p className="text-gray-400 mb-3">Senior Software Engineer @ Google</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Python", "AWS", "Data Strategy", "System Design"].map((skill) => (
                        <Badge key={skill} className="bg-amber-600 text-gray-900">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-300">
                      10+ years of experience in full-stack development and cloud architecture. Passionate about helping
                      developers level up their careers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Schedule a Session</CardTitle>
                <CardDescription>5 sessions remaining this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {["Oct 25, 2PM", "Oct 26, 4PM", "Oct 27, 10AM", "Oct 28, 3PM", "Oct 29, 1PM", "Oct 30, 5PM"].map(
                    (slot) => (
                      <Button
                        key={slot}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-amber-500 hover:text-gray-900 hover:border-amber-500 bg-transparent"
                      >
                        {slot}
                      </Button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Private Chat */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Private Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 h-96 overflow-y-auto">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 p-3 bg-gray-900 rounded-lg">
                    <p className="text-sm text-white">Hi! I reviewed your project. Great work on the architecture!</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 flex-row-reverse">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 p-3 bg-amber-500 rounded-lg">
                    <p className="text-sm text-gray-900">
                      Thank you! I'd love to discuss the database design in our next session.
                    </p>
                    <p className="text-xs text-gray-700 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Input placeholder="Type a message..." className="bg-gray-900 border-gray-700 text-white" />
                <Button size="icon" className="bg-amber-500 hover:bg-amber-600 text-gray-900">
                  <Send size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Screen #10: Notes Vault
  const NotesVault = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Notes Vault</h2>
          <p className="text-gray-400">Your personal knowledge base</p>
          {!isPro && <p className="text-sm text-amber-500 mt-1">12 of 50 items saved</p>}
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-gray-900">
          <Plus className="mr-2" size={16} />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <Card className="bg-gray-800 border-gray-700 h-fit">
          <CardHeader>
            <CardTitle className="text-white text-sm">Filter by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-amber-500 bg-gray-900">
              <FileText className="mr-2" size={16} />
              All Items
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300">
              <Edit className="mr-2" size={16} />
              Notes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300"
              onClick={() => !isPro && setActiveScreen("settings")}
            >
              <Code className="mr-2" size={16} />
              Code Snippets
              {!isPro && <Lock className="ml-auto" size={14} />}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300">
              <Download className="mr-2" size={16} />
              Downloads
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300">
              <BookMarked className="mr-2" size={16} />
              Bookmarks
            </Button>
          </CardContent>
        </Card>

        {/* Content List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input placeholder="Search your vault..." className="pl-10 bg-gray-800 border-gray-700 text-white" />
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
              <Filter size={16} />
            </Button>
          </div>

          {[
            { title: "React Hooks Best Practices", type: "Note", course: "Full Stack Web Dev", date: "2 days ago" },
            { title: "Custom useAuth Hook", type: "Code Snippet", course: "Full Stack Web Dev", date: "5 days ago" },
            { title: "Project Setup Guide", type: "Download", course: "Data Science", date: "1 week ago" },
            {
              title: "Important: State Management",
              type: "Bookmark",
              course: "Full Stack Web Dev",
              date: "2 weeks ago",
            },
          ].map((item, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        className={
                          item.type === "Code Snippet"
                            ? "bg-amber-600 text-gray-900"
                            : item.type === "Note"
                              ? "bg-blue-600"
                              : item.type === "Download"
                                ? "bg-green-600"
                                : "bg-purple-600"
                        }
                      >
                        {item.type}
                      </Badge>
                      <Badge className="bg-gray-700 text-gray-300">{item.course}</Badge>
                    </div>
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.date}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                    <Eye size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {!isPro && (
            <Card className="bg-gray-800 border-amber-500 border-2">
              <CardContent className="p-6 text-center">
                <Archive className="mx-auto mb-3 text-amber-500" size={32} />
                <h4 className="font-semibold text-white mb-2">Approaching Storage Limit</h4>
                <p className="text-sm text-gray-400 mb-4">
                  You've used 12 of 50 free slots. Upgrade for unlimited storage and advanced features.
                </p>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                  onClick={() => setActiveScreen("settings")}
                >
                  Upgrade for Unlimited Vault Storage
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )

  // Screen #11: Notifications Center
  const NotificationsCenter = () => {
    const [filter, setFilter] = useState<string>("all")

    const filteredNotifications = notifications.filter((notif) => {
      if (filter === "all") return true
      if (filter === "system") return notif.type === "System"
      if (filter === "mentoring" || filter === "feedback") return notif.isProExclusive
      return false
    })

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Notifications</h2>
            <p className="text-gray-400">Stay updated on your learning journey</p>
          </div>
          <Button variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
            Mark All as Read
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "system" ? "default" : "outline"}
            className={filter === "system" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => setFilter("system")}
          >
            System
          </Button>
          <Button
            variant={filter === "mentoring" ? "default" : "outline"}
            className={filter === "mentoring" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => {
              if (!isPro) {
                setActiveScreen("settings")
              } else {
                setFilter("mentoring")
              }
            }}
          >
            Mentoring
            {!isPro && <Lock className="ml-2" size={14} />}
          </Button>
          <Button
            variant={filter === "feedback" ? "default" : "outline"}
            className={filter === "feedback" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => {
              if (!isPro) {
                setActiveScreen("settings")
              } else {
                setFilter("feedback")
              }
            }}
          >
            Project Feedback
            {!isPro && <Lock className="ml-2" size={14} />}
          </Button>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`bg-gray-800 border-gray-700 ${!notif.isRead ? "border-l-4 border-l-amber-500" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notif.type === "System"
                        ? "bg-blue-600/20"
                        : notif.type === "Mentoring"
                          ? "bg-amber-600/20"
                          : notif.type === "Community"
                            ? "bg-purple-600/20"
                            : "bg-green-600/20"
                    }`}
                  >
                    {notif.type === "System" && <Info className="text-blue-500" size={20} />}
                    {notif.type === "Mentoring" && <Briefcase className="text-amber-500" size={20} />}
                    {notif.type === "Community" && <Users className="text-purple-500" size={20} />}
                    {notif.type === "Feedback" && <CheckCircle className="text-green-500" size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge
                        className={
                          notif.type === "System"
                            ? "bg-blue-600"
                            : notif.type === "Mentoring"
                              ? "bg-amber-600 text-gray-900"
                              : notif.type === "Community"
                                ? "bg-purple-600"
                                : "bg-green-600"
                        }
                      >
                        {notif.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{notif.timestamp.toLocaleString()}</span>
                    </div>
                    <p className="text-white">{notif.summary}</p>
                  </div>
                  {!notif.isRead && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isPro && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <History className="mx-auto mb-3 text-amber-500" size={32} />
              <h4 className="font-semibold text-white mb-2">Limited History</h4>
              <p className="text-sm text-gray-400 mb-4">
                Free users can only view notifications from the last 7 days. Upgrade for unlimited history.
              </p>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                onClick={() => setActiveScreen("settings")}
              >
                View History (Pro-Only)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Screen #12: AI Study Assistant
  const AIAssistant = () => {
    const [messages, setMessages] = useState<IMessage[]>([
      {
        id: "1",
        sender: "ai",
        content: "Hello! I'm your AI Study Assistant. How can I help you today?",
        timestamp: new Date(),
        contentType: "text",
      },
    ])
    const [inputMessage, setInputMessage] = useState("")
    const [dailyQueries, setDailyQueries] = useState(3)
    const maxFreeQueries = 5
    const [contextMode, setContextMode] = useState<"general" | "course" | "project">("general")

    const handleSend = () => {
      if (!inputMessage.trim()) return
      if (!isPro && dailyQueries >= maxFreeQueries) return

      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          sender: "user",
          content: inputMessage,
          timestamp: new Date(),
          contentType: "text",
        },
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content: "That's a great question! Let me help you understand...",
          timestamp: new Date(),
          contentType: "text",
        },
      ])
      setInputMessage("")
      setDailyQueries(dailyQueries + 1)
    }

    const isLimitReached = !isPro && dailyQueries >= maxFreeQueries

    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                  <Sparkles className="text-gray-900" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Study Assistant</h3>
                  <p className="text-sm text-gray-400">Ready to assist</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {!isPro && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Daily Queries</p>
                    <p className="text-lg font-bold text-amber-500">
                      {dailyQueries} / {maxFreeQueries}
                    </p>
                  </div>
                )}
                <Select value={contextMode} onValueChange={(v) => setContextMode(v as any)}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="course" disabled={!isPro}>
                      Current Course {!isPro && "🔒"}
                    </SelectItem>
                    <SelectItem value="project" disabled={!isPro}>
                      Current Project {!isPro && "🔒"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-4 h-96 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === "ai" ? "bg-amber-500" : "bg-gray-700"
                      }`}
                    >
                      {msg.sender === "ai" ? (
                        <Sparkles className="text-gray-900" size={16} />
                      ) : (
                        <User className="text-white" size={16} />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender === "ai" ? "bg-gray-900 text-white" : "bg-amber-500 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      {msg.contentType === "code" && (
                        <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-x-auto">
                          <code>{msg.content}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            {isLimitReached ? (
              <div className="p-6 bg-gray-900 rounded-lg text-center">
                <Lock className="mx-auto mb-3 text-amber-500" size={32} />
                <h4 className="font-semibold text-white mb-2">Daily Limit Reached</h4>
                <p className="text-sm text-gray-400 mb-4">Get unlimited AI help with Pro!</p>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                  onClick={() => setActiveScreen("settings")}
                >
                  <Crown className="mr-2" size={16} />
                  Upgrade Now
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Ask me anything about your courses..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="bg-gray-900 border-gray-700 text-white"
                />
                <Button size="icon" className="bg-amber-500 hover:bg-amber-600 text-gray-900" onClick={handleSend}>
                  <Send size={16} />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!isPro && (
          <Card className="bg-gray-800 border-amber-500 border-2">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Lock className="text-amber-500" size={24} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Unlock Course & Project Context with Pro</p>
                  <p className="text-xs text-gray-400">
                    Get AI assistance tailored to your specific learning materials
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                  onClick={() => setActiveScreen("settings")}
                >
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Screen #13: Live Sessions
  const LiveSessions = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Cohort Mode & Live Sessions</h2>
        <p className="text-gray-400">Join structured learning experiences</p>
      </div>

      {/* Featured Session */}
      {mockSessions[0] && (
        <Card className="bg-gradient-to-r from-amber-600 to-amber-700 border-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-gray-900 text-amber-500 mb-2">Next Live Session</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{mockSessions[0].title}</h3>
                <p className="text-gray-800 mb-3">with {mockSessions[0].instructor}</p>
                <div className="flex items-center space-x-4 text-gray-900">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon size={16} />
                    <span>{mockSessions[0].dateTime.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{mockSessions[0].dateTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video size={16} />
                    <span>{mockSessions[0].durationMinutes} min</span>
                  </div>
                </div>
              </div>
              {isPro ? (
                <Button className="bg-gray-900 hover:bg-gray-800 text-amber-500 font-bold">
                  <Video className="mr-2" size={16} />
                  Join Live
                </Button>
              ) : (
                <Button
                  className="bg-gray-900 hover:bg-gray-800 text-amber-500 font-bold"
                  onClick={() => setActiveScreen("settings")}
                >
                  <Lock className="mr-2" size={16} />
                  Pro Exclusive
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Calendar */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Schedule</CardTitle>
            <CardDescription>Next 4 weeks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSessions.map((session) => (
              <div key={session.sessionId} className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-white">{session.title}</h4>
                      {session.isProExclusive && <Badge className="bg-amber-600 text-gray-900">Pro</Badge>}
                      {session.isCohortEvent && <Badge className="bg-purple-600">Cohort</Badge>}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">with {session.instructor}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span>{session.dateTime.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{session.dateTime.toLocaleTimeString()}</span>
                      <span>•</span>
                      <span>{session.durationMinutes} min</span>
                    </div>
                  </div>
                  {session.isProExclusive && !isPro ? (
                    <Button
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                      onClick={() => setActiveScreen("settings")}
                    >
                      <Lock className="mr-1" size={12} />
                      Unlock
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="border-amber-500 text-amber-500 bg-transparent">
                      Register
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Session Directory */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Available Cohorts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Web Dev Bootcamp", start: "Nov 1", status: "Open" },
              { name: "Data Science Intensive", start: "Nov 15", status: "Open" },
              { name: "UX Design Sprint", start: "Dec 1", status: "Closed" },
            ].map((cohort, i) => (
              <div key={i} className="p-3 bg-gray-900 rounded-lg">
                <h4 className="font-semibold text-white mb-1">{cohort.name}</h4>
                <p className="text-xs text-gray-400 mb-2">Starts: {cohort.start}</p>
                <Badge className={cohort.status === "Open" ? "bg-green-600" : "bg-gray-700"}>{cohort.status}</Badge>
                {cohort.status === "Open" && (
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-gray-900"
                    onClick={() => {
                      if (!isPro) {
                        setActiveScreen("settings")
                      } else if (!checkProfileComplete('enroll in this cohort')) {
                        return
                      }
                    }}
                  >
                    {isPro ? (
                      "Enroll Now"
                    ) : (
                      <>
                        <Lock className="mr-1" size={12} />
                        Upgrade to Join
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Screen #14: Leaderboard
  const Leaderboard = () => {
    const [metric, setMetric] = useState<string>("hours")
    const userRank = 15
    const userScore = 1847

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
          <p className="text-gray-400">Compete and grow with fellow learners</p>
        </div>

        {/* My Rank Card */}
        <Card className="bg-gradient-to-r from-amber-600 to-amber-700 border-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-2xl font-bold text-amber-500">#{userRank}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Your Rank</h3>
                  <p className="text-gray-800">Score: {userScore} hours</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-800">Next Tier</p>
                <p className="text-2xl font-bold text-gray-900">153 pts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2">
          <Button
            variant={metric === "hours" ? "default" : "outline"}
            className={metric === "hours" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => setMetric("hours")}
          >
            Hours Logged
          </Button>
          <Button
            variant={metric === "accuracy" ? "default" : "outline"}
            className={metric === "accuracy" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => {
              if (!isPro) {
                setActiveScreen("settings")
              } else {
                setMetric("accuracy")
              }
            }}
          >
            Quiz Accuracy
            {!isPro && <Lock className="ml-2" size={14} />}
          </Button>
          <Button
            variant={metric === "projects" ? "default" : "outline"}
            className={metric === "projects" ? "bg-amber-500 text-gray-900" : "border-gray-700 text-gray-300"}
            onClick={() => {
              if (!isPro) {
                setActiveScreen("settings")
              } else {
                setMetric("projects")
              }
            }}
          >
            Projects Completed
            {!isPro && <Lock className="ml-2" size={14} />}
          </Button>
        </div>

        {/* Ranking List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-3">
              {mockLeaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={`p-4 rounded-lg flex items-center justify-between ${
                    entry.rank <= 3
                      ? "bg-gradient-to-r from-amber-600/20 to-transparent border border-amber-500"
                      : "bg-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1
                          ? "bg-yellow-500 text-gray-900"
                          : entry.rank === 2
                            ? "bg-gray-400 text-gray-900"
                            : entry.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {entry.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{entry.userName}</p>
                      <p className="text-xs text-gray-400">{entry.userLocation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-500">{entry.score}</p>
                    <p className="text-xs text-gray-400">{entry.metricType}</p>
                  </div>
                </div>
              ))}
            </div>

            {!isPro && (
              <div className="mt-6 p-4 bg-gray-900 rounded-lg text-center">
                <Lock className="mx-auto mb-2 text-amber-500" size={24} />
                <p className="text-sm text-gray-400">Unlock advanced filters and full leaderboard access with Pro</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Screen #15: Marketplace
  const Marketplace = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Marketplace</h2>
          <p className="text-gray-400">Premium resources to accelerate your learning</p>
        </div>
        {isPro && <Badge className="bg-amber-600 text-gray-900 text-lg px-4 py-2">🎉 Pro Members Save 20%</Badge>}
      </div>

      {/* Pro Discount Banner */}
      {isPro && (
        <Card className="bg-gradient-to-r from-amber-600 to-amber-700 border-amber-500">
          <CardContent className="p-4 text-center">
            <p className="text-gray-900 font-semibold">
              ✨ Your Pro membership gives you 20% off all Marketplace items! ✨
            </p>
          </CardContent>
        </Card>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => {
          const finalPrice = isPro
            ? product.standardPrice * (1 - product.proDiscountPercent / 100)
            : product.standardPrice

          return (
            <Card key={product.productId} className="bg-gray-800 border-gray-700 overflow-hidden">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4 space-y-3">
                <div>
                  <Badge className="bg-gray-700 text-gray-300 mb-2">{product.type}</Badge>
                  <h3 className="font-bold text-white mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-400">{product.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {isPro ? (
                      <>
                        <p className="text-2xl font-bold text-amber-500">${finalPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 line-through">${product.standardPrice.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-white">${product.standardPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-gray-900">
                    <ShoppingBag className="mr-2" size={14} />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!isPro && (
        <Card className="bg-gray-800 border-amber-500 border-2">
          <CardContent className="p-6 text-center">
            <Percent className="mx-auto mb-3 text-amber-500" size={32} />
            <h4 className="font-semibold text-white mb-2">Save 20% on Everything</h4>
            <p className="text-sm text-gray-400 mb-4">
              Pro members get permanent discounts on all Marketplace purchases
            </p>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-gray-900"
              onClick={() => setActiveScreen("settings")}
            >
              Upgrade to Save
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Screen #16: Referral Dashboard
  const ReferralDashboard = () => {
    const referralCode = "CHINEDU2025"
    const referralLink = `https://techmigo.com/join/${referralCode}`
    const qualifiedReferrals = 2

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Referral Dashboard</h2>
          <p className="text-gray-400">Share TechMigo and earn rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Referral Link Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Referral Link</CardTitle>
              <CardDescription>Share with friends and colleagues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Referral Code</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-amber-500">{referralCode}</p>
                  <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Referral Link</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-300 truncate flex-1">{referralLink}</p>
                  <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white flex-shrink-0">
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Button size="icon" variant="outline" className="border-gray-700 text-blue-500 bg-transparent">
                  <Facebook size={16} />
                </Button>
                <Button size="icon" variant="outline" className="border-gray-700 text-blue-400 bg-transparent">
                  <Twitter size={16} />
                </Button>
                <Button size="icon" variant="outline" className="border-gray-700 text-blue-600 bg-transparent">
                  <Linkedin size={16} />
                </Button>
                <Button size="icon" variant="outline" className="border-gray-700 text-pink-500 bg-transparent">
                  <Instagram size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reward Tracker */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Progress</CardTitle>
              <CardDescription>Track your rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-900 rounded-lg">
                <p className="text-4xl font-bold text-amber-500 mb-2">{qualifiedReferrals}</p>
                <p className="text-sm text-gray-400">Qualified Referrals</p>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-green-900/20 border border-green-600 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">Tier 1: Free Month</p>
                    <CheckCircle className="text-green-500" size={16} />
                  </div>
                  <p className="text-xs text-gray-400">1 referral • Unlocked!</p>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg relative">
                  {!isPro && (
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <Lock className="text-amber-500" size={20} />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">Tier 2: $100 Cash</p>
                    <span className="text-xs text-gray-400">3/5</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="p-3 bg-gray-900 rounded-lg relative">
                  {!isPro && (
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <Lock className="text-amber-500" size={20} />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">Tier 3: $500 Cash</p>
                    <span className="text-xs text-gray-400">0/10</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
              {!isPro && (
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                  onClick={() => setActiveScreen("settings")}
                >
                  <Lock className="mr-2" size={14} />
                  Unlock Cash Rewards
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Referral History */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Referral History</CardTitle>
              <CardDescription>Recent activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white">John D.</p>
                  <Badge className="bg-green-600">Converted</Badge>
                </div>
                <p className="text-xs text-gray-400">Signed up 3 days ago</p>
                {isPro && <p className="text-xs text-amber-500 mt-1">Upgraded to Pro!</p>}
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white">Sarah M.</p>
                  <Badge className="bg-blue-600">Signed Up</Badge>
                </div>
                <p className="text-xs text-gray-400">Signed up 1 week ago</p>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white">Mike K.</p>
                  <Badge className="bg-gray-700">Clicked</Badge>
                </div>
                <p className="text-xs text-gray-400">Visited 2 weeks ago</p>
              </div>
              {!isPro && (
                <div className="p-3 bg-gray-900 rounded-lg text-center">
                  <Lock className="mx-auto mb-2 text-amber-500" size={20} />
                  <p className="text-xs text-gray-400">View conversion details with Pro</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Screen #17: Settings & Billing
  const SettingsBilling = () => {
    const [activeTab, setActiveTab] = useState<"profile" | "membership" | "payment" | "history">("profile")
    const [userEmail, setUserEmail] = useState("")
    const [fullName, setFullName] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [countryCode, setCountryCode] = useState("+234")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [learningGoal, setLearningGoal] = useState("upskill")
    const [notificationPrefs, setNotificationPrefs] = useState({
      courseUpdates: true,
      mentorshipMessages: true,
      communityMentions: true,
      billingNotifications: true
    })

    // Load user data from localStorage
    useEffect(() => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.email) {
            setUserEmail(userData.email)
          }
          if (userData.name) {
            setFullName(userData.name)
          }
          if (userData.avatar) {
            setAvatarUrl(userData.avatar)
          }
          if (userData.phone) {
            // Split phone into country code and number if it contains a space
            const phoneParts = userData.phone.split(' ')
            if (phoneParts.length === 2) {
              setCountryCode(phoneParts[0])
              setPhoneNumber(phoneParts[1])
            } else {
              setPhoneNumber(userData.phone)
            }
          }
          if (userData.learningGoal) {
            setLearningGoal(userData.learningGoal)
          }
          if (userData.notificationPrefs) {
            setNotificationPrefs(userData.notificationPrefs)
          }
        } catch (error) {
          console.error("Error loading user data:", error)
        }
      }
    }, [])

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64String = reader.result as string
          setAvatarUrl(base64String)
          
          try {
            // Get token from localStorage
            const token = localStorage.getItem("token")
            
            if (!token) {
              alert("❌ Please log in again to upload photos.")
              return
            }

            // Call API to update avatar
            const response = await fetch((process.env.NODE_ENV === 'production' ? 'https://techmigo.co.uk' : 'http://localhost:3000') + '/api/auth/me', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ avatar: base64String })
            })

            if (!response.ok) {
              throw new Error('Failed to upload avatar')
            }

            const data = await response.json()
            
            // Update localStorage with the returned user data
            localStorage.setItem("user", JSON.stringify(data.user))
            
            // Update userStats state
            setUserStats({...userStats, userAvatarUrl: base64String})
            
            console.log("Avatar uploaded successfully")
          } catch (error) {
            console.error("Error uploading avatar:", error)
            alert("❌ Error uploading photo. Please try again.")
          }
        }
        reader.readAsDataURL(file)
      }
    }

    const handleSaveChanges = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token")
        
        console.log("Save attempt - Token exists:", !!token)
        
        if (!token) {
          alert("❌ Please log in again to save changes.")
          return
        }

        // Prepare update data
        const updateData = {
          name: fullName,
          email: userEmail,
          avatar: avatarUrl,
          phone: phoneNumber ? `${countryCode} ${phoneNumber}` : '',
          learningGoal: learningGoal,
          notificationPrefs: notificationPrefs
        }

        console.log("Sending update data:", updateData)

        // Call API to update user profile
        const response = await fetch((process.env.NODE_ENV === 'production' ? 'https://techmigo.co.uk' : 'http://localhost:3000') + '/api/auth/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        })

        console.log("Response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          throw new Error(errorData.error || 'Failed to update profile')
        }

        const data = await response.json()
        
        console.log("API Response:", data)
        
        // Update localStorage with the returned user data
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Update userStats state in parent component to reflect changes immediately
        setUserStats({
          ...userStats,
          userName: data.user.name,
          userAvatarUrl: data.user.avatar
        })
        
        console.log("Profile updated successfully:", data.user)
        alert("✅ Changes saved successfully! Your profile has been updated.")
      } catch (error: any) {
        console.error("Error saving changes:", error)
        alert(`❌ Error: ${error.message || 'Please try again.'}`)
      }
    }

    const handleLogout = () => {
      // Clear localStorage
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      
      // Redirect to login page (production-aware)
      const loginUrl = process.env.NODE_ENV === 'production' 
        ? 'https://techmigo.co.uk/login'
        : 'http://localhost:3000/login'
      window.location.href = loginUrl
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Settings & Billing</h2>
          <p className="text-gray-400">Manage your account and subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Management Sidebar */}
          <Card className="bg-gray-800 border-gray-700 h-fit">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-amber-500">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} />
                  ) : null}
                  <AvatarFallback className="bg-amber-500 text-gray-900 text-2xl font-bold">
                    {fullName
                      ? fullName.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : userStats.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-white">{fullName || userStats.userName}</h3>
                <Badge className={isPro ? "bg-amber-600 text-gray-900" : "bg-gray-700 text-gray-300"}>
                  {userStats.subscriptionTier}
                </Badge>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "profile" ? "bg-amber-500 text-gray-900" : "text-gray-300"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2" size={16} />
                  Account Profile
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "membership" ? "bg-amber-500 text-gray-900" : "text-gray-300"}`}
                  onClick={() => setActiveTab("membership")}
                >
                  <Crown className="mr-2" size={16} />
                  Membership
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "payment" ? "bg-amber-500 text-gray-900" : "text-gray-300"}`}
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="mr-2" size={16} />
                  Payment
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "history" ? "bg-amber-500 text-gray-900" : "text-gray-300"}`}
                  onClick={() => setActiveTab("history")}
                >
                  <History className="mr-2" size={16} />
                  History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Account Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Picture Upload */}
                  <div className="space-y-3">
                    <Label className="text-gray-300">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20 border-4 border-amber-500">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} />
                        ) : null}
                        <AvatarFallback className="bg-amber-500 text-gray-900 text-2xl font-bold">
                          {fullName
                            ? fullName.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-gray-900 bg-transparent"
                          onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                          <Upload className="mr-2" size={16} />
                          Upload New Photo
                        </Button>
                        {avatarUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="ml-2 text-red-500 hover:text-red-400"
                            onClick={() => {
                              setAvatarUrl("")
                              const storedUser = localStorage.getItem("user")
                              if (storedUser) {
                                const userData = JSON.parse(storedUser)
                                delete userData.avatar
                                localStorage.setItem("user", JSON.stringify(userData))
                              }
                            }}
                          >
                            Remove Photo
                          </Button>
                        )}
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <Input 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Email Address</Label>
                      <Input 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Phone Number</Label>
                      <div className="flex space-x-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91</SelectItem>
                            <SelectItem value="+234">🇳🇬 +234</SelectItem>
                            <SelectItem value="+254">🇰🇪 +254</SelectItem>
                            <SelectItem value="+27">🇿🇦 +27</SelectItem>
                            <SelectItem value="+233">🇬🇭 +233</SelectItem>
                            <SelectItem value="+256">🇺🇬 +256</SelectItem>
                            <SelectItem value="+255">🇹🇿 +255</SelectItem>
                            <SelectItem value="+92">🇵🇰 +92</SelectItem>
                            <SelectItem value="+880">🇧🇩 +880</SelectItem>
                            <SelectItem value="+63">🇵🇭 +63</SelectItem>
                            <SelectItem value="+52">🇲🇽 +52</SelectItem>
                            <SelectItem value="+55">🇧🇷 +55</SelectItem>
                            <SelectItem value="+86">🇨🇳 +86</SelectItem>
                            <SelectItem value="+81">🇯🇵 +81</SelectItem>
                            <SelectItem value="+82">🇰🇷 +82</SelectItem>
                            <SelectItem value="+61">🇦🇺 +61</SelectItem>
                            <SelectItem value="+49">🇩🇪 +49</SelectItem>
                            <SelectItem value="+33">🇫🇷 +33</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          placeholder="123 456 7890" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 bg-gray-900 border-gray-700 text-white" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Time Zone</Label>
                      <Select defaultValue="waf">
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="waf">West Africa Time (WAT)</SelectItem>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Learning Goal</Label>
                    <Select value={learningGoal} onValueChange={setLearningGoal}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="career">Career Switch</SelectItem>
                        <SelectItem value="upskill">Upskill</SelectItem>
                        <SelectItem value="business">Build a Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-300">Notification Preferences</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Course Updates</span>
                        <Switch 
                          checked={notificationPrefs.courseUpdates} 
                          onCheckedChange={(checked) => setNotificationPrefs({...notificationPrefs, courseUpdates: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Mentorship Messages</span>
                        <Switch 
                          checked={notificationPrefs.mentorshipMessages} 
                          onCheckedChange={(checked) => setNotificationPrefs({...notificationPrefs, mentorshipMessages: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Community Mentions</span>
                        <Switch 
                          checked={notificationPrefs.communityMentions} 
                          onCheckedChange={(checked) => setNotificationPrefs({...notificationPrefs, communityMentions: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Billing Notifications</span>
                        <Switch 
                          checked={notificationPrefs.billingNotifications} 
                          onCheckedChange={(checked) => setNotificationPrefs({...notificationPrefs, billingNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-300">Security</Label>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-700 text-gray-300 bg-transparent"
                      >
                        <Shield className="mr-2" size={16} />
                        Change Password
                      </Button>
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Two-Factor Authentication</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "membership" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Membership</CardTitle>
                  <CardDescription>Manage your subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Plan */}
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">Current Plan</h4>
                        <p className="text-2xl font-bold text-amber-500">{userStats.subscriptionTier}</p>
                      </div>
                      {isPro && <Badge className="bg-green-600">Active</Badge>}
                    </div>
                    {isPro && <p className="text-sm text-gray-400">Renews on November 19, 2025</p>}
                  </div>

                  {/* Subscription Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Free Plan */}
                    <Card className={`bg-gray-900 ${!isPro ? "border-amber-500 border-2" : "border-gray-700"}`}>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-white">Free</h4>
                          <p className="text-2xl font-bold text-white">$0</p>
                          <p className="text-xs text-gray-500">Forever</p>
                        </div>
                        <p className="text-xs text-gray-400">Perfect for exploring and getting started with basic learning</p>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Access to 5 free courses</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Basic project templates</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Community forum access</span>
                          </li>
                          <li className="flex items-start">
                            <X className="mr-2 text-red-500 flex-shrink-0" size={16} />
                            <span>No certificates</span>
                          </li>
                        </ul>
                        {!isPro && <Badge className="bg-amber-600 text-gray-900">Current Plan</Badge>}
                      </CardContent>
                    </Card>

                    {/* Monthly Plan */}
                    <Card className="bg-gray-900 border-gray-700">
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-white">Monthly</h4>
                          <p className="text-2xl font-bold text-white">
                            $24.99<span className="text-sm text-gray-400">/mo</span>
                          </p>
                          <p className="text-xs text-gray-500">Billed monthly</p>
                        </div>
                        <p className="text-xs text-gray-400">For learners who want flexibility with month-to-month access</p>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Full course library</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Unlimited projects</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Verified certificates</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Mentor access</span>
                          </li>
                        </ul>
                        {!isPro && (
                          <Button 
                            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                            onClick={() => handleSubscribe('Monthly', process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || 'price_1SLGCAJZuJlFWRBhESjwJ5ik')}
                          >
                            Upgrade Now
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {/* Annual Plan - MOST POPULAR */}
                    <Card className="bg-gradient-to-br from-amber-600/20 to-transparent border-amber-500 border-2 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-amber-600 text-gray-900">🔥 Most Popular</Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-white">Annual</h4>
                          <p className="text-2xl font-bold text-white">
                            $249.90<span className="text-sm text-gray-400">/yr</span>
                          </p>
                          <Badge className="bg-green-600 text-xs mt-1">Save $49.98</Badge>
                        </div>
                        <p className="text-xs text-gray-400">Best value! Serious learners save 16% with annual commitment</p>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Everything in Monthly</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Priority support</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Exclusive workshops</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Early access to new content</span>
                          </li>
                        </ul>
                        {!isPro && (
                          <Button 
                            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                            onClick={() => handleSubscribe('Annual', process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_1SLGCAJZuJlFWRBhXv7LEw3Q')}
                          >
                            Upgrade Now
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {/* Lifetime Plan */}
                    <Card className="bg-gradient-to-br from-purple-600/20 to-transparent border-purple-500 border-2 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-600 text-white">💎 Best Deal</Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-white">Lifetime</h4>
                          <p className="text-2xl font-bold text-white">
                            $899.64<span className="text-sm text-gray-400"> once</span>
                          </p>
                          <Badge className="bg-purple-600 text-xs mt-1">Unlimited Access</Badge>
                        </div>
                        <p className="text-xs text-gray-400">One-time payment for lifetime access - never pay again!</p>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Everything in Annual</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>Lifetime updates</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>VIP community access</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                            <span>All future courses free</span>
                          </li>
                        </ul>
                        {!isPro && (
                          <Button 
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                            onClick={() => handleSubscribe('Lifetime', 'price_lifetime_plan')}
                          >
                            Get Lifetime
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {isPro && (
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white bg-transparent"
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "payment" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Payment Methods</CardTitle>
                  <CardDescription>Manage your payment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-900 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="text-amber-500" size={24} />
                        <div>
                          <p className="font-semibold text-white">Visa •••• 3941</p>
                          <p className="text-sm text-gray-400">Expires 12/25</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-600">Default</Badge>
                        <Button size="sm" variant="ghost" className="text-gray-400">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 bg-transparent">
                    <Plus className="mr-2" size={16} />
                    Add New Payment Method
                  </Button>
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Billing Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Country</Label>
                        <Select defaultValue="ng">
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="ng">Nigeria</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">City</Label>
                        <Input placeholder="Lagos" className="bg-gray-800 border-gray-700 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg flex items-start space-x-2">
                    <Shield className="text-blue-500 flex-shrink-0" size={20} />
                    <p className="text-sm text-gray-300">
                      Your payment details are encrypted and never stored directly by TechMigo.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "history" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Transaction History</CardTitle>
                  <CardDescription>View your payment history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Date</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Description</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Amount</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Status</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: "Oct 02, 2025", desc: "Pro Annual Subscription", amount: "$249", status: "Paid" },
                          { date: "Jul 02, 2025", desc: "Course Upgrade", amount: "$49", status: "Paid" },
                          { date: "Mar 01, 2025", desc: "Mentor Add-on", amount: "$29", status: "Failed" },
                        ].map((transaction, i) => (
                          <tr key={i} className="border-b border-gray-700">
                            <td className="py-3 px-2 text-sm text-gray-300">{transaction.date}</td>
                            <td className="py-3 px-2 text-sm text-white">{transaction.desc}</td>
                            <td className="py-3 px-2 text-sm text-white font-semibold">{transaction.amount}</td>
                            <td className="py-3 px-2">
                              <Badge className={transaction.status === "Paid" ? "bg-green-600" : "bg-red-600"}>
                                {transaction.status === "Paid" ? (
                                  <Check className="mr-1" size={12} />
                                ) : (
                                  <X className="mr-1" size={12} />
                                )}
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-2">
                              {transaction.status === "Paid" ? (
                                <Button size="sm" variant="ghost" className="text-amber-500">
                                  <Download size={14} />
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" className="text-blue-500">
                                  Retry
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!isPro && (
                    <div className="p-4 bg-gray-900 rounded-lg text-center">
                      <Lock className="mx-auto mb-2 text-amber-500" size={24} />
                      <p className="text-sm text-gray-400 mb-3">Free users can only view the last 3 transactions</p>
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                        onClick={() => setActiveTab("membership")}
                      >
                        Unlock Full Transaction History (Pro)
                      </Button>
                    </div>
                  )}

                  {isPro && (
                    <div className="p-4 bg-amber-900/20 border border-amber-600 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">You've earned 1,250 learning points 🎓</p>
                          <p className="text-sm text-gray-400">Redeem for discounts or mentor sessions</p>
                        </div>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-gray-900">
                          Redeem
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ============================================================================
  // RENDER MAIN LAYOUT
  // ============================================================================

  // Show loading screen while data is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading TechMigo...</h2>
          <p className="text-gray-400">Please wait while we set up your dashboard</p>
        </div>
      </div>
    )
  }

  // Profile Completion Modal Component
  const ProfileCompletionModal = () => {
    const [formData, setFormData] = useState({
      name: currentUser?.name || '',
      avatar: currentUser?.avatar || '',
      phone: currentUser?.phone || '',
      bio: currentUser?.bio || '',
      country: currentUser?.country || '',
      city: currentUser?.city || '',
      dateOfBirth: currentUser?.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '',
      learningGoal: currentUser?.learningGoal || '',
    })
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, GIF, etc.)')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setUploading(true)
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload,
        })

        const data = await response.json()
        
        console.log('Upload response:', { success: data.success, url: data.url, error: data.error })
        
        if (data.url) {
          setFormData({ ...formData, avatar: data.url })
          alert('Image uploaded successfully!')
        } else {
          throw new Error(data.error || 'Failed to get image URL')
        }
      } catch (error: any) {
        console.error('Error uploading image:', error)
        alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
      } finally {
        setUploading(false)
      }
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      // Validate all fields
      const requiredFields = ['name', 'avatar', 'phone', 'bio', 'country', 'city', 'dateOfBirth', 'learningGoal']
      const missing = requiredFields.filter(field => !formData[field as keyof typeof formData])
      
      if (missing.length > 0) {
        alert(`Please fill in all required fields: ${missing.join(', ')}`)
        return
      }

      setSubmitting(true)
      try {
        const response = await fetch('/api/profile/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: currentUser?._id,
            ...formData
          })
        })

        const data = await response.json()
        
        console.log('Profile complete response:', { success: data.success, error: data.error, status: response.status })
        
        if (data.success) {
          // Update localStorage
          localStorage.setItem('user', JSON.stringify(data.user))
          setCurrentUser(data.user)
          setProfileComplete(true)
          setShowProfileModal(false)
          
          // Update user stats
          setUserStats({
            ...userStats,
            userName: data.user.name,
            userAvatarUrl: data.user.avatar,
          })
          
          alert('Profile completed successfully! Welcome to TechMigo!')
        } else {
          console.error('Profile completion failed:', data)
          alert(data.error || 'Failed to complete profile')
        }
      } catch (error: any) {
        console.error('Error completing profile:', error)
        alert(`Failed to complete profile: ${error.message || 'Unknown error'}`)
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Shield className="mr-2 text-amber-500" size={28} />
                  Complete Your Profile
                </h2>
                <p className="text-gray-400 mt-1">All fields are required to access platform features</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <p className="text-amber-200 text-sm">
                <Info className="inline mr-2" size={16} />
                You must complete your profile to enroll in courses, start projects, and access learning features. 
                You can still upgrade your account without completing your profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture */}
              <div>
                <Label className="text-white">Profile Picture *</Label>
                <div className="mt-2 flex items-center gap-4">
                  {formData.avatar ? (
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback>{formData.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                    {uploading && <p className="text-sm text-amber-500 mt-1">Uploading...</p>}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <Label className="text-white">Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600 mt-1"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <Label className="text-white">Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600 mt-1"
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <Label className="text-white">Bio *</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600 mt-1"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  required
                />
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Country *</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="bg-gray-700 text-white border-gray-600 mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-gray-700 text-white border-gray-600 mt-1"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <Label className="text-white">Date of Birth *</Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600 mt-1"
                  required
                />
              </div>

              {/* Learning Goal */}
              <div>
                <Label className="text-white">Learning Goal *</Label>
                <Select value={formData.learningGoal} onValueChange={(value) => setFormData({ ...formData, learningGoal: value })}>
                  <SelectTrigger className="bg-gray-700 text-white border-gray-600 mt-1">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="career">Career Change</SelectItem>
                    <SelectItem value="upskill">Upskill for Current Job</SelectItem>
                    <SelectItem value="business">Start a Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={16} />
                      Completing Profile...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2" size={16} />
                      Complete Profile
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveScreen("settings")}
                  className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
                >
                  <Crown className="mr-2" size={16} />
                  Upgrade Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Profile Completion Modal */}
      {showProfileModal && <ProfileCompletionModal />}
      
      <Sidebar />
      
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white"
          >
            <Menu size={24} />
          </Button>
          <h1 className="text-xl font-black text-white">
            TECH<span className="text-amber-500">MIGO</span>
          </h1>
          <Avatar className="w-10 h-10 border-2 border-amber-500">
            {userStats.userAvatarUrl ? (
              <AvatarImage src={userStats.userAvatarUrl} />
            ) : null}
            <AvatarFallback className="bg-amber-500 text-gray-900 text-sm font-bold">
              {userStats.userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      {!isMobile && <TopBar />}

      {/* Main Content Area */}
      <main className={`${isMobile ? 'pt-16 px-4 pb-6' : 'ml-72 mt-16 p-6'}`}>
        {activeScreen === "dashboard" && <DashboardHome />}
        {activeScreen === "courses" && <MyCourses />}
        {activeScreen === "course-player" && <CoursePlayer />}
        {activeScreen === "smart-quiz" && <SmartQuizPage />}
        {activeScreen === "projects" && <ProjectsPage />}
        {activeScreen === "portfolio" && <PortfolioPage />}
        {activeScreen === "community" && <CommunityHub />}
        {activeScreen === "career" && <CareerTools />}
        {activeScreen === "mentor" && <MentorConnect />}
        {activeScreen === "notes" && <NotesVault />}
        {activeScreen === "notifications" && <NotificationsCenter />}
        {activeScreen === "ai-assistant" && <AIAssistant />}
        {activeScreen === "live-sessions" && <LiveSessions />}
        {activeScreen === "leaderboard" && <Leaderboard />}
        {activeScreen === "marketplace" && <Marketplace />}
        {activeScreen === "referrals" && <ReferralDashboard />}
        {activeScreen === "settings" && <SettingsBilling />}
      </main>
    </div>
  )
}

