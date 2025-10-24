"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
}

const mockFeatures: FeatureFlag[] = [
  {
    id: "1",
    name: "AI Assistant",
    description: "Enable AI-powered learning assistant for students",
    enabled: true,
    category: "Learning",
  },
  {
    id: "2",
    name: "Live Classes",
    description: "Allow instructors to host live video classes",
    enabled: false,
    category: "Learning",
  },
  {
    id: "3",
    name: "Gamification",
    description: "Enable points, badges, and leaderboards",
    enabled: true,
    category: "Engagement",
  },
  {
    id: "4",
    name: "Social Features",
    description: "Enable community forums and social interactions",
    enabled: true,
    category: "Community",
  },
  {
    id: "5",
    name: "Referral Program",
    description: "Allow users to refer friends and earn rewards",
    enabled: false,
    category: "Marketing",
  },
  {
    id: "6",
    name: "Advanced Analytics",
    description: "Enable detailed analytics and reporting features",
    enabled: true,
    category: "Analytics",
  },
]

export function FeatureFlags() {
  const [features, setFeatures] = useState<FeatureFlag[]>(mockFeatures)

  const toggleFeature = (id: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)))
  }

  const groupedFeatures = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = []
      }
      acc[feature.category].push(feature)
      return acc
    },
    {} as Record<string, FeatureFlag[]>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Feature Flags</h2>
        <p className="mt-1 text-gray-400">Enable or disable platform features</p>
      </div>

      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <Card key={category} className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">{category}</CardTitle>
            <CardDescription className="text-gray-400">
              {categoryFeatures.filter((f) => f.enabled).length} of {categoryFeatures.length} features enabled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-100">{feature.name}</p>
                    <Badge className={feature.enabled ? "bg-green-600" : "bg-gray-600"}>
                      {feature.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{feature.description}</p>
                </div>
                <Switch checked={feature.enabled} onCheckedChange={() => toggleFeature(feature.id)} />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
