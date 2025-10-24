"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Award, Target, Clock, CheckCircle2 } from "lucide-react"

interface StudentProgressData {
  id: string
  name: string
  email: string
  avatar: string
  coursesEnrolled: number
  coursesCompleted: number
  overallProgress: number
  totalPoints: number
  achievements: number
  lastActive: string
  status: "active" | "inactive" | "at-risk"
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earnedDate: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface CourseProgress {
  id: string
  courseName: string
  progress: number
  lessonsCompleted: number
  totalLessons: number
  quizzesPassed: number
  totalQuizzes: number
  timeSpent: string
  lastAccessed: string
}

const mockStudents: StudentProgressData[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    coursesEnrolled: 5,
    coursesCompleted: 3,
    overallProgress: 85,
    totalPoints: 2450,
    achievements: 12,
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    coursesEnrolled: 3,
    coursesCompleted: 1,
    overallProgress: 45,
    totalPoints: 890,
    achievements: 5,
    lastActive: "1 day ago",
    status: "active",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    coursesEnrolled: 4,
    coursesCompleted: 0,
    overallProgress: 15,
    totalPoints: 320,
    achievements: 2,
    lastActive: "2 weeks ago",
    status: "at-risk",
  },
]

const mockAchievements: Achievement[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    earnedDate: "2024-01-15",
    rarity: "common",
  },
  {
    id: "2",
    name: "Quiz Master",
    description: "Pass 10 quizzes with 100% score",
    icon: "🏆",
    earnedDate: "2024-02-20",
    rarity: "rare",
  },
  {
    id: "3",
    name: "Course Conqueror",
    description: "Complete 3 courses",
    icon: "👑",
    earnedDate: "2024-03-10",
    rarity: "epic",
  },
]

const mockCourseProgress: CourseProgress[] = [
  {
    id: "1",
    courseName: "React Fundamentals",
    progress: 100,
    lessonsCompleted: 24,
    totalLessons: 24,
    quizzesPassed: 6,
    totalQuizzes: 6,
    timeSpent: "18h 30m",
    lastAccessed: "3 days ago",
  },
  {
    id: "2",
    courseName: "TypeScript Advanced",
    progress: 65,
    lessonsCompleted: 13,
    totalLessons: 20,
    quizzesPassed: 3,
    totalQuizzes: 5,
    timeSpent: "12h 15m",
    lastAccessed: "2 hours ago",
  },
]

export function StudentProgress() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressData | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (student: StudentProgressData) => {
    setSelectedStudent(student)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Student Progress & Gamification</h1>
        <p className="mt-2 text-gray-400">Track student progress, achievements, and engagement</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">12,543</div>
            <p className="mt-1 text-xs text-green-500">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">68%</div>
            <p className="mt-1 text-xs text-red-500">-2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">8,234</div>
            <p className="mt-1 text-xs text-green-500">+8.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">342</div>
            <p className="mt-1 text-xs text-amber-500">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-800 bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-700 bg-gray-900 pl-10 text-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-gray-700 bg-gray-900 text-gray-100">
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Student Progress Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Monitor individual student progress and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Student</TableHead>
                <TableHead className="text-gray-400">Courses</TableHead>
                <TableHead className="text-gray-400">Progress</TableHead>
                <TableHead className="text-gray-400">Points</TableHead>
                <TableHead className="text-gray-400">Achievements</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Last Active</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-700 text-gray-300">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-100">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {student.coursesCompleted}/{student.coursesEnrolled}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.overallProgress} className="h-2 w-24" />
                      <span className="text-sm text-gray-300">{student.overallProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{student.totalPoints}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-300">
                      <Award className="h-4 w-4 text-amber-500" />
                      {student.achievements}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "active"
                          ? "default"
                          : student.status === "at-risk"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        student.status === "active"
                          ? "bg-green-600"
                          : student.status === "at-risk"
                            ? "bg-red-600"
                            : "bg-gray-600"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">{student.lastActive}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(student)}
                      className="text-amber-500 hover:bg-gray-700 hover:text-amber-400"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-100">Student Progress Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Comprehensive view of {selectedStudent?.name}'s learning journey
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="bg-gray-900">
                <TabsTrigger value="overview" className="data-[state=active]:bg-amber-600">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-amber-600">
                  Courses
                </TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-amber-600">
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-gray-700 bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gray-400">Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-100">{selectedStudent.overallProgress}%</div>
                      <Progress value={selectedStudent.overallProgress} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card className="border-gray-700 bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gray-400">Total Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-amber-500">{selectedStudent.totalPoints}</div>
                      <p className="mt-1 text-xs text-gray-500">Rank: #42 globally</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-700 bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gray-400">Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-100">{selectedStudent.achievements}</div>
                      <p className="mt-1 text-xs text-gray-500">12 more to unlock</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-gray-700 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Learning Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Courses Enrolled</span>
                      <span className="font-semibold text-gray-100">{selectedStudent.coursesEnrolled}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Courses Completed</span>
                      <span className="font-semibold text-gray-100">{selectedStudent.coursesCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Study Time</span>
                      <span className="font-semibold text-gray-100">47h 25m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Average Quiz Score</span>
                      <span className="font-semibold text-gray-100">87%</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-4">
                {mockCourseProgress.map((course) => (
                  <Card key={course.id} className="border-gray-700 bg-gray-900">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-gray-100">{course.courseName}</CardTitle>
                          <CardDescription className="text-gray-400">
                            Last accessed: {course.lastAccessed}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={course.progress === 100 ? "default" : "secondary"}
                          className={course.progress === 100 ? "bg-green-600" : "bg-gray-600"}
                        >
                          {course.progress === 100 ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-gray-400">Overall Progress</span>
                          <span className="font-semibold text-gray-100">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-100">
                              {course.lessonsCompleted}/{course.totalLessons}
                            </div>
                            <div className="text-xs text-gray-500">Lessons</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-100">
                              {course.quizzesPassed}/{course.totalQuizzes}
                            </div>
                            <div className="text-xs text-gray-500">Quizzes</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-100">{course.timeSpent}</div>
                            <div className="text-xs text-gray-500">Time Spent</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {mockAchievements.map((achievement) => (
                    <Card key={achievement.id} className="border-gray-700 bg-gray-900">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-100">{achievement.name}</h3>
                              <Badge
                                variant="secondary"
                                className={
                                  achievement.rarity === "legendary"
                                    ? "bg-purple-600"
                                    : achievement.rarity === "epic"
                                      ? "bg-amber-600"
                                      : achievement.rarity === "rare"
                                        ? "bg-blue-600"
                                        : "bg-gray-600"
                                }
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-gray-400">{achievement.description}</p>
                            <p className="mt-2 text-xs text-gray-500">Earned on {achievement.earnedDate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
