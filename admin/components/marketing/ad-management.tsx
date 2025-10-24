"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, DollarSign, Eye, MousePointer, TrendingUp } from "lucide-react"

interface AdCampaign {
  id: string
  name: string
  platform: "google" | "facebook" | "linkedin" | "twitter"
  status: "active" | "paused" | "completed"
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  cpc: number
  ctr: number
}

const mockAds: AdCampaign[] = [
  {
    id: "1",
    name: "React Course - Google Search",
    platform: "google",
    status: "active",
    budget: 5000,
    spent: 3200,
    impressions: 125000,
    clicks: 4500,
    conversions: 234,
    cpc: 0.71,
    ctr: 3.6,
  },
  {
    id: "2",
    name: "TypeScript Mastery - Facebook",
    platform: "facebook",
    status: "active",
    budget: 3000,
    spent: 2100,
    impressions: 89000,
    clicks: 2340,
    conversions: 156,
    cpc: 0.9,
    ctr: 2.6,
  },
]

export function AdManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Ad Management</h1>
          <p className="mt-2 text-gray-400">Monitor and optimize paid advertising campaigns</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Ad Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">$5,300</div>
            <p className="mt-1 text-xs text-gray-500">of $8,000 budget</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">214K</div>
            <p className="mt-1 text-xs text-green-500">+18.2% from last week</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. CPC</CardTitle>
            <MousePointer className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">$0.78</div>
            <p className="mt-1 text-xs text-green-500">-$0.12 from last week</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">390</div>
            <p className="mt-1 text-xs text-green-500">+24.5% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Ad Campaigns Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Active Ad Campaigns</CardTitle>
          <CardDescription className="text-gray-400">Monitor performance across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Campaign</TableHead>
                <TableHead className="text-gray-400">Platform</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Budget</TableHead>
                <TableHead className="text-gray-400">Impressions</TableHead>
                <TableHead className="text-gray-400">Clicks</TableHead>
                <TableHead className="text-gray-400">CTR</TableHead>
                <TableHead className="text-gray-400">CPC</TableHead>
                <TableHead className="text-gray-400">Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAds.map((ad) => (
                <TableRow key={ad.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="font-medium text-gray-100">{ad.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-700 capitalize">
                      {ad.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-600">
                      {ad.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    ${ad.spent.toLocaleString()} / ${ad.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-300">{ad.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{ad.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{ad.ctr}%</TableCell>
                  <TableCell className="text-gray-300">${ad.cpc}</TableCell>
                  <TableCell className="font-semibold text-green-500">{ad.conversions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
