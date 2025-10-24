"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Bot, Plus, MessageSquare, Database, TrendingUp } from "lucide-react"

interface KnowledgeBase {
  id: string
  name: string
  description: string
  documents: number
  lastUpdated: string
  status: "active" | "training" | "inactive"
}

interface AIInteraction {
  id: string
  user: string
  question: string
  response: string
  timestamp: string
  helpful: boolean | null
  category: string
}

const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: "1",
    name: "Course Content KB",
    description: "All course materials, lessons, and resources",
    documents: 1234,
    lastUpdated: "2024-03-15",
    status: "active",
  },
  {
    id: "2",
    name: "Platform Help KB",
    description: "FAQs, troubleshooting, and platform guides",
    documents: 456,
    lastUpdated: "2024-03-14",
    status: "active",
  },
  {
    id: "3",
    name: "Community Q&A KB",
    description: "User-generated questions and answers",
    documents: 2341,
    lastUpdated: "2024-03-13",
    status: "training",
  },
]

const mockInteractions: AIInteraction[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    question: "How do I reset my password?",
    response: "To reset your password, click on 'Forgot Password' on the login page...",
    timestamp: "2024-03-15 14:32",
    helpful: true,
    category: "Account",
  },
  {
    id: "2",
    user: "Michael Chen",
    question: "What's the difference between Pro and Enterprise plans?",
    response: "The Pro plan includes access to all courses and basic support...",
    timestamp: "2024-03-15 13:45",
    helpful: true,
    category: "Billing",
  },
  {
    id: "3",
    user: "Emily Rodriguez",
    question: "How do I download course materials?",
    response: "Course materials can be downloaded from the Resources tab...",
    timestamp: "2024-03-15 12:18",
    helpful: null,
    category: "Courses",
  },
]

export function AIAssistant() {
  const [createKBOpen, setCreateKBOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">AI Assistant & Knowledge Base</h1>
          <p className="mt-2 text-gray-400">Manage AI-powered support and knowledge bases</p>
        </div>
        <Dialog open={createKBOpen} onOpenChange={setCreateKBOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Knowledge Base
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Create Knowledge Base</DialogTitle>
              <DialogDescription className="text-gray-400">Set up a new AI knowledge base</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kb-name" className="text-gray-300">
                  Knowledge Base Name
                </Label>
                <Input
                  id="kb-name"
                  placeholder="e.g., Product Documentation"
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kb-description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="kb-description"
                  placeholder="Describe what this knowledge base covers..."
                  rows={3}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kb-source" className="text-gray-300">
                  Data Source
                </Label>
                <Select defaultValue="manual">
                  <SelectTrigger id="kb-source" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="manual">Manual Upload</SelectItem>
                    <SelectItem value="url">Website Scraping</SelectItem>
                    <SelectItem value="api">API Integration</SelectItem>
                    <SelectItem value="database">Database Query</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700">Create & Train</Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                  onClick={() => setCreateKBOpen(false)}
                >
                  Cancel
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
            <CardTitle className="text-sm font-medium text-gray-400">Total Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">12,543</div>
            <p className="mt-1 text-xs text-green-500">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">87.3%</div>
            <p className="mt-1 text-xs text-green-500">+5.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Response Time</CardTitle>
            <Bot className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">1.2s</div>
            <p className="mt-1 text-xs text-gray-500">Instant responses</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Knowledge Bases</CardTitle>
            <Database className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">3</div>
            <p className="mt-1 text-xs text-gray-500">4,031 total documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="knowledge-bases" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="knowledge-bases" className="data-[state=active]:bg-amber-600">
            Knowledge Bases
          </TabsTrigger>
          <TabsTrigger value="interactions" className="data-[state=active]:bg-amber-600">
            Recent Interactions
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-amber-600">
            AI Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge-bases" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Knowledge Bases</CardTitle>
              <CardDescription className="text-gray-400">Manage AI training data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Description</TableHead>
                    <TableHead className="text-gray-400">Documents</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Last Updated</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockKnowledgeBases.map((kb) => (
                    <TableRow key={kb.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium text-gray-100">{kb.name}</TableCell>
                      <TableCell className="text-gray-300">{kb.description}</TableCell>
                      <TableCell className="text-gray-300">{kb.documents.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            kb.status === "active"
                              ? "bg-green-600"
                              : kb.status === "training"
                                ? "bg-blue-600"
                                : "bg-gray-600"
                          }
                        >
                          {kb.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{kb.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-500 hover:bg-gray-700 hover:text-amber-400"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500 hover:bg-gray-700 hover:text-blue-400"
                          >
                            Train
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Recent AI Interactions</CardTitle>
              <CardDescription className="text-gray-400">Monitor AI assistant conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInteractions.map((interaction) => (
                <div key={interaction.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-100">{interaction.user}</div>
                      <div className="text-sm text-gray-500">{interaction.timestamp}</div>
                    </div>
                    <Badge variant="secondary" className="bg-gray-700">
                      {interaction.category}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium text-gray-400">Question:</div>
                      <div className="text-gray-100">{interaction.question}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-400">AI Response:</div>
                      <div className="text-gray-300">{interaction.response}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Was this helpful?</span>
                    {interaction.helpful === true && (
                      <Badge variant="default" className="bg-green-600">
                        Yes
                      </Badge>
                    )}
                    {interaction.helpful === false && (
                      <Badge variant="default" className="bg-red-600">
                        No
                      </Badge>
                    )}
                    {interaction.helpful === null && (
                      <Badge variant="secondary" className="bg-gray-600">
                        No feedback
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">AI Configuration</CardTitle>
              <CardDescription className="text-gray-400">Configure AI assistant behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model" className="text-gray-300">
                  AI Model
                </Label>
                <Select defaultValue="gpt-4">
                  <SelectTrigger id="ai-model" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="gpt-4">GPT-4 (Most Accurate)</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5 (Faster)</SelectItem>
                    <SelectItem value="claude">Claude 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-gray-300">
                  Response Creativity (Temperature)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  defaultValue="0.7"
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
                <p className="text-sm text-gray-500">0 = Precise, 1 = Creative</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens" className="text-gray-300">
                  Max Response Length (Tokens)
                </Label>
                <Input
                  id="max-tokens"
                  type="number"
                  defaultValue="500"
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback" className="text-gray-300">
                  Fallback Behavior
                </Label>
                <Select defaultValue="human">
                  <SelectTrigger id="fallback" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="human">Escalate to Human Support</SelectItem>
                    <SelectItem value="retry">Retry with Different Approach</SelectItem>
                    <SelectItem value="generic">Show Generic Help Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
