"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, FileText, Download, Search, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  ipAddress: string
  status: "success" | "failed"
  details: string
}

interface Vulnerability {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  affectedSystem: string
  discoveredDate: string
  status: "open" | "in-progress" | "resolved"
}

interface ComplianceReport {
  id: string
  standard: string
  status: "compliant" | "partial" | "non-compliant"
  lastAudit: string
  score: number
  issues: number
}

interface PrivacyRequest {
  id: string
  type: "access" | "deletion" | "portability" | "correction"
  user: string
  email: string
  requestDate: string
  status: "pending" | "processing" | "completed"
  dueDate: string
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2025-01-23 14:32:15",
    user: "admin@techmigo.com",
    action: "User Role Changed",
    resource: "User: john.doe@example.com",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Changed role from Student to Instructor",
  },
  {
    id: "2",
    timestamp: "2025-01-23 14:28:42",
    user: "admin@techmigo.com",
    action: "Course Deleted",
    resource: "Course: Advanced Python",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Permanently deleted course and all associated content",
  },
  {
    id: "3",
    timestamp: "2025-01-23 14:15:33",
    user: "moderator@techmigo.com",
    action: "Login Attempt",
    resource: "Admin Dashboard",
    ipAddress: "203.0.113.45",
    status: "failed",
    details: "Invalid credentials - 3rd attempt",
  },
  {
    id: "4",
    timestamp: "2025-01-23 13:45:12",
    user: "admin@techmigo.com",
    action: "Settings Updated",
    resource: "Platform Settings",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Updated payment gateway configuration",
  },
]

const mockVulnerabilities: Vulnerability[] = [
  {
    id: "1",
    severity: "high",
    title: "SQL Injection Vulnerability",
    description: "Potential SQL injection in user search endpoint",
    affectedSystem: "User Management API",
    discoveredDate: "2025-01-20",
    status: "in-progress",
  },
  {
    id: "2",
    severity: "medium",
    title: "Outdated Dependencies",
    description: "Several npm packages have known vulnerabilities",
    affectedSystem: "Frontend Application",
    discoveredDate: "2025-01-18",
    status: "open",
  },
  {
    id: "3",
    severity: "critical",
    title: "Authentication Bypass",
    description: "JWT token validation issue in admin routes",
    affectedSystem: "Authentication Service",
    discoveredDate: "2025-01-15",
    status: "resolved",
  },
  {
    id: "4",
    severity: "low",
    title: "Information Disclosure",
    description: "Error messages expose internal system details",
    affectedSystem: "API Gateway",
    discoveredDate: "2025-01-12",
    status: "open",
  },
]

const mockComplianceReports: ComplianceReport[] = [
  { id: "1", standard: "GDPR", status: "compliant", lastAudit: "2025-01-15", score: 95, issues: 2 },
  { id: "2", standard: "CCPA", status: "compliant", lastAudit: "2025-01-10", score: 92, issues: 3 },
  { id: "3", standard: "SOC 2", status: "partial", lastAudit: "2024-12-20", score: 78, issues: 8 },
  { id: "4", standard: "ISO 27001", status: "compliant", lastAudit: "2024-12-15", score: 88, issues: 5 },
]

const mockPrivacyRequests: PrivacyRequest[] = [
  {
    id: "1",
    type: "deletion",
    user: "John Doe",
    email: "john.doe@example.com",
    requestDate: "2025-01-22",
    status: "pending",
    dueDate: "2025-02-21",
  },
  {
    id: "2",
    type: "access",
    user: "Jane Smith",
    email: "jane.smith@example.com",
    requestDate: "2025-01-20",
    status: "processing",
    dueDate: "2025-02-19",
  },
  {
    id: "3",
    type: "portability",
    user: "Mike Johnson",
    email: "mike.j@example.com",
    requestDate: "2025-01-18",
    status: "completed",
    dueDate: "2025-02-17",
  },
]

export function SecurityCompliance() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const getSeverityBadge = (severity: "critical" | "high" | "medium" | "low") => {
    const variants = {
      critical: "bg-red-500/10 text-red-500 border-red-500/20",
      high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    }
    return <Badge className={variants[severity]}>{severity}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      success: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      open: "bg-red-500/10 text-red-500 border-red-500/20",
      "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      resolved: "bg-green-500/10 text-green-500 border-green-500/20",
      compliant: "bg-green-500/10 text-green-500 border-green-500/20",
      partial: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "non-compliant": "bg-red-500/10 text-red-500 border-red-500/20",
      pending: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
    }
    return <Badge className={variants[status] || "bg-gray-500/10 text-gray-400"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Security & Compliance</h1>
        <p className="mt-2 text-gray-400">Monitor security events, vulnerabilities, and compliance status</p>
      </div>

      {/* Security Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">92/100</div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <p className="mt-2 text-xs text-green-500">+3 from last week</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Open Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">3</div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="mt-2 text-xs text-gray-400">1 critical, 2 medium</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">3/4</div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="mt-2 text-xs text-gray-400">Standards compliant</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Privacy Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">3</div>
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-yellow-500">1 pending action</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="audit" className="data-[state=active]:bg-amber-600">
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-amber-600">
            Vulnerabilities
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-amber-600">
            Compliance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-amber-600">
            Privacy Requests
          </TabsTrigger>
        </TabsList>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-100">Security Audit Logs</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track all security-related events and actions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search audit logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-gray-700 bg-gray-900 pl-10 text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {mockAuditLogs.map((log) => (
                  <Dialog key={log.id}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer rounded-lg border border-gray-700 bg-gray-900 p-4 transition-colors hover:border-gray-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-semibold text-gray-100">{log.action}</span>
                              {getStatusBadge(log.status)}
                            </div>
                            <p className="text-sm text-gray-400">{log.resource}</p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                              <span>{log.user}</span>
                              <span>•</span>
                              <span>{log.ipAddress}</span>
                              <span>•</span>
                              <span>{log.timestamp}</span>
                            </div>
                          </div>
                          <Eye className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="border-gray-700 bg-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-gray-100">Audit Log Details</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Complete information about this security event
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-400">Action</Label>
                          <p className="text-gray-100">{log.action}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Resource</Label>
                          <p className="text-gray-100">{log.resource}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">User</Label>
                          <p className="text-gray-100">{log.user}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">IP Address</Label>
                          <p className="text-gray-100">{log.ipAddress}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Timestamp</Label>
                          <p className="text-gray-100">{log.timestamp}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Details</Label>
                          <p className="text-gray-100">{log.details}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <div className="mt-1">{getStatusBadge(log.status)}</div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vulnerabilities */}
        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-100">Vulnerability Scanning</CardTitle>
                  <CardDescription className="text-gray-400">
                    Identified security vulnerabilities and their status
                  </CardDescription>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700">Run New Scan</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVulnerabilities.map((vuln) => (
                  <div key={vuln.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {getSeverityBadge(vuln.severity)}
                          {getStatusBadge(vuln.status)}
                        </div>
                        <h3 className="font-semibold text-gray-100">{vuln.title}</h3>
                        <p className="mt-1 text-sm text-gray-400">{vuln.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Affected System:</span>
                          <span className="ml-2 text-gray-300">{vuln.affectedSystem}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Discovered:</span>
                          <span className="ml-2 text-gray-300">{vuln.discoveredDate}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Compliance Reports</CardTitle>
              <CardDescription className="text-gray-400">
                Track compliance with industry standards and regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockComplianceReports.map((report) => (
                  <div key={report.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-100">{report.standard}</h3>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Compliance Score</span>
                        <span className="text-lg font-semibold text-gray-100">{report.score}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Open Issues</span>
                        <span className="text-sm font-medium text-gray-100">{report.issues}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Last Audit</span>
                        <span className="text-sm text-gray-300">{report.lastAudit}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Full Report
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Requests */}
        <TabsContent value="privacy" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Data Privacy Requests</CardTitle>
              <CardDescription className="text-gray-400">Manage GDPR and CCPA data subject requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Request Type</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">User</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Email</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Request Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Due Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Status</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPrivacyRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-800">
                        <td className="py-4">
                          <Badge className="bg-amber-600/10 text-amber-500 border-amber-600/20 capitalize">
                            {request.type}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-gray-100">{request.user}</td>
                        <td className="py-4 text-sm text-gray-300">{request.email}</td>
                        <td className="py-4 text-sm text-gray-300">{request.requestDate}</td>
                        <td className="py-4 text-sm text-gray-300">{request.dueDate}</td>
                        <td className="py-4">{getStatusBadge(request.status)}</td>
                        <td className="py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                          >
                            Process
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
      </Tabs>
    </div>
  )
}
