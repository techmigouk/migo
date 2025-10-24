"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Users, TrendingUp, DollarSign, Target } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  source: "website" | "referral" | "social" | "paid-ad" | "event"
  score: number
  value: number
  createdDate: string
  lastContact?: string
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Corp",
    status: "qualified",
    source: "website",
    score: 85,
    value: 5000,
    createdDate: "2024-03-10",
    lastContact: "2024-03-14",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@startup.io",
    phone: "+1 (555) 234-5678",
    company: "Startup Inc",
    status: "contacted",
    source: "referral",
    score: 72,
    value: 3500,
    createdDate: "2024-03-12",
    lastContact: "2024-03-13",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 (555) 345-6789",
    status: "new",
    source: "social",
    score: 45,
    value: 1200,
    createdDate: "2024-03-15",
  },
]

export function CRMLeads() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [addLeadOpen, setAddLeadOpen] = useState(false)

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">CRM & Lead Management</h1>
          <p className="mt-2 text-gray-400">Track and manage your sales pipeline</p>
        </div>
        <Dialog open={addLeadOpen} onOpenChange={setAddLeadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Add New Lead</DialogTitle>
              <DialogDescription className="text-gray-400">Enter lead information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lead-name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input id="lead-name" placeholder="John Doe" className="border-gray-700 bg-gray-900 text-gray-100" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="john@example.com"
                    className="border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lead-phone" className="text-gray-300">
                    Phone
                  </Label>
                  <Input
                    id="lead-phone"
                    placeholder="+1 (555) 123-4567"
                    className="border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-company" className="text-gray-300">
                    Company
                  </Label>
                  <Input
                    id="lead-company"
                    placeholder="Company Name"
                    className="border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lead-source" className="text-gray-300">
                    Lead Source
                  </Label>
                  <Select defaultValue="website">
                    <SelectTrigger id="lead-source" className="border-gray-700 bg-gray-900 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="paid-ad">Paid Ad</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-value" className="text-gray-300">
                    Estimated Value ($)
                  </Label>
                  <Input
                    id="lead-value"
                    type="number"
                    placeholder="5000"
                    className="border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-notes" className="text-gray-300">
                  Notes
                </Label>
                <Textarea
                  id="lead-notes"
                  placeholder="Add any relevant notes..."
                  rows={4}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700">Add Lead</Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                  onClick={() => setAddLeadOpen(false)}
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
            <CardTitle className="text-sm font-medium text-gray-400">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">1,234</div>
            <p className="mt-1 text-xs text-green-500">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Qualified Leads</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">456</div>
            <p className="mt-1 text-xs text-gray-500">37% of total</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">24.5%</div>
            <p className="mt-1 text-xs text-green-500">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">$245K</div>
            <p className="mt-1 text-xs text-green-500">+18.7% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-800 bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-700 bg-gray-900 pl-10 text-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-gray-700 bg-gray-900 text-gray-100">
                Export Leads
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">All Leads</CardTitle>
          <CardDescription className="text-gray-400">Manage your sales pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Lead</TableHead>
                <TableHead className="text-gray-400">Company</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Source</TableHead>
                <TableHead className="text-gray-400">Score</TableHead>
                <TableHead className="text-gray-400">Value</TableHead>
                <TableHead className="text-gray-400">Created</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gray-700 text-gray-300">
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-100">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{lead.company || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        lead.status === "qualified"
                          ? "bg-green-600"
                          : lead.status === "converted"
                            ? "bg-blue-600"
                            : lead.status === "lost"
                              ? "bg-red-600"
                              : "bg-gray-600"
                      }
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-700">
                      {lead.source}
                    </Badge>
                  </TableCell>
                  <TableCell className={getScoreColor(lead.score)}>{lead.score}/100</TableCell>
                  <TableCell className="font-semibold text-amber-500">${lead.value.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-400">{lead.createdDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-amber-500 hover:bg-gray-700 hover:text-amber-400">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
