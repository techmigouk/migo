"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Server, Database, Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp } from "lucide-react"

interface ServerMetric {
  id: string
  name: string
  status: "healthy" | "warning" | "critical"
  cpu: number
  memory: number
  disk: number
  uptime: string
  location: string
}

interface DatabaseMetric {
  id: string
  name: string
  type: string
  status: "healthy" | "warning" | "critical"
  connections: number
  maxConnections: number
  queryTime: number
  size: string
}

interface APIMetric {
  endpoint: string
  requests: number
  avgResponseTime: number
  errorRate: number
  status: "healthy" | "warning" | "critical"
}

interface ErrorLog {
  id: string
  timestamp: string
  level: "error" | "warning" | "info"
  service: string
  message: string
  count: number
}

const mockServers: ServerMetric[] = [
  {
    id: "1",
    name: "Web Server 1",
    status: "healthy",
    cpu: 45,
    memory: 62,
    disk: 38,
    uptime: "45 days",
    location: "US-East",
  },
  {
    id: "2",
    name: "Web Server 2",
    status: "healthy",
    cpu: 52,
    memory: 58,
    disk: 41,
    uptime: "45 days",
    location: "US-West",
  },
  {
    id: "3",
    name: "API Server 1",
    status: "warning",
    cpu: 78,
    memory: 85,
    disk: 45,
    uptime: "23 days",
    location: "EU-Central",
  },
  {
    id: "4",
    name: "API Server 2",
    status: "healthy",
    cpu: 41,
    memory: 55,
    disk: 39,
    uptime: "45 days",
    location: "Asia-Pacific",
  },
]

const mockDatabases: DatabaseMetric[] = [
  {
    id: "1",
    name: "Primary DB",
    type: "PostgreSQL",
    status: "healthy",
    connections: 45,
    maxConnections: 100,
    queryTime: 12,
    size: "245 GB",
  },
  {
    id: "2",
    name: "Analytics DB",
    type: "MongoDB",
    status: "healthy",
    connections: 23,
    maxConnections: 50,
    queryTime: 8,
    size: "89 GB",
  },
  {
    id: "3",
    name: "Cache DB",
    type: "Redis",
    status: "warning",
    connections: 78,
    maxConnections: 100,
    queryTime: 2,
    size: "12 GB",
  },
]

const mockAPIMetrics: APIMetric[] = [
  { endpoint: "/api/users", requests: 45230, avgResponseTime: 145, errorRate: 0.2, status: "healthy" },
  { endpoint: "/api/courses", requests: 32100, avgResponseTime: 189, errorRate: 0.5, status: "healthy" },
  { endpoint: "/api/payments", requests: 8945, avgResponseTime: 234, errorRate: 1.2, status: "warning" },
  { endpoint: "/api/auth", requests: 67890, avgResponseTime: 98, errorRate: 0.1, status: "healthy" },
]

const mockErrorLogs: ErrorLog[] = [
  {
    id: "1",
    timestamp: "2025-01-23 14:32:15",
    level: "error",
    service: "Payment Gateway",
    message: "Connection timeout to Stripe API",
    count: 3,
  },
  {
    id: "2",
    timestamp: "2025-01-23 14:28:42",
    level: "warning",
    service: "Email Service",
    message: "High queue size detected",
    count: 1,
  },
  {
    id: "3",
    timestamp: "2025-01-23 14:15:33",
    level: "error",
    service: "Database",
    message: "Slow query detected (>5s)",
    count: 2,
  },
  {
    id: "4",
    timestamp: "2025-01-23 13:45:12",
    level: "warning",
    service: "CDN",
    message: "Cache miss rate above threshold",
    count: 1,
  },
]

export function InfrastructureMonitoring() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null)

  const getStatusIcon = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusBadge = (status: "healthy" | "warning" | "critical") => {
    const variants = {
      healthy: "bg-green-500/10 text-green-500 border-green-500/20",
      warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      critical: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Infrastructure & DevOps</h1>
        <p className="mt-2 text-gray-400">Monitor server health, database performance, and system metrics</p>
      </div>

      {/* System Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Total Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">4</div>
              <Server className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-green-500">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Databases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">3</div>
              <Database className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-yellow-500">1 warning detected</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">API Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">154K</div>
              <Activity className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-gray-400">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">0.5%</div>
              <TrendingUp className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-green-500">-0.2% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="servers" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="servers" className="data-[state=active]:bg-amber-600">
            Server Monitoring
          </TabsTrigger>
          <TabsTrigger value="databases" className="data-[state=active]:bg-amber-600">
            Database Health
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-amber-600">
            API Performance
          </TabsTrigger>
          <TabsTrigger value="errors" className="data-[state=active]:bg-amber-600">
            Error Tracking
          </TabsTrigger>
        </TabsList>

        {/* Server Monitoring */}
        <TabsContent value="servers" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Server Status</CardTitle>
              <CardDescription className="text-gray-400">Real-time server health and resource usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockServers.map((server) => (
                  <div key={server.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(server.status)}
                        <div>
                          <h3 className="font-semibold text-gray-100">{server.name}</h3>
                          <p className="text-sm text-gray-400">
                            {server.location} • Uptime: {server.uptime}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(server.status)}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-gray-400">CPU Usage</span>
                          <span className="font-medium text-gray-100">{server.cpu}%</span>
                        </div>
                        <Progress value={server.cpu} className="h-2" />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-gray-400">Memory</span>
                          <span className="font-medium text-gray-100">{server.memory}%</span>
                        </div>
                        <Progress value={server.memory} className="h-2" />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-gray-400">Disk Usage</span>
                          <span className="font-medium text-gray-100">{server.disk}%</span>
                        </div>
                        <Progress value={server.disk} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Health */}
        <TabsContent value="databases" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Database Health</CardTitle>
              <CardDescription className="text-gray-400">Monitor database connections and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDatabases.map((db) => (
                  <div key={db.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(db.status)}
                        <div>
                          <h3 className="font-semibold text-gray-100">{db.name}</h3>
                          <p className="text-sm text-gray-400">{db.type}</p>
                        </div>
                      </div>
                      {getStatusBadge(db.status)}
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-gray-400">Connections</p>
                        <p className="text-lg font-semibold text-gray-100">
                          {db.connections}/{db.maxConnections}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Avg Query Time</p>
                        <p className="text-lg font-semibold text-gray-100">{db.queryTime}ms</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Database Size</p>
                        <p className="text-lg font-semibold text-gray-100">{db.size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Connection Usage</p>
                        <Progress value={(db.connections / db.maxConnections) * 100} className="mt-2 h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Performance */}
        <TabsContent value="api" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">API Performance</CardTitle>
              <CardDescription className="text-gray-400">Track API endpoint metrics and response times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Endpoint</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Requests (24h)</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Avg Response Time</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Error Rate</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAPIMetrics.map((metric, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-4 text-sm font-medium text-gray-100">{metric.endpoint}</td>
                        <td className="py-4 text-sm text-gray-300">{metric.requests.toLocaleString()}</td>
                        <td className="py-4 text-sm text-gray-300">{metric.avgResponseTime}ms</td>
                        <td className="py-4 text-sm text-gray-300">{metric.errorRate}%</td>
                        <td className="py-4">{getStatusBadge(metric.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Error Tracking */}
        <TabsContent value="errors" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Error Tracking</CardTitle>
              <CardDescription className="text-gray-400">
                Recent errors and warnings across all services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockErrorLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 rounded-lg border border-gray-700 bg-gray-900 p-4"
                  >
                    <div className="mt-1">
                      {log.level === "error" ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge
                          className={
                            log.level === "error"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }
                        >
                          {log.level}
                        </Badge>
                        <span className="text-sm font-medium text-gray-100">{log.service}</span>
                        {log.count > 1 && (
                          <Badge className="bg-gray-700 text-gray-300 border-gray-600">×{log.count}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">{log.message}</p>
                      <p className="mt-1 text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    >
                      View Details
                    </Button>
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
