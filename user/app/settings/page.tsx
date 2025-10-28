"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  User,
  CreditCard,
  History,
  Shield,
  Upload,
  Lock,
  Check,
  X,
  Download,
  Plus,
  Crown,
  Zap,
  Star,
  ArrowLeft,
  Loader2,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Get initial tab from URL or default to profile
  const tabParam = searchParams.get('tab')
  const initialTab = 
    tabParam === 'billing' || tabParam === 'membership' ? 'membership' :
    tabParam === 'payment' ? 'payment' :
    tabParam === 'history' ? 'history' :
    tabParam === 'profile' ? 'profile' :
    'profile' as const
  
  const [activeTab, setActiveTab] = useState<'profile' | 'membership' | 'payment' | 'history'>(initialTab)
  
  const [userEmail, setUserEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [countryCode, setCountryCode] = useState('+234')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [learningGoal, setLearningGoal] = useState('upskill')
  const [userSubscription, setUserSubscription] = useState<'Free' | 'Monthly' | 'Annual' | 'Lifetime'>('Free')
  const [loading, setLoading] = useState(false)
  const [notificationPrefs, setNotificationPrefs] = useState({
    courseUpdates: true,
    mentorshipMessages: true,
    communityMentions: true,
    billingNotifications: true,
  })

  const isPro = userSubscription !== 'Free'

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        if (userData.email) setUserEmail(userData.email)
        if (userData.name) setFullName(userData.name)
        if (userData.avatar) setAvatarUrl(userData.avatar)
        if (userData.phone) {
          const phoneParts = userData.phone.split(' ')
          if (phoneParts.length === 2) {
            setCountryCode(phoneParts[0])
            setPhoneNumber(phoneParts[1])
          } else {
            setPhoneNumber(userData.phone)
          }
        }
        if (userData.learningGoal) setLearningGoal(userData.learningGoal)
        if (userData.notificationPrefs) setNotificationPrefs(userData.notificationPrefs)
        if (userData.subscription) setUserSubscription(userData.subscription)
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
  }, [])

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', activeTab)
    router.push(`/settings?${params.toString()}`, { scroll: false })
  }, [activeTab])

  const showToast = (type: 'success' | 'error', message: string) => {
    toast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default',
    })
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        setAvatarUrl(base64String)

        try {
          const token = localStorage.getItem('token')
          if (!token) {
            showToast('error', 'Please log in again to upload photos.')
            return
          }

          const response = await fetch('/api/auth/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ avatar: base64String }),
          })

          if (!response.ok) throw new Error('Failed to upload avatar')

          const data = await response.json()
          localStorage.setItem('user', JSON.stringify(data.user))
          showToast('success', 'Profile picture updated successfully!')
        } catch (error) {
          console.error('Error uploading avatar:', error)
          showToast('error', 'Error uploading photo. Please try again.')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        showToast('error', 'Please log in again to save changes.')
        return
      }

      const updateData = {
        name: fullName,
        email: userEmail,
        avatar: avatarUrl,
        phone: phoneNumber ? `${countryCode} ${phoneNumber}` : '',
        learningGoal: learningGoal,
        notificationPrefs: notificationPrefs,
      }

      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const data = await response.json()
      localStorage.setItem('user', JSON.stringify(data.user))
      showToast('success', 'Profile updated successfully!')
    } catch (error) {
      console.error('Error saving changes:', error)
      showToast('error', error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (plan: string, priceId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // TODO: Integrate with Stripe
      showToast('success', `Upgrading to ${plan} plan...`)
      // This would typically redirect to Stripe checkout
    } catch (error) {
      showToast('error', 'Failed to process subscription')
    }
  }

  const membershipTiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Get started with basic features',
      features: [
        'Access to free courses',
        'Community forum access',
        'Basic progress tracking',
        'Limited course materials',
      ],
      current: userSubscription === 'Free',
      priceId: 'free',
    },
    {
      name: 'Monthly Pro',
      price: '$29',
      period: '/month',
      description: 'Full access with monthly flexibility',
      features: [
        'All Free features',
        'Access to all premium courses',
        'Download course materials',
        'Priority support',
        'Certificates of completion',
        'Cancel anytime',
      ],
      popular: false,
      current: userSubscription === 'Monthly',
      priceId: 'price_monthly_plan',
    },
    {
      name: 'Annual Pro',
      price: '$249',
      period: '/year',
      savings: 'Save $99',
      description: 'Best value for committed learners',
      features: [
        'All Monthly Pro features',
        'Save 28% compared to monthly',
        'Priority access to new courses',
        'Exclusive webinars & events',
        '1-on-1 mentorship session',
        'Career guidance resources',
      ],
      popular: true,
      current: userSubscription === 'Annual',
      priceId: 'price_annual_plan',
    },
    {
      name: 'Lifetime',
      price: '$499',
      period: 'one-time',
      savings: 'Best Value',
      description: 'Pay once, learn forever',
      features: [
        'All Annual Pro features',
        'Lifetime access to all courses',
        'All future courses included',
        'Unlimited course downloads',
        'VIP community access',
        'Quarterly 1-on-1 mentorship',
        'Early access to beta features',
      ],
      current: userSubscription === 'Lifetime',
      priceId: 'price_lifetime_plan',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="mr-2" size={20} />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-sm text-gray-400">Manage your account and preferences</p>
              </div>
            </div>
            {activeTab === 'profile' && (
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Card className="bg-gray-800 border-gray-700 lg:col-span-1 h-fit">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === 'profile' ? 'bg-amber-500 text-gray-900' : 'text-gray-300'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2" size={16} />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === 'membership' ? 'bg-amber-500 text-gray-900' : 'text-gray-300'
                  }`}
                  onClick={() => setActiveTab('membership')}
                >
                  <Crown className="mr-2" size={16} />
                  Membership
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === 'payment' ? 'bg-amber-500 text-gray-900' : 'text-gray-300'
                  }`}
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard className="mr-2" size={16} />
                  Payment
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === 'history' ? 'bg-amber-500 text-gray-900' : 'text-gray-300'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  <History className="mr-2" size={16} />
                  History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Account Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Picture Upload */}
                  <div className="space-y-3">
                    <Label className="text-gray-300">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20 border-4 border-amber-500">
                        {avatarUrl ? <AvatarImage src={avatarUrl} /> : null}
                        <AvatarFallback className="bg-amber-500 text-gray-900 text-2xl font-bold">
                          {fullName
                            ? fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-gray-900 bg-transparent"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                          <Upload className="mr-2" size={16} />
                          Upload Photo
                        </Button>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Email Address</Label>
                      <Input
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Phone Number</Label>
                      <div className="flex space-x-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91</SelectItem>
                            <SelectItem value="+234">🇳🇬 +234</SelectItem>
                            <SelectItem value="+254">🇰🇪 +254</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="123 456 7890"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Learning Goal</Label>
                      <Select value={learningGoal} onValueChange={setLearningGoal}>
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="career">Career Switch</SelectItem>
                          <SelectItem value="upskill">Upskill</SelectItem>
                          <SelectItem value="business">Build a Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-300">Notification Preferences</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Course Updates</span>
                        <Switch
                          checked={notificationPrefs.courseUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationPrefs({ ...notificationPrefs, courseUpdates: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Mentorship Messages</span>
                        <Switch
                          checked={notificationPrefs.mentorshipMessages}
                          onCheckedChange={(checked) =>
                            setNotificationPrefs({ ...notificationPrefs, mentorshipMessages: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Community Mentions</span>
                        <Switch
                          checked={notificationPrefs.communityMentions}
                          onCheckedChange={(checked) =>
                            setNotificationPrefs({ ...notificationPrefs, communityMentions: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <span className="text-sm text-white">Billing Notifications</span>
                        <Switch
                          checked={notificationPrefs.billingNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationPrefs({ ...notificationPrefs, billingNotifications: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-300">Security</Label>
                    <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300">
                      <Shield className="mr-2" size={16} />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Membership Tab */}
            {activeTab === 'membership' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Membership Plans</CardTitle>
                  <CardDescription>Choose the plan that fits your learning goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {membershipTiers.map((tier) => (
                      <Card
                        key={tier.name}
                        className={`bg-gray-900 border-2 ${
                          tier.popular
                            ? 'border-amber-500'
                            : tier.current
                            ? 'border-green-500'
                            : 'border-gray-700'
                        } relative overflow-hidden`}
                      >
                        {tier.popular && (
                          <div className="absolute top-0 right-0 bg-amber-500 text-gray-900 px-3 py-1 text-xs font-bold">
                            MOST POPULAR
                          </div>
                        )}
                        {tier.current && (
                          <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-xs font-bold">
                            CURRENT PLAN
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-white">{tier.name}</CardTitle>
                            {tier.savings && (
                              <Badge className="bg-green-600">{tier.savings}</Badge>
                            )}
                          </div>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-4xl font-bold text-amber-500">{tier.price}</span>
                            <span className="text-gray-400">{tier.period}</span>
                          </div>
                          <CardDescription className="text-gray-400">{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <Check className="text-green-500 shrink-0 mt-0.5" size={16} />
                                <span className="text-sm text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          {tier.current ? (
                            <Button disabled className="w-full bg-gray-700 text-gray-400">
                              Current Plan
                            </Button>
                          ) : tier.name === 'Free' ? (
                            <Button
                              variant="outline"
                              className="w-full border-gray-600 text-gray-400"
                              disabled
                            >
                              Downgrade to Free
                            </Button>
                          ) : (
                            <Button
                              className={`w-full ${
                                tier.popular
                                  ? 'bg-amber-500 hover:bg-amber-600 text-gray-900'
                                  : tier.name === 'Lifetime'
                                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              } font-semibold`}
                              onClick={() => handleSubscribe(tier.name, tier.priceId)}
                            >
                              {tier.name === 'Lifetime' ? 'Get Lifetime Access' : `Upgrade to ${tier.name}`}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {isPro && (
                    <div className="pt-4 border-t border-gray-700">
                      <Button
                        variant="outline"
                        className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Payment Methods</CardTitle>
                  <CardDescription>Manage your payment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="text-amber-500" size={24} />
                      <div>
                        <p className="font-semibold text-white">Visa •••• 3941</p>
                        <p className="text-sm text-gray-400">Expires 12/25</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600">Default</Badge>
                      <Button size="sm" variant="ghost" className="text-gray-400">
                        Remove
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300">
                    <Plus className="mr-2" size={16} />
                    Add New Payment Method
                  </Button>
                  <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg flex items-start space-x-2">
                    <Shield className="text-blue-500 shrink-0" size={20} />
                    <p className="text-sm text-gray-300">
                      Your payment details are encrypted and never stored directly by TechMigo.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Transaction History</CardTitle>
                  <CardDescription>View your payment history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Date</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">
                            Description
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Amount</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Status</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            date: 'Oct 02, 2025',
                            desc: 'Pro Annual Subscription',
                            amount: '$249',
                            status: 'Paid',
                          },
                          { date: 'Jul 02, 2025', desc: 'Course Upgrade', amount: '$49', status: 'Paid' },
                          {
                            date: 'Mar 01, 2025',
                            desc: 'Mentor Add-on',
                            amount: '$29',
                            status: 'Failed',
                          },
                        ].map((transaction, i) => (
                          <tr key={i} className="border-b border-gray-700">
                            <td className="py-3 px-2 text-sm text-gray-300">{transaction.date}</td>
                            <td className="py-3 px-2 text-sm text-white">{transaction.desc}</td>
                            <td className="py-3 px-2 text-sm text-white font-semibold">
                              {transaction.amount}
                            </td>
                            <td className="py-3 px-2">
                              <Badge
                                className={
                                  transaction.status === 'Paid' ? 'bg-green-600' : 'bg-red-600'
                                }
                              >
                                {transaction.status === 'Paid' ? (
                                  <Check className="mr-1" size={12} />
                                ) : (
                                  <X className="mr-1" size={12} />
                                )}
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-2">
                              {transaction.status === 'Paid' ? (
                                <Button size="sm" variant="ghost" className="text-amber-500">
                                  <Download size={14} />
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" className="text-blue-500">
                                  Retry
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!isPro && (
                    <div className="p-4 bg-gray-900 rounded-lg text-center">
                      <Lock className="mx-auto mb-2 text-amber-500" size={24} />
                      <p className="text-sm text-gray-400 mb-3">
                        Free users can only view the last 3 transactions
                      </p>
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                        onClick={() => setActiveTab('membership')}
                      >
                        Unlock Full History (Upgrade to Pro)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
