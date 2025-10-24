"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, CheckCircle, XCircle, Clock, Download, FileText } from "lucide-react"

interface SubmittedProject {
  id: string
  studentName: string
  studentEmail: string
  courseName: string
  projectTitle: string
  submittedDate: string
  status: "Pending" | "Approved" | "Rejected"
  progress: number
  files: string[]
  remarks?: string
}

const mockProjects: SubmittedProject[] = [
  {
    id: "1",
    studentName: "Alice Johnson",
    studentEmail: "alice@example.com",
    courseName: "React Fundamentals",
    projectTitle: "Build a Todo App",
    submittedDate: "2024-02-10",
    status: "Pending",
    progress: 85,
    files: ["todo-app.zip", "screenshot.png", "demo-video.mp4"],
  },
  {
    id: "2",
    studentName: "Bob Smith",
    studentEmail: "bob@example.com",
    courseName: "Python for Data Science",
    projectTitle: "Data Analysis Dashboard",
    submittedDate: "2024-02-08",
    status: "Approved",
    progress: 100,
    files: ["dashboard.py", "data.csv", "report.pdf"],
    remarks: "Excellent work! Great use of pandas and matplotlib.",
  },
]

export function SubmittedProjects() {
  const [projects, setProjects] = useState<SubmittedProject[]>(mockProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState<SubmittedProject | null>(null)
  const [reviewRemarks, setReviewRemarks] = useState("")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleReviewProject = (project: SubmittedProject) => {
    console.log("[v0] Reviewing project:", project.id)
    setSelectedProject(project)
    setReviewRemarks(project.remarks || "")
    setShowReviewDialog(true)
  }

  const handleApproveProject = () => {
    if (!selectedProject) return
    console.log("[v0] Approving project:", selectedProject.id)
    setProjects(
      projects.map((p) =>
        p.id === selectedProject.id ? { ...p, status: "Approved" as const, remarks: reviewRemarks } : p,
      ),
    )
    setShowReviewDialog(false)
  }

  const handleRejectProject = () => {
    if (!selectedProject) return
    console.log("[v0] Rejecting project:", selectedProject.id)
    setProjects(
      projects.map((p) =>
        p.id === selectedProject.id ? { ...p, status: "Rejected" as const, remarks: reviewRemarks } : p,
      ),
    )
    setShowReviewDialog(false)
  }

  const handleDownloadFile = (fileName: string) => {
    console.log("[v0] Downloading file:", fileName)
    // TODO: Implement file download
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Submitted Projects</h2>
          <p className="mt-1 text-gray-400">Review and approve student project submissions</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by student or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-gray-100"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-100">{project.projectTitle}</h3>
                    <Badge
                      className={
                        project.status === "Approved"
                          ? "bg-green-600"
                          : project.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                      }
                    >
                      {project.status === "Approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {project.status === "Rejected" && <XCircle className="mr-1 h-3 w-3" />}
                      {project.status === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                      {project.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    {project.studentName} • {project.studentEmail}
                  </p>
                  <p className="text-sm text-gray-400">{project.courseName}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Course Progress:</span>
                <span className="font-medium text-gray-100">{project.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-700">
                <div className="h-full rounded-full bg-amber-600" style={{ width: `${project.progress}%` }} />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText className="h-4 w-4" />
                <span>Submitted: {new Date(project.submittedDate).toLocaleDateString()}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-300">Attached Files:</p>
                <div className="flex flex-wrap gap-2">
                  {project.files.map((file, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 bg-transparent"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      {file}
                    </Button>
                  ))}
                </div>
              </div>
              {project.remarks && (
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
                  <p className="text-sm font-medium text-gray-300">Admin Remarks:</p>
                  <p className="mt-1 text-sm text-gray-400">{project.remarks}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 bg-transparent"
                  onClick={() => handleReviewProject(project)}
                >
                  <Eye className="mr-2 h-3 w-3" />
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Review Project Submission</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedProject?.studentName} - {selectedProject?.projectTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Course:</span>
                <span className="text-gray-100">{selectedProject?.courseName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress:</span>
                <span className="text-gray-100">{selectedProject?.progress}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Submitted:</span>
                <span className="text-gray-100">
                  {selectedProject && new Date(selectedProject.submittedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Admin Remarks</Label>
              <Textarea
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                placeholder="Provide feedback on the project submission..."
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                rows={4}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleApproveProject}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Project
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                onClick={handleRejectProject}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
