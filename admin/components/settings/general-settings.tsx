"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"

export function GeneralSettings() {
  const [siteName, setSiteName] = useState("TechMigo")
  const [siteDescription, setSiteDescription] = useState("Learn technology skills with expert instructors")
  const [timezone, setTimezone] = useState("UTC")
  const [language, setLanguage] = useState("en")

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Site Information</CardTitle>
          <CardDescription className="text-gray-400">Basic information about your platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Site Name</Label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <Label className="text-gray-300">Site Description</Label>
            <Textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-gray-300">Site Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-900">
                <span className="text-2xl font-bold text-amber-600">TM</span>
              </div>
              <div>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-gray-300 bg-transparent hover:bg-gray-700 cursor-pointer transition-all"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Click to Upload Logo
                </Button>
                <p className="text-xs text-gray-500 mt-1">PNG, SVG, JPG (recommended: 512x512)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Localization</CardTitle>
          <CardDescription className="text-gray-400">Configure timezone and language settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800">
                <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-300">Default Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-2 border-gray-700 bg-gray-900 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-amber-600 hover:bg-amber-700">Save Changes</Button>
      </div>
    </div>
  )
}
