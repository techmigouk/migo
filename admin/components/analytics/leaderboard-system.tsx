"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Award, TrendingUp, Crown, Star, Zap } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  previousRank: number
  userId: string
  name: string
  avatar: string
  points: number
  coursesCompleted: number
  achievements: number
  streak: number
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    previousRank: 2,
    userId: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    points: 12450,
    coursesCompleted: 15,
    achievements: 42,
    streak: 87,
    tier: "diamond",
  },
  {
    rank: 2,
    previousRank: 1,
    userId: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    points: 11890,
    coursesCompleted: 14,
    achievements: 38,
    streak: 65,
    tier: "diamond",
  },
  {
    rank: 3,
    previousRank: 3,
    userId: "3",
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    points: 10230,
    coursesCompleted: 12,
    achievements: 35,
    streak: 52,
    tier: "platinum",
  },
  {
    rank: 4,
    previousRank: 5,
    userId: "4",
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    points: 9870,
    coursesCompleted: 11,
    achievements: 32,
    streak: 48,
    tier: "platinum",
  },
  {
    rank: 5,
    previousRank: 4,
    userId: "5",
    name: "Jessica Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    points: 9450,
    coursesCompleted: 10,
    achievements: 30,
    streak: 41,
    tier: "platinum",
  },
]

const tierColors = {
  bronze: "bg-orange-700",
  silver: "bg-gray-400",
  gold: "bg-yellow-500",
  platinum: "bg-cyan-500",
  diamond: "bg-purple-500",
}

const tierIcons = {
  bronze: Medal,
  silver: Medal,
  gold: Trophy,
  platinum: Crown,
  diamond: Star,
}

export function LeaderboardSystem() {
  const [timeframe, setTimeframe] = useState("all-time")
  const [category, setCategory] = useState("overall")

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>
  }

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) {
      return (
        <div className="flex items-center gap-1 text-green-500">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">+{previous - current}</span>
        </div>
      )
    } else if (current > previous) {
      return (
        <div className="flex items-center gap-1 text-red-500">
          <TrendingUp className="h-4 w-4 rotate-180" />
          <span className="text-xs">-{current - previous}</span>
        </div>
      )
    }
    return <span className="text-xs text-gray-500">—</span>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Leaderboard & Rankings</h1>
        <p className="mt-2 text-gray-400">Track top performers and competitive rankings</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid gap-4 md:grid-cols-3">
        {mockLeaderboard.slice(0, 3).map((entry, index) => {
          const TierIcon = tierIcons[entry.tier]
          return (
            <Card
              key={entry.userId}
              className={`border-gray-800 bg-gradient-to-br ${
                index === 0
                  ? "from-yellow-900/20 to-gray-800"
                  : index === 1
                    ? "from-gray-700/20 to-gray-800"
                    : "from-orange-900/20 to-gray-800"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">{getRankIcon(entry.rank)}</div>
                  <Avatar className="h-20 w-20 border-4 border-amber-600">
                    <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                      {entry.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-3 font-semibold text-gray-100">{entry.name}</h3>
                  <div className="mt-2 flex items-center gap-1">
                    <TierIcon className={`h-4 w-4 ${tierColors[entry.tier].replace("bg-", "text-")}`} />
                    <Badge variant="secondary" className={tierColors[entry.tier]}>
                      {entry.tier}
                    </Badge>
                  </div>
                  <div className="mt-4 text-3xl font-bold text-amber-500">{entry.points.toLocaleString()}</div>
                  <p className="text-sm text-gray-400">points</p>
                  <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-100">{entry.coursesCompleted}</div>
                      <div className="text-xs text-gray-500">Courses</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-100">{entry.achievements}</div>
                      <div className="text-xs text-gray-500">Badges</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-gray-100">
                        <Zap className="h-4 w-4 text-orange-500" />
                        {entry.streak}
                      </div>
                      <div className="text-xs text-gray-500">Streak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="border-gray-800 bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs value={category} onValueChange={setCategory} className="w-full md:w-auto">
              <TabsList className="bg-gray-900">
                <TabsTrigger value="overall" className="data-[state=active]:bg-amber-600">
                  Overall
                </TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-amber-600">
                  Courses
                </TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-amber-600">
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="streak" className="data-[state=active]:bg-amber-600">
                  Streak
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px] border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-gray-700 bg-gray-900 text-gray-100">
                Export Rankings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Complete Rankings</CardTitle>
          <CardDescription className="text-gray-400">Full leaderboard with detailed statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Rank</TableHead>
                <TableHead className="text-gray-400">Change</TableHead>
                <TableHead className="text-gray-400">Student</TableHead>
                <TableHead className="text-gray-400">Tier</TableHead>
                <TableHead className="text-gray-400">Points</TableHead>
                <TableHead className="text-gray-400">Courses</TableHead>
                <TableHead className="text-gray-400">Achievements</TableHead>
                <TableHead className="text-gray-400">Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaderboard.map((entry) => {
                const TierIcon = tierIcons[entry.tier]
                return (
                  <TableRow key={entry.userId} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell>
                      <div className="flex items-center gap-2">{getRankIcon(entry.rank)}</div>
                    </TableCell>
                    <TableCell>{getRankChange(entry.rank, entry.previousRank)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-700 text-gray-300">
                            {entry.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-gray-100">{entry.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TierIcon className={`h-4 w-4 ${tierColors[entry.tier].replace("bg-", "text-")}`} />
                        <Badge variant="secondary" className={tierColors[entry.tier]}>
                          {entry.tier}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-amber-500">{entry.points.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-300">{entry.coursesCompleted}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Award className="h-4 w-4 text-amber-500" />
                        {entry.achievements}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Zap className="h-4 w-4 text-orange-500" />
                        {entry.streak} days
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tier Information */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Tier System</CardTitle>
          <CardDescription className="text-gray-400">
            Progress through tiers by earning points and completing courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { tier: "bronze", min: 0, max: 999, icon: Medal },
              { tier: "silver", min: 1000, max: 2999, icon: Medal },
              { tier: "gold", min: 3000, max: 6999, icon: Trophy },
              { tier: "platinum", min: 7000, max: 11999, icon: Crown },
              { tier: "diamond", min: 12000, max: null, icon: Star },
            ].map(({ tier, min, max, icon: Icon }) => (
              <div key={tier} className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center">
                <Icon
                  className={`mx-auto h-8 w-8 ${tierColors[tier as keyof typeof tierColors].replace("bg-", "text-")}`}
                />
                <h3 className="mt-2 font-semibold capitalize text-gray-100">{tier}</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {min.toLocaleString()}
                  {max ? ` - ${max.toLocaleString()}` : "+"} pts
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
