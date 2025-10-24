"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Handshake, TrendingUp, DollarSign, Users, Search, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Partner {
  id: string
  name: string
  type: "Corporate" | "Educational" | "Technology" | "Content"
  status: "active" | "pending" | "inactive"
  since: string
  revenue: number
  students: number
  courses: number
  contactPerson: string
  email: string
}

interface Partnership {
  id: string
  partner: string
  type: string
  startDate: string
  endDate: string
  value: number
  status: "active" | "expired" | "pending"
  terms: string
}

const mockPartners: Partner[] = [
  {
    id: "1",
    name: "TechCorp Inc.",
    type: "Corporate",
    status: "active",
    since: "2024-01-15",
    revenue: 125000,
    students: 450,
    courses: 12,
    contactPerson: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
  },
  {
    id: "2",
    name: "State University",
    type: "Educational",
    status: "active",
    since: "2023-09-01",
    revenue: 89000,
    students: 1200,
    courses: 8,
    contactPerson: "Dr. Michael Chen",
    email: "m.chen@stateuniv.edu",
  },
  {
    id: "3",
    name: "CloudTech Solutions",
    type: "Technology",
    status: "active",
    since: "2024-03-20",
    revenue: 67000,
    students: 320,
    courses: 6,
    contactPerson: "Alex Martinez",
    email: "alex@cloudtech.io",
  },
  {
    id: "4",
    name: "Content Creators Guild",
    type: "Content",
    status: "pending",
    since: "2025-01-10",
    revenue: 0,
    students: 0,
    courses: 0,
    contactPerson: "Emma Wilson",
    email: "emma@ccguild.com",
  },
]

const mockPartnerships: Partnership[] = [
  {
    id: "1",
    partner: "TechCorp Inc.",
    type: "Enterprise License",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    value: 150000,
    status: "active",
    terms: "Unlimited seats, custom branding, dedicated support",
  },
  {
    id: "2",
    partner: "State University",
    type: "Educational Partnership",
    startDate: "2023-09-01",
    endDate: "2024-08-31",
    value: 100000,
    status: "expired",
    terms: "Student access, faculty training, curriculum integration",
  },
  {
    id: "3",
    partner: "CloudTech Solutions",
    type: "Technology Integration",
    startDate: "2024-03-20",
    endDate: "2025-03-19",
    value: 75000,
    status: "active",
    terms: "API access, co-marketing, revenue share",
  },
]

export function PartnershipsManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-500/10 text-green-500 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      expired: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return <Badge className={variants[status] || "bg-gray-500/10 text-gray-400"}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      Corporate: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Educational: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Technology: "bg-amber-600/10 text-amber-500 border-amber-600/20",
      Content: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    }
    return <Badge className={variants[type] || "bg-gray-500/10 text-gray-400"}>{type}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Partnerships & Collaborations</h1>
        <p className="mt-2 text-gray-400">
          Manage corporate partnerships, educational institutions, and collaborations
        </p>
      </div>

      {/* Partnership Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">3</div>
              <Handshake className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-green-500">+1 this quarter</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">$281K</div>
              <DollarSign className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-green-500">+18.2% from last year</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Partner Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">1,970</div>
              <Users className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-gray-400">Across all partners</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Deal Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">$93.7K</div>
              <TrendingUp className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-green-500">+12% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="partners" className="data-[state=active]:bg-amber-600">
            Partners
          </TabsTrigger>
          <TabsTrigger value="agreements" className="data-[state=active]:bg-amber-600">
            Agreements
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-amber-600">
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Partners */}
        <TabsContent value="partners" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-100">Partner Directory</CardTitle>
                  <CardDescription className="text-gray-400">Manage all partnership relationships</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Partner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-gray-700 bg-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-gray-100">Add New Partner</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Create a new partnership relationship
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-100">Partner Name</Label>
                        <Input placeholder="Enter partner name" className="border-gray-700 bg-gray-900 text-gray-100" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-100">Partner Type</Label>
                        <Select>
                          <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-700 bg-gray-800">
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="educational">Educational</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="content">Content</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-100">Contact Person</Label>
                        <Input placeholder="Enter contact name" className="border-gray-700 bg-gray-900 text-gray-100" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-100">Email</Label>
                        <Input
                          type="email"
                          placeholder="contact@partner.com"
                          className="border-gray-700 bg-gray-900 text-gray-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-100">Notes</Label>
                        <Textarea
                          placeholder="Additional information about the partnership..."
                          className="border-gray-700 bg-gray-900 text-gray-100"
                        />
                      </div>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">Create Partner</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search partners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-gray-700 bg-gray-900 pl-10 text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {mockPartners.map((partner) => (
                  <div key={partner.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-100">{partner.name}</h3>
                          {getTypeBadge(partner.type)}
                          {getStatusBadge(partner.status)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>
                            Contact: {partner.contactPerson} ({partner.email})
                          </p>
                          <p>Partner since: {partner.since}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 border-t border-gray-800 pt-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-gray-400">Revenue</p>
                        <p className="text-lg font-semibold text-gray-100">${partner.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Students</p>
                        <p className="text-lg font-semibold text-gray-100">{partner.students}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Courses</p>
                        <p className="text-lg font-semibold text-gray-100">{partner.courses}</p>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agreements */}
        <TabsContent value="agreements" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Partnership Agreements</CardTitle>
              <CardDescription className="text-gray-400">Track all partnership contracts and terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Partner</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Type</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Start Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">End Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Value</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Status</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPartnerships.map((agreement) => (
                      <tr key={agreement.id} className="border-b border-gray-800">
                        <td className="py-4 text-sm font-medium text-gray-100">{agreement.partner}</td>
                        <td className="py-4 text-sm text-gray-300">{agreement.type}</td>
                        <td className="py-4 text-sm text-gray-300">{agreement.startDate}</td>
                        <td className="py-4 text-sm text-gray-300">{agreement.endDate}</td>
                        <td className="py-4 text-sm font-medium text-gray-100">${agreement.value.toLocaleString()}</td>
                        <td className="py-4">{getStatusBadge(agreement.status)}</td>
                        <td className="py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Partnership Performance</CardTitle>
              <CardDescription className="text-gray-400">
                Analyze partnership ROI and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockPartners
                  .filter((p) => p.status === "active")
                  .map((partner) => (
                    <div key={partner.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-100">{partner.name}</h3>
                        {getTypeBadge(partner.type)}
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-gray-400">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-100">${partner.revenue.toLocaleString()}</p>
                          <p className="text-xs text-green-500">+15% from last quarter</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Active Students</p>
                          <p className="text-2xl font-bold text-gray-100">{partner.students}</p>
                          <p className="text-xs text-green-500">+8% growth</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Course Completion</p>
                          <p className="text-2xl font-bold text-gray-100">72%</p>
                          <p className="text-xs text-gray-400">Above average</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
