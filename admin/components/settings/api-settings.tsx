"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string
  status: "Active" | "Revoked"
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API",
    key: "sk_live_51H7xKj2eZvKYlo2C...",
    createdAt: "2024-01-15",
    lastUsed: "2 hours ago",
    status: "Active",
  },
  {
    id: "2",
    name: "Development API",
    key: "sk_test_51H7xKj2eZvKYlo2C...",
    createdAt: "2024-02-20",
    lastUsed: "5 minutes ago",
    status: "Active",
  },
]

export function ApiSettings() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    console.log("[v0] Copied API key to clipboard")
  }

  const handleGenerateNewKey = () => {
    console.log("[v0] Opening generate new key dialog")
    setShowCreateDialog(true)
  }

  const handleCreateApiKey = () => {
    console.log("[v0] Creating new API key")
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: "New API Key",
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}...`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "Active",
    }
    setApiKeys([...apiKeys, newKey])
    setShowCreateDialog(false)
  }

  const handleRevokeKey = (apiKey: ApiKey) => {
    console.log("[v0] Revoking API key:", apiKey.id)
    if (confirm(`Are you sure you want to revoke "${apiKey.name}"? This action cannot be undone.`)) {
      setApiKeys(apiKeys.map((k) => (k.id === apiKey.id ? { ...k, status: "Revoked" as const } : k)))
    }
  }

  const handleDeleteKey = (apiKey: ApiKey) => {
    console.log("[v0] Deleting API key:", apiKey.id)
    if (confirm(`Are you sure you want to delete "${apiKey.name}"? This action cannot be undone.`)) {
      setApiKeys(apiKeys.filter((k) => k.id !== apiKey.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">API Keys</h2>
          <p className="mt-1 text-gray-400">Manage API keys for external integrations</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleGenerateNewKey}>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-100">{apiKey.name}</CardTitle>
                  <CardDescription className="text-gray-400">Created on {apiKey.createdAt}</CardDescription>
                </div>
                <Badge className={apiKey.status === "Active" ? "bg-green-600" : "bg-red-600"}>{apiKey.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">API Key</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    value={showKeys[apiKey.id] ? apiKey.key : "••••••••••••••••••••••••••••"}
                    readOnly
                    className="border-gray-700 bg-gray-900 text-gray-100 font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="border-gray-700 text-gray-400 bg-transparent"
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(apiKey.key)}
                    className="border-gray-700 text-gray-400 bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last used: {apiKey.lastUsed}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 bg-transparent"
                    onClick={() => handleRevokeKey(apiKey)}
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Revoke
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 bg-transparent"
                    onClick={() => handleDeleteKey(apiKey)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new API key for external integrations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Key Name</Label>
              <Input className="mt-2 border-gray-700 bg-gray-900 text-gray-100" placeholder="Production API" />
            </div>
            <div>
              <Label className="text-gray-300">Description (optional)</Label>
              <Textarea
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="Describe what this key will be used for..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-gray-700">
                Cancel
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleCreateApiKey}>
                Generate Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
