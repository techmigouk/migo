"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Mail, Phone, MoreVertical, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: "Active" | "On Leave" | "Inactive"
  joinDate: string
  permissions: string[]
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@techmigo.com",
    phone: "+1 (555) 123-4567",
    role: "Platform Admin",
    department: "Operations",
    status: "Active",
    joinDate: "2023-01-15",
    permissions: ["Full Access"],
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@techmigo.com",
    phone: "+1 (555) 234-5678",
    role: "Content Manager",
    department: "Content",
    status: "Active",
    joinDate: "2023-03-20",
    permissions: ["Course Management", "User Management"],
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@techmigo.com",
    phone: "+1 (555) 345-6789",
    role: "Support Lead",
    department: "Customer Support",
    status: "Active",
    joinDate: "2023-05-10",
    permissions: ["User Management", "Messaging"],
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@techmigo.com",
    phone: "+1 (555) 456-7890",
    role: "Marketing Manager",
    department: "Marketing",
    status: "On Leave",
    joinDate: "2023-07-01",
    permissions: ["Marketing", "Analytics"],
  },
]

export function StaffDirectory() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleAddStaff = () => {
    console.log("[v0] Opening add staff dialog")
    setEditingStaff(null)
    setShowAddStaffDialog(true)
  }

  const handleViewProfile = (member: StaffMember) => {
    console.log("[v0] Viewing staff profile:", member.id)
    setSelectedStaff(member)
    setShowProfileDialog(true)
  }

  const handleEditDetails = (member: StaffMember) => {
    console.log("[v0] Editing staff details:", member.id)
    setEditingStaff(member)
    setShowAddStaffDialog(true)
  }

  const handleManagePermissions = (member: StaffMember) => {
    console.log("[v0] Managing permissions for:", member.id)
    // TODO: Open permissions dialog
  }

  const handleDeactivate = (member: StaffMember) => {
    console.log("[v0] Deactivating staff member:", member.id)
    if (confirm(`Are you sure you want to deactivate ${member.name}?`)) {
      setStaff(staff.map((s) => (s.id === member.id ? { ...s, status: "Inactive" as const } : s)))
    }
  }

  const handleSaveStaff = () => {
    console.log("[v0] Saving staff member")
    setShowAddStaffDialog(false)
    setEditingStaff(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Staff Directory</h2>
          <p className="mt-1 text-gray-400">Manage internal team members</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleAddStaff}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-gray-100"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Content">Content</SelectItem>
            <SelectItem value="Customer Support">Customer Support</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="On Leave">On Leave</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/generic-placeholder-graphic.png?height=48&width=48`} />
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-100">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-gray-700 bg-gray-800">
                    <DropdownMenuItem className="text-gray-300" onClick={() => handleViewProfile(member)}>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300" onClick={() => handleEditDetails(member)}>
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300" onClick={() => handleManagePermissions(member)}>
                      Manage Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400" onClick={() => handleDeactivate(member)}>
                      Deactivate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                {member.phone}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {member.department}
                </Badge>
                <Badge
                  className={
                    member.status === "Active"
                      ? "bg-green-600"
                      : member.status === "On Leave"
                        ? "bg-yellow-600"
                        : "bg-gray-600"
                  }
                >
                  {member.status}
                </Badge>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {member.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="border-amber-600 text-amber-500 text-xs">
                      <Shield className="mr-1 h-3 w-3" />
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">
              {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingStaff ? "Update staff member information" : "Add a new team member"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Full Name</Label>
                <Input
                  defaultValue={editingStaff?.name}
                  placeholder="Enter name..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <Input
                  type="email"
                  defaultValue={editingStaff?.email}
                  placeholder="Enter email..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Phone</Label>
                <Input
                  defaultValue={editingStaff?.phone}
                  placeholder="Enter phone..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Role</Label>
                <Input
                  defaultValue={editingStaff?.role}
                  placeholder="Enter role..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Department</Label>
                <Select defaultValue={editingStaff?.department || "Operations"}>
                  <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Content">Content</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Status</Label>
                <Select defaultValue={editingStaff?.status || "Active"}>
                  <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleSaveStaff}>
                {editingStaff ? "Update Staff Member" : "Add Staff Member"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                onClick={() => setShowAddStaffDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Staff Profile</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/generic-placeholder-graphic.png?height=80&width=80`} />
                  <AvatarFallback className="bg-gray-700 text-gray-300 text-2xl">
                    {selectedStaff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gray-100">{selectedStaff.name}</h3>
                  <p className="text-gray-400">{selectedStaff.role}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedStaff.email}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedStaff.phone}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedStaff.department}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge
                    className={
                      selectedStaff.status === "Active"
                        ? "bg-green-600"
                        : selectedStaff.status === "On Leave"
                          ? "bg-yellow-600"
                          : "bg-gray-600"
                    }
                  >
                    {selectedStaff.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Permissions</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedStaff.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="border-amber-600 text-amber-500">
                      <Shield className="mr-1 h-3 w-3" />
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
