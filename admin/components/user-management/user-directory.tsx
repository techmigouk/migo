"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Search, Plus, MoreVertical, Mail, Ban, CheckCircle, Eye, Trash2, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

interface User {
  _id: string
  name: string
  email: string
  role: string
  plan?: string
  status?: string
  createdAt: string
  lastLogin?: string
  coursesCompleted?: number
  learningHours?: number
  aiCreditsUsed?: number
}

export function UserDirectory() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesPlan = planFilter === "all" || user.plan === planFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesPlan && matchesRole
  })

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((u) => u._id))
    }
  }

  const viewUserProfile = (user: User) => {
    setSelectedUser(user)
    setShowUserDialog(true)
  }

  const handleBulkMessage = () => {
    console.log("[v0] Sending message to users:", selectedUsers)
    // TODO: Implement bulk messaging
  }

  const handleBulkSuspend = () => {
    console.log("[v0] Suspending users:", selectedUsers)
    // TODO: Implement bulk suspend
    setSelectedUsers([])
  }

  const handleBulkActivate = () => {
    console.log("[v0] Activating users:", selectedUsers)
    // TODO: Implement bulk activate
    setSelectedUsers([])
  }

  const handleEditUser = (user: User) => {
    console.log("[v0] Editing user:", user._id)
    setEditingUser(user)
    setShowAddUserDialog(true)
  }

  const handleResetPassword = (user: User) => {
    console.log("[v0] Resetting password for user:", user._id)
    // TODO: Implement password reset
  }

  const handleToggleStatus = (user: User) => {
    console.log("[v0] Toggling status for user:", user._id)
    // TODO: Implement status toggle
  }

  const handleDeleteUser = (user: User) => {
    console.log("[v0] Deleting user:", user._id)
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      // TODO: Implement user deletion
      setUsers(users.filter((u) => u._id !== user._id))
      if (selectedUser?._id === user._id) {
        setShowUserDialog(false)
        setSelectedUser(null)
      }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-600'
      case 'mentor':
        return 'bg-blue-600'
      case 'pro':
        return 'bg-purple-600'
      default:
        return 'bg-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">User Directory</h1>
          <p className="mt-2 text-gray-400">Manage all platform users and their permissions ({users.length} total users)</p>
        </div>
        <Button
          className="bg-amber-600 hover:bg-amber-700"
          onClick={() => {
            console.log("[v0] Opening add user dialog")
            setEditingUser(null)
            setShowAddUserDialog(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="Free">Free</SelectItem>
            <SelectItem value="Pro">Pro</SelectItem>
            <SelectItem value="Lifetime">Lifetime</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Mentor">Mentor</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg border border-amber-600 bg-amber-600/10 p-4">
          <span className="text-sm text-gray-100">{selectedUsers.length} users selected</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-100 bg-transparent"
              onClick={handleBulkMessage}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-100 bg-transparent"
              onClick={handleBulkSuspend}
            >
              <Ban className="mr-2 h-4 w-4" />
              Suspend
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-100 bg-transparent"
              onClick={handleBulkActivate}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-800 bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onCheckedChange={toggleAllUsers}
                />
              </TableHead>
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Plan</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Join Date</TableHead>
              <TableHead className="text-gray-300">Last Login</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} className="border-gray-700 hover:bg-gray-700/50">
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onCheckedChange={() => toggleUserSelection(user._id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
                      <AvatarFallback className="bg-gray-700 text-gray-300">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-100">{user.name || 'No name'}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border-gray-600 ${getRoleBadgeColor(user.role)} text-white`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.plan === "Lifetime" || user.plan === "lifetime"
                        ? "bg-amber-600 text-white"
                        : user.plan === "Pro" || user.plan === "pro" || user.plan === "annual" || user.plan === "monthly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 text-white"
                    }
                  >
                    {user.plan || 'Free'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "Active" || user.status === "active" ? "default" : "destructive"}
                    className={user.status === "Active" || user.status === "active" ? "bg-green-600" : ""}
                  >
                    {user.status || 'Active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-gray-400">{user.lastLogin || 'Never'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-gray-700 bg-gray-800">
                      <DropdownMenuItem
                        onClick={() => viewUserProfile(user)}
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-300 hover:bg-gray-700"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-300 hover:bg-gray-700"
                        onClick={() => handleResetPassword(user)}
                      >
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-400 hover:bg-gray-700"
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.status === "Active" ? "Suspend" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-400 hover:bg-gray-700"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-4xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl">User Profile</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="bg-gray-700">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
                <TabsTrigger value="ai">AI Interactions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="mt-1 font-medium text-gray-100">{selectedUser.email}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Role</p>
                    <p className="mt-1 font-medium text-gray-100">{selectedUser.role}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Plan</p>
                    <p className="mt-1 font-medium text-gray-100">{selectedUser.plan}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="mt-1 font-medium text-gray-100">{selectedUser.status}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Courses Completed</p>
                    <p className="mt-1 text-2xl font-bold text-amber-500">{selectedUser.coursesCompleted}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Learning Hours</p>
                    <p className="mt-1 text-2xl font-bold text-amber-500">{selectedUser.learningHours}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activity">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                  <p className="text-gray-400">Activity timeline coming soon</p>
                </div>
              </TabsContent>
              <TabsContent value="payments">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                  <p className="text-gray-400">Payment history coming soon</p>
                </div>
              </TabsContent>
              <TabsContent value="mentorship">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                  <p className="text-gray-400">Mentorship details coming soon</p>
                </div>
              </TabsContent>
              <TabsContent value="ai">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">AI Credits Used</p>
                  <p className="mt-1 text-2xl font-bold text-amber-500">{selectedUser.aiCreditsUsed}</p>
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
                  <textarea
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-100"
                    rows={6}
                    placeholder="Add internal notes about this user..."
                  />
                  <Button className="mt-4 bg-amber-600 hover:bg-amber-700">Save Notes</Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingUser ? "Update user information" : "Create a new user account"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                defaultValue={editingUser?.name}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input
                type="email"
                defaultValue={editingUser?.email}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label className="text-gray-300">Role</Label>
              <Select defaultValue={editingUser?.role || "User"}>
                <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Mentor">Mentor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Plan</Label>
              <Select defaultValue={editingUser?.plan || "Free"}>
                <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddUserDialog(false)} className="border-gray-700">
                Cancel
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  console.log("[v0] Saving user")
                  setShowAddUserDialog(false)
                }}
              >
                {editingUser ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
