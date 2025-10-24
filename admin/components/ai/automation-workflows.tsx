"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Plus, Play, Pause, Settings, TrendingUp } from "lucide-react"

interface Workflow {
  id: string
  name: string
  trigger: string
  actions: string[]
  status: "active" | "paused" | "draft"
  executions: number
  successRate: number
  lastRun?: string
}

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Welcome New Users",
    trigger: "User Registration",
    actions: ["Send Welcome Email", "Assign Free Course", "Add to Newsletter"],
    status: "active",
    executions: 2543,
    successRate: 98.5,
    lastRun: "2 minutes ago",
  },
  {
    id: "2",
    name: "Course Completion Rewards",
    trigger: "Course Completed",
    actions: ["Award Certificate", "Grant Badge", "Send Congratulations Email", "Update Leaderboard"],
    status: "active",
    executions: 1876,
    successRate: 99.2,
    lastRun: "15 minutes ago",
  },
  {
    id: "3",
    name: "Inactive User Re-engagement",
    trigger: "No Activity for 14 Days",
    actions: ["Send Re-engagement Email", "Offer Discount", "Suggest Courses"],
    status: "active",
    executions: 456,
    successRate: 67.3,
    lastRun: "1 hour ago",
  },
]

export function AutomationWorkflows() {
  const [createWorkflowOpen, setCreateWorkflowOpen] = useState(false)
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows)

  const handleCreateWorkflow = () => {
    console.log("[v0] Creating new workflow")
    setCreateWorkflowOpen(false)
  }

  const handleSaveDraft = () => {
    console.log("[v0] Saving workflow as draft")
    setCreateWorkflowOpen(false)
  }

  const handleToggleWorkflow = (workflowId: string) => {
    console.log("[v0] Toggling workflow:", workflowId)
    setWorkflows(
      workflows.map((w) =>
        w.id === workflowId ? { ...w, status: w.status === "active" ? ("paused" as const) : ("active" as const) } : w,
      ),
    )
  }

  const handleEditWorkflow = (workflowId: string) => {
    console.log("[v0] Editing workflow:", workflowId)
    // TODO: Open edit dialog
  }

  const handleUseTemplate = (templateName: string) => {
    console.log("[v0] Using template:", templateName)
    setCreateWorkflowOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Automation Workflows</h1>
          <p className="mt-2 text-gray-400">Create and manage automated workflows</p>
        </div>
        <Dialog open={createWorkflowOpen} onOpenChange={setCreateWorkflowOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl border-gray-700 bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Create Automation Workflow</DialogTitle>
              <DialogDescription className="text-gray-400">Set up a new automated workflow</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name" className="text-gray-300">
                  Workflow Name
                </Label>
                <Input
                  id="workflow-name"
                  placeholder="e.g., Welcome New Users"
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger" className="text-gray-300">
                  Trigger Event
                </Label>
                <Select defaultValue="registration">
                  <SelectTrigger id="trigger" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="registration">User Registration</SelectItem>
                    <SelectItem value="course-complete">Course Completed</SelectItem>
                    <SelectItem value="purchase">Purchase Made</SelectItem>
                    <SelectItem value="inactive">User Inactive</SelectItem>
                    <SelectItem value="milestone">Milestone Reached</SelectItem>
                    <SelectItem value="schedule">Scheduled Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Actions (Select Multiple)</Label>
                <div className="space-y-2 rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="action-email" className="h-4 w-4" />
                    <label htmlFor="action-email" className="text-sm text-gray-300">
                      Send Email
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="action-notification" className="h-4 w-4" />
                    <label htmlFor="action-notification" className="text-sm text-gray-300">
                      Send Push Notification
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="action-badge" className="h-4 w-4" />
                    <label htmlFor="action-badge" className="text-sm text-gray-300">
                      Award Badge
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="action-points" className="h-4 w-4" />
                    <label htmlFor="action-points" className="text-sm text-gray-300">
                      Grant Points
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="action-tag" className="h-4 w-4" />
                    <label htmlFor="action-tag" className="text-sm text-gray-300">
                      Add User Tag
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="action-webhook" className="h-4 w-4" />
                    <label htmlFor="action-webhook" className="text-sm text-gray-300">
                      Call Webhook
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions" className="text-gray-300">
                  Conditions (Optional)
                </Label>
                <Select defaultValue="none">
                  <SelectTrigger id="conditions" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="none">No Conditions</SelectItem>
                    <SelectItem value="user-type">User Type</SelectItem>
                    <SelectItem value="subscription">Subscription Level</SelectItem>
                    <SelectItem value="location">User Location</SelectItem>
                    <SelectItem value="custom">Custom Condition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleCreateWorkflow}>
                  Create & Activate
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                  onClick={handleSaveDraft}
                >
                  Save as Draft
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
            <CardTitle className="text-sm font-medium text-gray-400">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">12</div>
            <p className="mt-1 text-xs text-gray-500">3 paused, 2 drafts</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Executions</CardTitle>
            <Play className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">45,231</div>
            <p className="mt-1 text-xs text-green-500">+22.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">96.8%</div>
            <p className="mt-1 text-xs text-green-500">+1.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Time Saved</CardTitle>
            <Settings className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">342h</div>
            <p className="mt-1 text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">All Workflows</CardTitle>
          <CardDescription className="text-gray-400">Manage your automation workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Workflow</TableHead>
                <TableHead className="text-gray-400">Trigger</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Executions</TableHead>
                <TableHead className="text-gray-400">Success Rate</TableHead>
                <TableHead className="text-gray-400">Last Run</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="font-medium text-gray-100">{workflow.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-700">
                      {workflow.trigger}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {workflow.actions.slice(0, 2).map((action, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-600 text-xs">
                          {action}
                        </Badge>
                      ))}
                      {workflow.actions.length > 2 && (
                        <Badge variant="secondary" className="bg-gray-600 text-xs">
                          +{workflow.actions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={
                        workflow.status === "active"
                          ? "bg-green-600"
                          : workflow.status === "paused"
                            ? "bg-yellow-600"
                            : "bg-gray-600"
                      }
                    >
                      {workflow.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{workflow.executions.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{workflow.successRate}%</TableCell>
                  <TableCell className="text-gray-400">{workflow.lastRun}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:bg-gray-700 hover:text-blue-400"
                        onClick={() => handleToggleWorkflow(workflow.id)}
                      >
                        {workflow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-500 hover:bg-gray-700 hover:text-amber-400"
                        onClick={() => handleEditWorkflow(workflow.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Workflow Templates */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Workflow Templates</CardTitle>
          <CardDescription className="text-gray-400">Quick start with pre-built workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <h3 className="font-semibold text-gray-100">User Onboarding</h3>
              <p className="mt-2 text-sm text-gray-400">Welcome emails, course assignments, and initial setup</p>
              <Button
                className="mt-4 w-full bg-amber-600 hover:bg-amber-700"
                size="sm"
                onClick={() => handleUseTemplate("User Onboarding")}
              >
                Use Template
              </Button>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <h3 className="font-semibold text-gray-100">Engagement Boost</h3>
              <p className="mt-2 text-sm text-gray-400">Re-engage inactive users with targeted campaigns</p>
              <Button
                className="mt-4 w-full bg-amber-600 hover:bg-amber-700"
                size="sm"
                onClick={() => handleUseTemplate("Engagement Boost")}
              >
                Use Template
              </Button>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <h3 className="font-semibold text-gray-100">Achievement System</h3>
              <p className="mt-2 text-sm text-gray-400">Automatic badges, certificates, and rewards</p>
              <Button
                className="mt-4 w-full bg-amber-600 hover:bg-amber-700"
                size="sm"
                onClick={() => handleUseTemplate("Achievement System")}
              >
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
