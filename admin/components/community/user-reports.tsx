"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface UserReport {
  id: string
  reportedUser: string
  reportedBy: string
  reason: string
  description: string
  status: "Open" | "Investigating" | "Resolved" | "Dismissed"
  priority: "Low" | "Medium" | "High"
  createdAt: string
}

const mockReports: UserReport[] = [
  {
    id: "1",
    reportedUser: "User123",
    reportedBy: "User456",
    reason: "Spam",
    description: "User is posting spam links in multiple threads",
    status: "Open",
    priority: "High",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    reportedUser: "User789",
    reportedBy: "User101",
    reason: "Harassment",
    description: "Sending inappropriate messages to other users",
    status: "Investigating",
    priority: "High",
    createdAt: "2024-03-14",
  },
  {
    id: "3",
    reportedUser: "User202",
    reportedBy: "User303",
    reason: "Inappropriate Content",
    description: "Posted offensive content in course discussion",
    status: "Resolved",
    priority: "Medium",
    createdAt: "2024-03-13",
  },
]

export function UserReports() {
  const [reports, setReports] = useState<UserReport[]>(mockReports)
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReports = reports.filter((report) => statusFilter === "all" || report.status === statusFilter)

  const getStatusBadge = (status: UserReport["status"]) => {
    const colors = {
      Open: "bg-red-600",
      Investigating: "bg-yellow-600",
      Resolved: "bg-green-600",
      Dismissed: "bg-gray-600",
    }
    return colors[status]
  }

  const getPriorityBadge = (priority: UserReport["priority"]) => {
    const colors = {
      Low: "bg-blue-600",
      Medium: "bg-yellow-600",
      High: "bg-red-600",
    }
    return colors[priority]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">User Reports</h2>
          <p className="mt-1 text-gray-400">Track and resolve user-reported issues</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-600">{reports.filter((r) => r.status === "Open").length} Open</Badge>
          <Badge className="bg-yellow-600">
            {reports.filter((r) => r.status === "Investigating").length} Investigating
          </Badge>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Investigating">Investigating</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Table */}
      <div className="rounded-lg border border-gray-800 bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/50">
              <TableHead className="text-gray-300">Reported User</TableHead>
              <TableHead className="text-gray-300">Reason</TableHead>
              <TableHead className="text-gray-300">Priority</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id} className="border-gray-700 hover:bg-gray-700/50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-100">{report.reportedUser}</p>
                    <p className="text-xs text-gray-400">Reported by {report.reportedBy}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-100">{report.reason}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{report.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityBadge(report.priority)}>{report.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(report.status)}>{report.status}</Badge>
                </TableCell>
                <TableCell className="text-gray-400">{report.createdAt}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
                    <Eye className="mr-2 h-3 w-3" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
