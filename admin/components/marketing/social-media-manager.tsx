"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, ThumbsUp, MessageCircle, Share2, Eye, TrendingUp } from "lucide-react"

interface SocialPost {
  id: string
  platform: "twitter" | "facebook" | "linkedin" | "instagram"
  content: string
  status: "published" | "scheduled" | "draft"
  publishDate: string
  likes: number
  comments: number
  shares: number
  reach: number
}

const mockPosts: SocialPost[] = [
  {
    id: "1",
    platform: "twitter",
    content: "🚀 New course alert! Master React 19 with our comprehensive guide. Early bird discount available!",
    status: "published",
    publishDate: "2024-03-15",
    likes: 342,
    comments: 45,
    shares: 67,
    reach: 12500,
  },
  {
    id: "2",
    platform: "linkedin",
    content: "Excited to announce our partnership with leading tech companies for exclusive mentorship programs!",
    status: "published",
    publishDate: "2024-03-14",
    likes: 567,
    comments: 89,
    shares: 123,
    reach: 25000,
  },
  {
    id: "3",
    platform: "facebook",
    content: "Join our free webinar on TypeScript best practices this Friday at 2 PM EST!",
    status: "scheduled",
    publishDate: "2024-03-18",
    likes: 0,
    comments: 0,
    shares: 0,
    reach: 0,
  },
]

const platformColors = {
  twitter: "bg-blue-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  instagram: "bg-pink-600",
}

export function SocialMediaManager() {
  const [createPostOpen, setCreatePostOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Social Media Management</h1>
          <p className="mt-2 text-gray-400">Manage your social media presence</p>
        </div>
        <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Create Social Media Post</DialogTitle>
              <DialogDescription className="text-gray-400">Compose and schedule your post</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-gray-300">
                  Platform
                </Label>
                <Select defaultValue="twitter">
                  <SelectTrigger id="platform" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="all">All Platforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-content" className="text-gray-300">
                  Post Content
                </Label>
                <Textarea
                  id="post-content"
                  placeholder="What's on your mind?"
                  rows={6}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
                <p className="text-sm text-gray-500">0 / 280 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-date" className="text-gray-300">
                  Schedule Date (Optional)
                </Label>
                <input
                  id="schedule-date"
                  type="datetime-local"
                  className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700">Publish Now</Button>
                <Button variant="outline" className="flex-1 border-gray-700 bg-gray-900 text-gray-100">
                  Schedule Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">125K</div>
            <p className="mt-1 text-xs text-green-500">+22.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">8.4%</div>
            <p className="mt-1 text-xs text-green-500">+1.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Posts</CardTitle>
            <MessageCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">156</div>
            <p className="mt-1 text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">24</div>
            <p className="mt-1 text-xs text-gray-500">Upcoming posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-amber-600">
            All Posts
          </TabsTrigger>
          <TabsTrigger value="published" className="data-[state=active]:bg-amber-600">
            Published
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-amber-600">
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="drafts" className="data-[state=active]:bg-amber-600">
            Drafts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockPosts.map((post) => (
            <Card key={post.id} className="border-gray-800 bg-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={platformColors[post.platform]}>
                        {post.platform}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={post.status === "published" ? "bg-green-600" : "bg-blue-600"}
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{post.publishDate}</span>
                  </div>

                  <p className="text-gray-100">{post.content}</p>

                  {post.status === "published" && (
                    <div className="grid grid-cols-4 gap-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-semibold text-gray-100">{post.likes}</div>
                          <div className="text-xs text-gray-500">Likes</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-semibold text-gray-100">{post.comments}</div>
                          <div className="text-xs text-gray-500">Comments</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-semibold text-gray-100">{post.shares}</div>
                          <div className="text-xs text-gray-500">Shares</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-semibold text-gray-100">{post.reach.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Reach</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-700 bg-gray-900 text-gray-100">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-700 bg-gray-900 text-gray-100">
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="published">
          <Card className="border-gray-800 bg-gray-800">
            <CardContent className="pt-6">
              <p className="text-center text-gray-400">Published posts will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="border-gray-800 bg-gray-800">
            <CardContent className="pt-6">
              <p className="text-center text-gray-400">Scheduled posts will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card className="border-gray-800 bg-gray-800">
            <CardContent className="pt-6">
              <p className="text-center text-gray-400">Draft posts will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
