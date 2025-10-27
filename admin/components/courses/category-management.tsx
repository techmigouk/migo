"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2, FolderPlus, Edit, Trash2, FolderOpen, Grid3x3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/lib/auth-context"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  icon?: string
  order: number
  isActive: boolean
  createdAt: string
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    order: 0,
    isActive: true,
  })

  const { toast } = useToast()
  const { adminToken } = useAdminAuth()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/categories", {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
      })
      const data = await response.json()
      
      console.log('Fetch categories response:', data)
      
      if (data.success && data.categories) {
        setCategories(data.categories)
      } else {
        throw new Error(data.error || "Failed to fetch categories")
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== CATEGORY CREATION START ===')
    console.log('Form data:', formData)
    console.log('Admin token present:', !!adminToken)
    console.log('Admin token value:', adminToken ? `${adminToken.substring(0, 20)}...` : 'MISSING')
    
    // Validate form data on frontend
    if (!formData.name || formData.name.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }
    
    if (!adminToken) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create categories",
        variant: "destructive",
      })
      return
    }
    
    setIsCreating(true)

    try {
      console.log('Sending POST request to /api/categories')
      console.log('Request URL:', window.location.origin + "/api/categories")
      console.log('Request body:', JSON.stringify(formData))
      
      let response
      try {
        response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`,
          },
          body: JSON.stringify(formData),
        })
        console.log('✅ Fetch completed')
      } catch (fetchError) {
        console.error('❌ Fetch failed with network error:', fetchError)
        throw new Error('Network error: Unable to connect to server. Is the API running?')
      }

      console.log('Response received - Status:', response.status, response.statusText)
      
      let data
      try {
        data = await response.json()
        console.log('Response data:', data)
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError)
        throw new Error('Invalid server response')
      }

      if (response.ok && data.success) {
        console.log('Category created successfully!')
        toast({
          title: "Success",
          description: "Category created successfully",
        })
        setIsDialogOpen(false)
        resetForm()
        await fetchCategories()
      } else {
        console.error('Server returned error:', data.error)
        throw new Error(data.error || `Failed to create category (Status: ${response.status})`)
      }
    } catch (error: any) {
      console.error('=== CATEGORY CREATION ERROR ===')
      console.error('Error details:', error)
      console.error('Error message:', error.message)
      toast({
        title: "Error",
        description: error.message || "Failed to create category. Please check console for details.",
        variant: "destructive",
      })
    } finally {
      console.log('=== CATEGORY CREATION END ===')
      console.log('Setting isCreating to false')
      setIsCreating(false)
      
      // Safety timeout to ensure state is reset
      setTimeout(() => {
        console.log('Safety timeout: ensuring isCreating is false')
        setIsCreating(false)
      }, 1000)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      order: 0,
      isActive: true,
    })
    setEditingCategory(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      order: category.order,
      isActive: category.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    
    if (!formData.name || formData.name.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }
    
    setIsCreating(true)

    try {
      const response = await fetch(`/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
        setIsDialogOpen(false)
        resetForm()
        await fetchCategories()
      } else {
        throw new Error(data.error || "Failed to update category")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        await fetchCategories()
      } else {
        throw new Error(data.error || "Failed to delete category")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
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
          <h2 className="text-3xl font-bold tracking-tight">Course Categories</h2>
          <p className="text-muted-foreground">
            Organize courses into categories for better navigation
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {category.icon ? (
                        <span className="text-xl">{category.icon}</span>
                      ) : (
                        <FolderOpen className="h-5 w-5" />
                      )}
                      {category.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs">Order: {category.order}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {category.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {category.slug}
                </code>
                <div className="text-xs text-muted-foreground">
                  {new Date(category.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => handleDeleteCategory(category._id)}
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
              <FolderPlus className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No categories yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first category to organize courses
              </p>
              <Button onClick={openCreateDialog} className="mt-4">
                Add Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category information" : "Add a new category to organize your courses"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={editingCategory ? handleUpdateCategory : handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Web Development, Data Science, etc."
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Slug will be auto-generated from the name
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the category..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="💻 🎨 📊"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (visible to users)
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log('Cancel button clicked')
                  setIsDialogOpen(false)
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isCreating}
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreating ? (editingCategory ? 'Updating...' : 'Creating...') : (editingCategory ? 'Update Category' : 'Create Category')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
