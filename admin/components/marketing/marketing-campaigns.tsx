"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Megaphone, Plus, TrendingUp, Users, DollarSign } from "lucide-react"

interface Campaign {
  id: string
  name: string
  type: "email" | "social" | "paid-ads" | "referral"
  status: "active" | "paused" | "completed" | "draft"
  startDate: string
  endDate?: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  roi: number
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Spring Course Launch 2024",
    type: "email",
    status: "active",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    budget: 5000,
    spent: 3200,
    impressions: 45000,
    clicks: 2340,
    conversions: 234,
    roi: 3.2,
  },
  {
    id: "2",
    name: "Social Media Awareness Campaign",
    type: "social",
    status: "active",
    startDate: "2024-03-10",
    endDate: "2024-04-10",
    budget: 3000,
    spent: 1200,
    impressions: 120000,
    clicks: 4500,
    conversions: 156,
    roi: 2.8,
  },
  {
    id: "3",
    name: "Google Ads - React Course",
    type: "paid-ads",
    status: "paused",
    startDate: "2024-02-15",
    endDate: "2024-03-15",
    budget: 8000,
    spent: 8000,
    impressions: 250000,
    clicks: 8900,
    conversions: 445,
    roi: 4.1,
  },
]

export function MarketingCampaigns() {
  const [createOpen, setCreateOpen] = useState(false)

  const handleCreateCampaign = () => {
    console.log("[v0] Creating new campaign")
    setCreateOpen(false)
  }

  const handleViewDetails = (campaignId: string) => {
    console.log("[v0] Viewing campaign details:", campaignId)
    // TODO: Open campaign details dialog
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Marketing Campaigns</h1>
          <p className="mt-2 text-gray-400">Create and manage marketing campaigns</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Create New Campaign</DialogTitle>
              <DialogDescription className="text-gray-400">Set up a new marketing campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name" className="text-gray-300">
                  Campaign Name
                </Label>
                <Input
                  id="campaign-name"
                  placeholder="Enter campaign name..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="campaign-type" className="text-gray-300">
                    Campaign Type
                  </Label>
                  <Select defaultValue="email">
                    <SelectTrigger id="campaign-type" className="border-gray-700 bg-gray-900 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="paid-ads">Paid Advertising</SelectItem>
                      <SelectItem value="referral">Referral Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-gray-300">
                    Budget ($)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="5000"
                    className="border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-gray-300">
                    Start Date
                  </Label>
                  <Input id="start-date" type="date" className="border-gray-700 bg-gray-900 text-gray-100" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-gray-300">
                    End Date
                  </Label>
                  <Input id="end-date" type="date" className="border-gray-700 bg-gray-900 text-gray-100" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-audience" className="text-gray-300">
                  Target Audience
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger id="target-audience" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="new">New Users</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="inactive">Inactive Users</SelectItem>
                    <SelectItem value="custom">Custom Segment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign goals and strategy..."
                  rows={4}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                  onClick={() => setCreateOpen(false)}
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
            <CardTitle className="text-sm font-medium text-gray-400">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">8</div>
            <p className="mt-1 text-xs text-gray-500">2 ending this week</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">415K</div>
            <p className="mt-1 text-xs text-green-500">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">$12.4K</div>
            <p className="mt-1 text-xs text-gray-500">of $16K budget</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">3.4x</div>
            <p className="mt-1 text-xs text-green-500">+0.6x from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">All Campaigns</CardTitle>
          <CardDescription className="text-gray-400">Monitor performance across all campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Campaign</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Budget</TableHead>
                <TableHead className="text-gray-400">Impressions</TableHead>
                <TableHead className="text-gray-400">Clicks</TableHead>
                <TableHead className="text-gray-400">Conversions</TableHead>
                <TableHead className="text-gray-400">ROI</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-100">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        {campaign.startDate} - {campaign.endDate || "Ongoing"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-700">
                      {campaign.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={campaign.status === "active" ? "default" : "secondary"}
                      className={
                        campaign.status === "active"
                          ? "bg-green-600"
                          : campaign.status === "paused"
                            ? "bg-yellow-600"
                            : "bg-gray-600"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-300">{campaign.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{campaign.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{campaign.conversions}</TableCell>
                  <TableCell className="font-semibold text-green-500">{campaign.roi}x</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-500 hover:bg-gray-700 hover:text-amber-400"
                      onClick={() => handleViewDetails(campaign.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Top Performing Campaigns</CardTitle>
            <CardDescription className="text-gray-400">By conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCampaigns
                .sort((a, b) => b.roi - a.roi)
                .slice(0, 3)
                .map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-100">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.conversions} conversions</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-500">{campaign.roi}x ROI</div>
                      <div className="text-sm text-gray-500">
                        {((campaign.clicks / campaign.impressions) * 100).toFixed(1)}% CTR
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Campaign Types Distribution</CardTitle>
            <CardDescription className="text-gray-400">Budget allocation by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email Campaigns</span>
                <span className="font-semibold text-gray-100">$5,000 (31%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Paid Advertising</span>
                <span className="font-semibold text-gray-100">$8,000 (50%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Social Media</span>
                <span className="font-semibold text-gray-100">$3,000 (19%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
