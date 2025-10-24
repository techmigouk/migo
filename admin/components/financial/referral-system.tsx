"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, DollarSign, TrendingUp, Share2 } from "lucide-react"

interface Referrer {
  id: string
  name: string
  email: string
  referrals: number
  conversions: number
  earnings: number
  conversionRate: number
  tier: "bronze" | "silver" | "gold" | "platinum"
}

const mockReferrers: Referrer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    referrals: 45,
    conversions: 32,
    earnings: 1280,
    conversionRate: 71,
    tier: "gold",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    referrals: 28,
    conversions: 18,
    earnings: 720,
    conversionRate: 64,
    tier: "silver",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    referrals: 67,
    conversions: 54,
    earnings: 2160,
    conversionRate: 81,
    tier: "platinum",
  },
]

const tierColors = {
  bronze: "bg-orange-700",
  silver: "bg-gray-400",
  gold: "bg-yellow-500",
  platinum: "bg-cyan-500",
}

export function ReferralSystem() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Referral Program</h1>
        <p className="mt-2 text-gray-400">Manage referrals and affiliate partnerships</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Referrers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">1,234</div>
            <p className="mt-1 text-xs text-green-500">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Referrals</CardTitle>
            <Share2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">5,432</div>
            <p className="mt-1 text-xs text-green-500">+22.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">68.5%</div>
            <p className="mt-1 text-xs text-green-500">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Payouts (MTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">$45.2K</div>
            <p className="mt-1 text-xs text-green-500">+18.7% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Referrers */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Top Referrers</CardTitle>
          <CardDescription className="text-gray-400">Highest performing affiliates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Referrer</TableHead>
                <TableHead className="text-gray-400">Tier</TableHead>
                <TableHead className="text-gray-400">Referrals</TableHead>
                <TableHead className="text-gray-400">Conversions</TableHead>
                <TableHead className="text-gray-400">Conversion Rate</TableHead>
                <TableHead className="text-gray-400">Earnings</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReferrers.map((referrer) => (
                <TableRow key={referrer.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-100">{referrer.name}</div>
                      <div className="text-sm text-gray-500">{referrer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={tierColors[referrer.tier]}>
                      {referrer.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{referrer.referrals}</TableCell>
                  <TableCell className="text-gray-300">{referrer.conversions}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-100">{referrer.conversionRate}%</div>
                      <Progress value={referrer.conversionRate} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-amber-500">${referrer.earnings.toLocaleString()}</TableCell>
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

      {/* Referral Tiers */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Referral Tiers & Rewards</CardTitle>
          <CardDescription className="text-gray-400">Commission structure by tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-100">Bronze</h3>
                <Badge variant="secondary" className="bg-orange-700">
                  0-10
                </Badge>
              </div>
              <div className="text-2xl font-bold text-amber-500">20%</div>
              <p className="mt-1 text-sm text-gray-400">Commission rate</p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-100">Silver</h3>
                <Badge variant="secondary" className="bg-gray-400">
                  11-25
                </Badge>
              </div>
              <div className="text-2xl font-bold text-amber-500">25%</div>
              <p className="mt-1 text-sm text-gray-400">Commission rate</p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-100">Gold</h3>
                <Badge variant="secondary" className="bg-yellow-500">
                  26-50
                </Badge>
              </div>
              <div className="text-2xl font-bold text-amber-500">30%</div>
              <p className="mt-1 text-sm text-gray-400">Commission rate</p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-100">Platinum</h3>
                <Badge variant="secondary" className="bg-cyan-500">
                  51+
                </Badge>
              </div>
              <div className="text-2xl font-bold text-amber-500">35%</div>
              <p className="mt-1 text-sm text-gray-400">Commission rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payouts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Pending Payouts</CardTitle>
            <CardDescription className="text-gray-400">Awaiting payment processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div>
                <div className="font-medium text-gray-100">Emily Rodriguez</div>
                <div className="text-sm text-gray-500">54 conversions</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-amber-500">$2,160</div>
                <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
                  Process
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div>
                <div className="font-medium text-gray-100">Sarah Johnson</div>
                <div className="text-sm text-gray-500">32 conversions</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-amber-500">$1,280</div>
                <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
                  Process
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Referral Performance</CardTitle>
            <CardDescription className="text-gray-400">Monthly trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">New Referrers</span>
              <span className="font-semibold text-gray-100">+156 this month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Conversions</span>
              <span className="font-semibold text-gray-100">3,721</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Avg. Earnings per Referrer</span>
              <span className="font-semibold text-gray-100">$36.60</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Top Performing Tier</span>
              <Badge variant="secondary" className="bg-cyan-500">
                Platinum
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
