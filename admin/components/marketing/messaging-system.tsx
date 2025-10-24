"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Switch } from "@/components/ui/switch"
import { Mail, Send, Bell, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react"

interface Message {
  id: string
  type: "email" | "push" | "sms" | "in-app"
  subject: string
  recipients: number
  status: "draft" | "scheduled" | "sent" | "failed"
  sentDate?: string
  scheduledDate?: string
  openRate?: number
  clickRate?: number
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "email",
    subject: "New Course Launch: Advanced React Patterns",
    recipients: 5432,
    status: "sent",
    sentDate: "2024-03-15",
    openRate: 42.5,
    clickRate: 12.3,
  },
  {
    id: "2",
    type: "push",
    subject: "Complete your course to earn a badge!",
    recipients: 2341,
    status: "sent",
    sentDate: "2024-03-14",
    openRate: 68.2,
    clickRate: 24.1,
  },
  {
    id: "3",
    type: "email",
    subject: "Weekly Progress Report",
    recipients: 8765,
    status: "scheduled",
    scheduledDate: "2024-03-20",
  },
]

export function MessagingSystem() {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [composeOpen, setComposeOpen] = useState(false)

  const filteredMessages = mockMessages.filter((msg) => selectedType === "all" || msg.type === selectedType)

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Messaging & Notifications</h1>
          <p className="mt-2 text-gray-400">Manage all communication channels</p>
        </div>
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Send className="mr-2 h-4 w-4" />
              Compose Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Compose New Message</DialogTitle>
              <DialogDescription className="text-gray-400">Create and send messages to your users</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message-type" className="text-gray-300">
                  Message Type
                </Label>
                <Select defaultValue="email">
                  <SelectTrigger id="message-type" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="in-app">In-App Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients" className="text-gray-300">
                  Recipients
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger id="recipients" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="inactive">Inactive Users</SelectItem>
                    <SelectItem value="pro">Pro Subscribers</SelectItem>
                    <SelectItem value="custom">Custom Segment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-300">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Enter message subject..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-300">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message..."
                  rows={6}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
                <div>
                  <Label htmlFor="schedule" className="text-gray-300">
                    Schedule for later
                  </Label>
                  <p className="text-sm text-gray-500">Send this message at a specific time</p>
                </div>
                <Switch id="schedule" />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700">Send Now</Button>
                <Button variant="outline" className="flex-1 border-gray-700 bg-gray-900 text-gray-100">
                  Save Draft
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
            <CardTitle className="text-sm font-medium text-gray-400">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">45,231</div>
            <p className="mt-1 text-xs text-green-500">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Open Rate</CardTitle>
            <Bell className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">48.3%</div>
            <p className="mt-1 text-xs text-green-500">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Click Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">15.7%</div>
            <p className="mt-1 text-xs text-red-500">-1.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">12</div>
            <p className="mt-1 text-xs text-gray-500">Pending messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-100">Message History</CardTitle>
              <CardDescription className="text-gray-400">View and manage all sent messages</CardDescription>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px] border-gray-700 bg-gray-900 text-gray-100">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="in-app">In-App</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Subject</TableHead>
                <TableHead className="text-gray-400">Recipients</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Open Rate</TableHead>
                <TableHead className="text-gray-400">Click Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-700">
                      {message.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-100">{message.subject}</TableCell>
                  <TableCell className="text-gray-300">{message.recipients.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(message.status)}
                      <span className="text-gray-300">{message.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{message.sentDate || message.scheduledDate}</TableCell>
                  <TableCell className="text-gray-300">{message.openRate ? `${message.openRate}%` : "—"}</TableCell>
                  <TableCell className="text-gray-300">{message.clickRate ? `${message.clickRate}%` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
