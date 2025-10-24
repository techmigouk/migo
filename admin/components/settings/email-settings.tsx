"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function EmailSettings() {
  const [smtpHost, setSmtpHost] = useState("smtp.example.com")
  const [smtpPort, setSmtpPort] = useState("587")
  const [smtpUser, setSmtpUser] = useState("noreply@techmigo.com")
  const [enableNotifications, setEnableNotifications] = useState(true)

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">SMTP Configuration</CardTitle>
          <CardDescription className="text-gray-400">Configure email server settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">SMTP Host</Label>
            <Input
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-300">SMTP Port</Label>
              <Input
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
              />
            </div>
            <div>
              <Label className="text-gray-300">SMTP Username</Label>
              <Input
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300">SMTP Password</Label>
            <Input type="password" placeholder="••••••••" className="mt-2 border-gray-700 bg-gray-900 text-gray-100" />
          </div>
          <Button variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
            Test Connection
          </Button>
        </CardContent>
      </Card>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Email Notifications</CardTitle>
          <CardDescription className="text-gray-400">Manage automated email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-100">Welcome Emails</p>
              <p className="text-sm text-gray-400">Send welcome email to new users</p>
            </div>
            <Switch checked={enableNotifications} onCheckedChange={setEnableNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-100">Course Completion</p>
              <p className="text-sm text-gray-400">Notify users when they complete a course</p>
            </div>
            <Switch checked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-100">Payment Receipts</p>
              <p className="text-sm text-gray-400">Send receipts for successful payments</p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-amber-600 hover:bg-amber-700">Save Changes</Button>
      </div>
    </div>
  )
}
