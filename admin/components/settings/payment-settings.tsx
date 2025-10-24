"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

export function PaymentSettings() {
  const [stripeEnabled, setStripeEnabled] = useState(true)
  const [paypalEnabled, setPaypalEnabled] = useState(false)

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-100">Stripe</CardTitle>
              <CardDescription className="text-gray-400">Configure Stripe payment gateway</CardDescription>
            </div>
            <Badge className={stripeEnabled ? "bg-green-600" : "bg-gray-600"}>
              {stripeEnabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-100">Enable Stripe</p>
              <p className="text-sm text-gray-400">Accept payments via Stripe</p>
            </div>
            <Switch checked={stripeEnabled} onCheckedChange={setStripeEnabled} />
          </div>
          {stripeEnabled && (
            <>
              <div>
                <Label className="text-gray-300">Publishable Key</Label>
                <Input placeholder="pk_test_..." className="mt-2 border-gray-700 bg-gray-900 text-gray-100" />
              </div>
              <div>
                <Label className="text-gray-300">Secret Key</Label>
                <Input
                  type="password"
                  placeholder="sk_test_..."
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div>
                <Label className="text-gray-300">Webhook Secret</Label>
                <Input
                  type="password"
                  placeholder="whsec_..."
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-100">PayPal</CardTitle>
              <CardDescription className="text-gray-400">Configure PayPal payment gateway</CardDescription>
            </div>
            <Badge className={paypalEnabled ? "bg-green-600" : "bg-gray-600"}>
              {paypalEnabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-100">Enable PayPal</p>
              <p className="text-sm text-gray-400">Accept payments via PayPal</p>
            </div>
            <Switch checked={paypalEnabled} onCheckedChange={setPaypalEnabled} />
          </div>
          {paypalEnabled && (
            <>
              <div>
                <Label className="text-gray-300">Client ID</Label>
                <Input
                  placeholder="AYSq3RDGsmBLJE-otTkBtM-jBc..."
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div>
                <Label className="text-gray-300">Client Secret</Label>
                <Input
                  type="password"
                  placeholder="EO422dn3gQLgDbuwqTjzrFgFtaRLRR..."
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Currency Settings</CardTitle>
          <CardDescription className="text-gray-400">Configure default currency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Default Currency</Label>
            <div className="mt-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <Input value="USD" className="border-gray-700 bg-gray-900 text-gray-100" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-amber-600 hover:bg-amber-700">Save Changes</Button>
      </div>
    </div>
  )
}
