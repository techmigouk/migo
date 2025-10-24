"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Upload, ImageIcon, Video, FileText, Download, Trash2 } from "lucide-react"

interface MediaFile {
  id: string
  name: string
  type: "image" | "video" | "document"
  size: string
  uploadedAt: string
  usedIn: string[]
}

const mockMedia: MediaFile[] = [
  {
    id: "1",
    name: "react-thumbnail.jpg",
    type: "image",
    size: "245 KB",
    uploadedAt: "2024-01-15",
    usedIn: ["React Fundamentals"],
  },
  {
    id: "2",
    name: "intro-video.mp4",
    type: "video",
    size: "45 MB",
    uploadedAt: "2024-01-20",
    usedIn: ["React Fundamentals", "Advanced TypeScript"],
  },
  {
    id: "3",
    name: "course-syllabus.pdf",
    type: "document",
    size: "1.2 MB",
    uploadedAt: "2024-02-01",
    usedIn: ["Python for Data Science"],
  },
]

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaFile[]>(mockMedia)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  const filteredMedia = media.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || file.type === typeFilter
    return matchesSearch && matchesType
  })

  const getFileIcon = (type: MediaFile["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      case "video":
        return <Video className="h-8 w-8 text-purple-500" />
      case "document":
        return <FileText className="h-8 w-8 text-green-500" />
    }
  }

  const handleUploadMedia = () => {
    console.log("[v0] Opening upload media dialog")
    setShowUploadDialog(true)
  }

  const handleDownload = (file: MediaFile) => {
    console.log("[v0] Downloading file:", file.name)
  }

  const handleDelete = (file: MediaFile) => {
    console.log("[v0] Deleting file:", file.id)
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      setMedia(media.filter((m) => m.id !== file.id))
    }
  }

  const handleSaveUpload = () => {
    console.log("[v0] Uploading media file")
    setShowUploadDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Media Library</h2>
          <p className="mt-1 text-gray-400">Manage course images, videos, and documents</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleUploadMedia}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-gray-100"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMedia.map((file) => (
          <Card key={file.id} className="border-gray-700 bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-700">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-100 truncate">{file.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{file.size}</p>
                  <p className="mt-1 text-xs text-gray-500">Uploaded {file.uploadedAt}</p>
                  {file.usedIn.length > 0 && (
                    <div className="mt-2">
                      <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        Used in {file.usedIn.length} course{file.usedIn.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 bg-transparent"
                  onClick={() => handleDownload(file)}
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-700 text-red-400 bg-transparent"
                  onClick={() => handleDelete(file)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Upload Media</DialogTitle>
            <DialogDescription className="text-gray-400">Upload images, videos, or documents</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">File Type</Label>
              <Select defaultValue="image">
                <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">File</Label>
              <div className="flex items-center gap-2">
                <Input type="file" className="border-gray-700 bg-gray-900 text-gray-100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">File Name</Label>
              <Input placeholder="Enter file name..." className="border-gray-700 bg-gray-900 text-gray-100" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleSaveUpload}>
                Upload
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                onClick={() => setShowUploadDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
