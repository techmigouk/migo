"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserPlus, Edit, Trash2, Mail, User, Briefcase, BookOpen, Upload, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/lib/auth-context"

interface Instructor {
  _id: string
  name: string
  email: string
  avatar?: string
  position?: string
  bio?: string
  expertise?: string[]
  createdAt: string
}

export function InstructorManagement() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    bio: "",
    expertise: "",
    avatar: "",
  })

  const { toast } = useToast()
  const { adminToken } = useAdminAuth()

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/instructors", {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setInstructors(data.data)
      } else {
        throw new Error(data.error || "Failed to fetch instructors")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load instructors",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const expertiseArray = formData.expertise
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)

      const response = await fetch("/api/instructors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          avatar: formData.avatar || undefined,
          position: formData.position,
          bio: formData.bio,
          expertise: expertiseArray,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Instructor created successfully",
        })
        setIsDialogOpen(false)
        resetForm()
        fetchInstructors()
      } else {
        throw new Error(data.error || "Failed to create instructor")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create instructor",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingAvatar(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (data.success && data.url) {
        setAvatarPreview(data.url)
        setFormData(prev => ({ ...prev, avatar: data.url }))
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      position: "",
      bio: "",
      expertise: "",
      avatar: "",
    })
    setAvatarPreview("")
    if (avatarRef.current) avatarRef.current.value = ""
    setEditingInstructor(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor)
    setFormData({
      name: instructor.name,
      email: instructor.email,
      password: "", // Don't prefill password for security
      position: instructor.position || "",
      bio: instructor.bio || "",
      expertise: instructor.expertise?.join(", ") || "",
      avatar: instructor.avatar || "",
    })
    setAvatarPreview(instructor.avatar || "")
    setIsDialogOpen(true)
  }

  const handleUpdateInstructor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInstructor) return
    
    setIsCreating(true)

    try {
      const expertiseArray = formData.expertise
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)

      const updateData: any = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar || undefined,
        position: formData.position,
        bio: formData.bio,
        expertise: expertiseArray,
      }

      // Only include password if it was changed
      if (formData.password && formData.password.length >= 6) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/instructors/${editingInstructor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Instructor updated successfully",
        })
        setIsDialogOpen(false)
        resetForm()
        fetchInstructors()
      } else {
        throw new Error(data.error || "Failed to update instructor")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update instructor",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteInstructor = async (instructorId: string) => {
    if (!confirm("Are you sure you want to delete this instructor? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/instructors/${instructorId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Instructor deleted successfully",
        })
        fetchInstructors()
      } else {
        throw new Error(data.error || "Failed to delete instructor")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete instructor",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instructors</h2>
          <p className="text-muted-foreground">
            Manage instructor profiles and course assignments
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Instructor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {instructors && instructors.length > 0 ? (
          instructors.map((instructor) => (
            <Card key={instructor._id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg">
                      {instructor.name}
                    </CardTitle>
                    {instructor.position && (
                      <CardDescription className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {instructor.position}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {instructor.email}
                </div>
                
              {instructor.bio && (
                <p className="text-sm line-clamp-3">{instructor.bio}</p>
              )}

              {instructor.expertise && instructor.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {instructor.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-2 text-xs text-muted-foreground">
                Joined {new Date(instructor.createdAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditInstructor(instructor)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => handleDeleteInstructor(instructor._id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex h-[400px] flex-col items-center justify-center">
              <UserPlus className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No instructors yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first instructor to start managing courses
              </p>
              <Button onClick={openCreateDialog} className="mt-4">
                Add Instructor
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Removed duplicate empty state check */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInstructor ? "Edit Instructor" : "Create New Instructor"}</DialogTitle>
            <DialogDescription>
              {editingInstructor ? "Update instructor profile information" : "Add a new instructor with their profile information and expertise"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={editingInstructor ? handleUpdateInstructor : handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <div className="relative w-24 h-24">
                    <img
                      src={avatarPreview}
                      alt="Instructor avatar"
                      className="w-full h-full rounded-full object-cover border-2 border-gray-700"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={avatarRef}
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    disabled={uploadingAvatar}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: Square image, max 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password {editingInstructor ? "(leave blank to keep current)" : "*"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingInstructor ? "Enter new password to change" : "Secure password"}
                required={!editingInstructor}
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position / Designation</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Senior Software Engineer, PhD Researcher, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief professional background and teaching philosophy..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Areas of Expertise</Label>
              <Input
                id="expertise"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                placeholder="JavaScript, React, Node.js, Python (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Enter skills separated by commas
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingInstructor ? "Update Instructor" : "Create Instructor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
