"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MessageSquare, ThumbsUp, Eye, Pin, Lock, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ForumPost {
  id: string
  title: string
  author: string
  category: string
  content: string
  replies: number
  likes: number
  views: number
  status: "Active" | "Pinned" | "Locked" | "Deleted"
  createdAt: string
}

const mockPosts: ForumPost[] = [
  {
    id: "1",
    title: "How to optimize React performance?",
    author: "John Doe",
    category: "React",
    content: "I'm working on a large React application and noticing some performance issues...",
    replies: 24,
    likes: 45,
    views: 320,
    status: "Active",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Best practices for TypeScript generics",
    author: "Jane Smith",
    category: "TypeScript",
    content: "Can someone explain the best way to use generics in TypeScript?",
    replies: 18,
    likes: 32,
    views: 256,
    status: "Pinned",
    createdAt: "2024-03-14",
  },
  {
    id: "3",
    title: "Python vs JavaScript for backend",
    author: "Mike Johnson",
    category: "General",
    content: "What are the pros and cons of using Python vs JavaScript for backend development?",
    replies: 56,
    likes: 89,
    views: 542,
    status: "Active",
    createdAt: "2024-03-13",
  },
  {
    id: "4",
    title: "Course suggestion: Advanced Data Structures",
    author: "Sarah Williams",
    category: "Suggestions",
    content: "Would love to see a course on advanced data structures and algorithms...",
    replies: 12,
    likes: 28,
    views: 145,
    status: "Active",
    createdAt: "2024-03-12",
  },
]

export function ForumManagement() {
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null)

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: ForumPost["status"]) => {
    const colors = {
      Active: "bg-green-600",
      Pinned: "bg-amber-600",
      Locked: "bg-gray-600",
      Deleted: "bg-red-600",
    }
    return colors[status]
  }

  const handleCreateAnnouncement = () => {
    console.log("[v0] Opening create announcement dialog")
    setEditingPost(null)
    setShowAnnouncementDialog(true)
  }

  const handlePinPost = (post: ForumPost) => {
    console.log("[v0] Pinning post:", post.id)
    setPosts(posts.map((p) => (p.id === post.id ? { ...p, status: "Pinned" as const } : p)))
  }

  const handleLockPost = (post: ForumPost) => {
    console.log("[v0] Locking post:", post.id)
    setPosts(posts.map((p) => (p.id === post.id ? { ...p, status: "Locked" as const } : p)))
  }

  const handleViewPostDetails = (post: ForumPost) => {
    console.log("[v0] Viewing post details:", post.id)
    setEditingPost(post)
    setShowAnnouncementDialog(true)
  }

  const handleDeletePost = (post: ForumPost) => {
    console.log("[v0] Deleting post:", post.id)
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      setPosts(posts.filter((p) => p.id !== post.id))
    }
  }

  const handleSaveAnnouncement = () => {
    console.log("[v0] Saving announcement:", editingPost ? "edit" : "create")
    setShowAnnouncementDialog(false)
    setEditingPost(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Forum Posts</h2>
          <p className="mt-1 text-gray-400">Manage community discussions and posts</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleCreateAnnouncement}>
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-gray-100"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="React">React</SelectItem>
            <SelectItem value="TypeScript">TypeScript</SelectItem>
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="Suggestions">Suggestions</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pinned">Pinned</SelectItem>
            <SelectItem value="Locked">Locked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-100">{post.title}</h3>
                    <Badge className={getStatusBadge(post.status)}>{post.status}</Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.author}</span>
                    </div>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <Pin className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-gray-700 bg-gray-800">
                    <DropdownMenuItem className="text-gray-300" onClick={() => handlePinPost(post)}>
                      <Pin className="mr-2 h-4 w-4" />
                      {post.status === "Pinned" ? "Unpin Post" : "Pin Post"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300" onClick={() => handleLockPost(post)}>
                      <Lock className="mr-2 h-4 w-4" />
                      {post.status === "Locked" ? "Unlock Post" : "Lock Post"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300" onClick={() => handleViewPostDetails(post)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400" onClick={() => handleDeletePost(post)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">{post.content}</p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.replies} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create Announcement"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingPost ? "Update post details" : "Create a new announcement for the community"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Title</Label>
              <Input
                defaultValue={editingPost?.title}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="Announcement title..."
              />
            </div>
            <div>
              <Label className="text-gray-300">Category</Label>
              <Select defaultValue={editingPost?.category || "General"}>
                <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="React">React</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Suggestions">Suggestions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Content</Label>
              <Textarea
                defaultValue={editingPost?.content}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="Write your announcement..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)} className="border-gray-700">
                Cancel
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSaveAnnouncement}>
                {editingPost ? "Update Post" : "Create Announcement"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
