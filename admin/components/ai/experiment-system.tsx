"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, TrendingUp, Users, Target } from "lucide-react"

interface Experiment {
  id: string
  name: string
  type: "A/B Test" | "Multivariate" | "Feature Flag"
  status: "running" | "completed" | "draft"
  variants: number
  participants: number
  startDate: string
  endDate?: string
  winner?: string
  conversionRate: {
    control: number
    variant: number
  }
}

const mockExperiments: Experiment[] = [
  {
    id: "1",
    name: "Course Card Design Test",
    type: "A/B Test",
    status: "running",
    variants: 2,
    participants: 5432,
    startDate: "2024-03-01",
    conversionRate: {
      control: 12.3,
      variant: 15.7,
    },
  },
  {
    id: "2",
    name: "Pricing Page Layout",
    type: "A/B Test",
    status: "completed",
    variants: 2,
    participants: 8765,
    startDate: "2024-02-15",
    endDate: "2024-03-01",
    winner: "Variant B",
    conversionRate: {
      control: 8.2,
      variant: 11.4,
    },
  },
  {
    id: "3",
    name: "Onboarding Flow Optimization",
    type: "Multivariate",
    status: "running",
    variants: 4,
    participants: 3210,
    startDate: "2024-03-10",
    conversionRate: {
      control: 45.2,
      variant: 52.8,
    },
  },
]

export function ExperimentSystem() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">A/B Testing & Experiments</h1>
          <p className="mt-2 text-gray-400">Run experiments to optimize user experience</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Experiment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Experiments</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">8</div>
            <p className="mt-1 text-xs text-gray-500">3 completed this month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">17.4K</div>
            <p className="mt-1 text-xs text-green-500">+12.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">+18.5%</div>
            <p className="mt-1 text-xs text-green-500">Across all tests</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">72%</div>
            <p className="mt-1 text-xs text-gray-500">Successful experiments</p>
          </CardContent>
        </Card>
      </div>

      {/* Experiments Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">All Experiments</CardTitle>
          <CardDescription className="text-gray-400">Monitor and analyze your experiments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Experiment</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Participants</TableHead>
                <TableHead className="text-gray-400">Duration</TableHead>
                <TableHead className="text-gray-400">Performance</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExperiments.map((experiment) => (
                <TableRow key={experiment.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-100">{experiment.name}</div>
                      {experiment.winner && <div className="text-sm text-green-500">Winner: {experiment.winner}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-700">
                      {experiment.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={
                        experiment.status === "running"
                          ? "bg-blue-600"
                          : experiment.status === "completed"
                            ? "bg-green-600"
                            : "bg-gray-600"
                      }
                    >
                      {experiment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{experiment.participants.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-400">
                    {experiment.startDate} - {experiment.endDate || "Ongoing"}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Control:</span>
                        <span className="font-semibold text-gray-100">{experiment.conversionRate.control}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Variant:</span>
                        <span className="font-semibold text-green-500">{experiment.conversionRate.variant}%</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        +
                        {(
                          ((experiment.conversionRate.variant - experiment.conversionRate.control) /
                            experiment.conversionRate.control) *
                          100
                        ).toFixed(1)}
                        % improvement
                      </div>
                    </div>
                  </TableCell>
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

      {/* Experiment Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Recent Winners</CardTitle>
            <CardDescription className="text-gray-400">Top performing experiment variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Pricing Page Layout - Variant B</span>
                <Badge variant="default" className="bg-green-600">
                  +39% conversion
                </Badge>
              </div>
              <Progress value={85} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">CTA Button Color - Red</span>
                <Badge variant="default" className="bg-green-600">
                  +28% clicks
                </Badge>
              </div>
              <Progress value={72} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Email Subject Line - Variant A</span>
                <Badge variant="default" className="bg-green-600">
                  +22% opens
                </Badge>
              </div>
              <Progress value={65} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Experiment Categories</CardTitle>
            <CardDescription className="text-gray-400">Distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">UI/UX Design</span>
              <span className="font-semibold text-gray-100">12 experiments</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Pricing & Conversion</span>
              <span className="font-semibold text-gray-100">8 experiments</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Email Marketing</span>
              <span className="font-semibold text-gray-100">6 experiments</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Onboarding Flow</span>
              <span className="font-semibold text-gray-100">4 experiments</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
