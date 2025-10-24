"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileEdit, UserPlus, Settings, Trash2, Eye } from "lucide-react"

interface ActivityLog {
  id: string
  staffName: string
  action: string
  target: string
  timestamp: string
  type: "create" | "edit" | "delete" | "view" | "settings"
}

const mockLogs: ActivityLog[] = [
  {
    id: "1",
    staffName: "Alice Johnson",
    action: "Created new course",
    target: "Advanced React Patterns",
    timestamp: "2024-03-15 14:32",
    type: "create",
  },
  {
    id: "2",
    staffName: "Bob Smith",
    action: "Edited user profile",
    target: "john.doe@example.com",
    timestamp: "2024-03-15 13:45",
    type: "edit",
  },
  {
    id: "3",
    staffName: "Carol Davis",
    action: "Viewed user details",
    target: "jane.smith@example.com",
    timestamp: "2024-03-15 12:20",
    type: "view",
  },
  {
    id: "4",
    staffName: "Alice Johnson",
    action: "Updated platform settings",
    target: "Email Configuration",
    timestamp: "2024-03-15 11:15",
    type: "settings",
  },
  {
    id: "5",
    staffName: "David Wilson",
    action: "Deleted marketing campaign",
    target: "Summer Sale 2024",
    timestamp: "2024-03-15 10:30",
    type: "delete",
  },
]

export function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>(mockLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || log.type === typeFilter
    return matchesSearch && matchesType
  })

  const getActionIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "create":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "edit":
        return <FileEdit className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "view":
        return <Eye className="h-4 w-4 text-gray-500" />
      case "settings":
        return <Settings className="h-4 w-4 text-amber-500" />
    }
  }

  const getActionBadge = (type: ActivityLog["type"]) => {
    const colors = {
      create: "bg-green-600",
      edit: "bg-blue-600",
      delete: "bg-red-600",
      view: "bg-gray-600",
      settings: "bg-amber-600",
    }
    return colors[type]
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Activity Logs</h2>
        <p className="mt-1 text-gray-400">Track all staff actions and system changes</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-gray-100"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Table */}
      <div className="rounded-lg border border-gray-800 bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/50">
              <TableHead className="text-gray-300">Staff Member</TableHead>
              <TableHead className="text-gray-300">Action</TableHead>
              <TableHead className="text-gray-300">Target</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="border-gray-700 hover:bg-gray-700/50">
                <TableCell className="font-medium text-gray-100">{log.staffName}</TableCell>
                <TableCell className="text-gray-300">{log.action}</TableCell>
                <TableCell className="text-gray-400">{log.target}</TableCell>
                <TableCell>
                  <Badge className={getActionBadge(log.type)}>
                    <span className="flex items-center gap-1">
                      {getActionIcon(log.type)}
                      {log.type}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400">{log.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
