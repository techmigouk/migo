"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, CreditCard, TrendingUp, AlertCircle, CheckCircle2, Download, Info, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface Subscription {
  id: string
  user: string
  plan: "Free" | "Pro" | "Enterprise"
  status: "active" | "past_due" | "canceled" | "trialing"
  amount: number
  billingCycle: "monthly" | "yearly"
  nextBilling: string
  paymentMethod: string
}

interface Transaction {
  id: string
  user: string
  type: "subscription" | "course" | "service"
  amount: number
  status: "succeeded" | "failed" | "pending"
  date: string
  description: string
}

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    plan: "Pro",
    status: "active",
    amount: 29,
    billingCycle: "monthly",
    nextBilling: "2024-04-15",
    paymentMethod: "•••• 4242",
  },
  {
    id: "2",
    user: "Michael Chen",
    plan: "Enterprise",
    status: "active",
    amount: 299,
    billingCycle: "yearly",
    nextBilling: "2024-12-01",
    paymentMethod: "•••• 5555",
  },
  {
    id: "3",
    user: "Emily Rodriguez",
    plan: "Pro",
    status: "past_due",
    amount: 29,
    billingCycle: "monthly",
    nextBilling: "2024-03-10",
    paymentMethod: "•••• 1234",
  },
]

const mockTransactions: Transaction[] = [
  {
    id: "1",
    user: "John Smith",
    type: "course",
    amount: 99,
    status: "succeeded",
    date: "2024-03-15 14:32",
    description: "React Fundamentals Course",
  },
  {
    id: "2",
    user: "Jane Doe",
    type: "subscription",
    amount: 29,
    status: "succeeded",
    date: "2024-03-15 13:45",
    description: "Pro Plan - Monthly",
  },
  {
    id: "3",
    user: "Bob Wilson",
    type: "course",
    amount: 149,
    status: "failed",
    date: "2024-03-15 12:18",
    description: "TypeScript Masterclass",
  },
]

export function BillingManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Toast notification state
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error' | 'warning' | 'info'; message: string; icon?: React.ReactNode }[]>([])
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string, icon?: React.ReactNode) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message, icon }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const handleManageSubscription = (subscription: Subscription) => {
    console.log("[v0] Managing subscription:", subscription.id)
    setSelectedSubscription(subscription)
    setShowSubscriptionDialog(true)
  }

  const handleViewTransactionDetails = (transaction: Transaction) => {
    console.log("[v0] Viewing transaction details:", transaction.id)
    setSelectedTransaction(transaction)
    setShowTransactionDialog(true)
  }

  const handleDownloadInvoice = (transaction: Transaction) => {
    console.log("[v0] Downloading invoice for transaction:", transaction.id)
    // Simulate download
    showToast('info', `Downloading invoice for ${transaction.description}`, <Info size={16} />)
  }

  const handleCancelSubscription = (subscription: Subscription) => {
    console.log("[v0] Canceling subscription:", subscription.id)
    if (confirm(`Are you sure you want to cancel ${subscription.user}'s subscription?`)) {
      setSubscriptions(subscriptions.map((s) => (s.id === subscription.id ? { ...s, status: "canceled" as const } : s)))
      setShowSubscriptionDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Billing & Subscriptions</h1>
        <p className="mt-2 text-gray-400">Manage subscriptions, payments, and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">$48.5K</div>
            <p className="mt-1 text-xs text-green-500">+15.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">3,456</div>
            <p className="mt-1 text-xs text-green-500">+8.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">4.2%</div>
            <p className="mt-1 text-xs text-green-500">-1.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">23</div>
            <p className="mt-1 text-xs text-amber-500">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-amber-600">
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-amber-600">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-amber-600">
            Plans & Pricing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Active Subscriptions</CardTitle>
              <CardDescription className="text-gray-400">Manage user subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-400">User</TableHead>
                    <TableHead className="text-gray-400">Plan</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Billing Cycle</TableHead>
                    <TableHead className="text-gray-400">Next Billing</TableHead>
                    <TableHead className="text-gray-400">Payment Method</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium text-gray-100">{sub.user}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            sub.plan === "Enterprise"
                              ? "bg-purple-600"
                              : sub.plan === "Pro"
                                ? "bg-blue-600"
                                : "bg-gray-600"
                          }
                        >
                          {sub.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className={
                            sub.status === "active"
                              ? "bg-green-600"
                              : sub.status === "past_due"
                                ? "bg-red-600"
                                : sub.status === "trialing"
                                  ? "bg-blue-600"
                                  : "bg-gray-600"
                          }
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">${sub.amount}</TableCell>
                      <TableCell className="text-gray-300">{sub.billingCycle}</TableCell>
                      <TableCell className="text-gray-400">{sub.nextBilling}</TableCell>
                      <TableCell className="text-gray-300">{sub.paymentMethod}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-500 hover:bg-gray-700 hover:text-amber-400"
                          onClick={() => handleManageSubscription(sub)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Recent Transactions</CardTitle>
              <CardDescription className="text-gray-400">Payment history and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-400">User</TableHead>
                    <TableHead className="text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-400">Description</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium text-gray-100">{txn.user}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-gray-700">
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{txn.description}</TableCell>
                      <TableCell className="font-semibold text-amber-500">${txn.amount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {txn.status === "succeeded" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {txn.status === "failed" && <AlertCircle className="h-4 w-4 text-red-500" />}
                          <span
                            className={
                              txn.status === "succeeded"
                                ? "text-green-500"
                                : txn.status === "failed"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                            }
                          >
                            {txn.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">{txn.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-500 hover:bg-gray-700 hover:text-amber-400"
                            onClick={() => handleViewTransactionDetails(txn)}
                          >
                            Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:bg-gray-700"
                            onClick={() => handleDownloadInvoice(txn)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-gray-800 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Free Plan</CardTitle>
                <CardDescription className="text-gray-400">Basic access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-gray-100">$0</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ 3 Free Courses</li>
                  <li>✓ Community Access</li>
                  <li>✓ Basic Support</li>
                </ul>
                <div className="pt-4">
                  <div className="text-sm text-gray-500">8,234 users</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-600 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Pro Plan</CardTitle>
                <CardDescription className="text-gray-400">Full access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-gray-100">
                  $29<span className="text-lg text-gray-400">/mo</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ All Courses</li>
                  <li>✓ Priority Support</li>
                  <li>✓ Certificates</li>
                  <li>✓ Offline Access</li>
                </ul>
                <div className="pt-4">
                  <div className="text-sm text-gray-500">3,456 users</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-600 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Enterprise</CardTitle>
                <CardDescription className="text-gray-400">For teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-gray-100">
                  $299<span className="text-lg text-gray-400">/mo</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Everything in Pro</li>
                  <li>✓ Team Management</li>
                  <li>✓ Custom Branding</li>
                  <li>✓ Dedicated Support</li>
                  <li>✓ Analytics Dashboard</li>
                </ul>
                <div className="pt-4">
                  <div className="text-sm text-gray-500">853 users</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Subscription Management Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription className="text-gray-400">{selectedSubscription?.user}</DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-gray-300">Plan</Label>
                  <Input
                    defaultValue={selectedSubscription.plan}
                    className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Amount</Label>
                  <Input
                    defaultValue={`$${selectedSubscription.amount}`}
                    className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Billing Cycle</Label>
                  <Input
                    defaultValue={selectedSubscription.billingCycle}
                    className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Next Billing</Label>
                  <Input
                    defaultValue={selectedSubscription.nextBilling}
                    className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  className="border-red-600 text-red-400 bg-transparent"
                  onClick={() => handleCancelSubscription(selectedSubscription)}
                >
                  Cancel Subscription
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubscriptionDialog(false)}
                    className="border-gray-700"
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => {
                      console.log("[v0] Saving subscription changes")
                      setShowSubscriptionDialog(false)
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription className="text-gray-400">Transaction ID: {selectedTransaction?.id}</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">User</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedTransaction.user}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="mt-1 text-2xl font-bold text-amber-500">${selectedTransaction.amount}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge
                    className={
                      selectedTransaction.status === "succeeded"
                        ? "bg-green-600"
                        : selectedTransaction.status === "failed"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                    }
                  >
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedTransaction.date}</p>
                </div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <p className="text-sm text-gray-400">Description</p>
                <p className="mt-1 font-medium text-gray-100">{selectedTransaction.description}</p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  className="border-gray-700 bg-transparent"
                  onClick={() => handleDownloadInvoice(selectedTransaction)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setShowTransactionDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 min-w-[320px] max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              relative flex items-start gap-3 p-4 rounded-lg shadow-lg
              backdrop-blur-xl border animate-in slide-in-from-right
              ${toast.type === 'success' ? 'bg-linear-to-r from-[rgba(16,185,129,0.15)] to-[rgba(5,150,105,0.15)] border-green-500/50' : ''}
              ${toast.type === 'error' ? 'bg-linear-to-r from-[rgba(239,68,68,0.15)] to-[rgba(220,38,38,0.15)] border-red-500/50' : ''}
              ${toast.type === 'warning' ? 'bg-linear-to-r from-[rgba(245,158,11,0.15)] to-[rgba(217,119,6,0.15)] border-amber-500/50' : ''}
              ${toast.type === 'info' ? 'bg-linear-to-r from-[rgba(59,130,246,0.15)] to-[rgba(37,99,235,0.15)] border-blue-500/50' : ''}
            `}
          >
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full shrink-0
              ${toast.type === 'success' ? 'bg-linear-to-br from-green-500 to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''}
              ${toast.type === 'error' ? 'bg-linear-to-br from-red-500 to-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : ''}
              ${toast.type === 'warning' ? 'bg-linear-to-br from-amber-500 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : ''}
              ${toast.type === 'info' ? 'bg-linear-to-br from-blue-500 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : ''}
            `}>
              <span className="text-white">{toast.icon}</span>
            </div>
            <p className="flex-1 text-white font-medium text-sm leading-relaxed pt-1">{toast.message}</p>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="shrink-0 text-white/70 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
