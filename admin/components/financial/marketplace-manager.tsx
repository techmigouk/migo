"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, ShoppingBag, DollarSign, TrendingUp, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  seller: string
  category: string
  price: number
  sales: number
  revenue: number
  rating: number
  status: "active" | "pending" | "rejected"
  commission: number
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Advanced React Patterns Course",
    seller: "John Smith",
    category: "Courses",
    price: 99,
    sales: 234,
    revenue: 23166,
    rating: 4.8,
    status: "active",
    commission: 30,
  },
  {
    id: "2",
    name: "TypeScript Masterclass Bundle",
    seller: "Sarah Johnson",
    category: "Courses",
    price: 149,
    sales: 156,
    revenue: 23244,
    rating: 4.9,
    status: "active",
    commission: 30,
  },
  {
    id: "3",
    name: "1-on-1 Mentorship Package",
    seller: "Michael Chen",
    category: "Services",
    price: 299,
    sales: 45,
    revenue: 13455,
    rating: 5.0,
    status: "active",
    commission: 20,
  },
]

export function MarketplaceManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [addProductOpen, setAddProductOpen] = useState(false)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Marketplace Management</h1>
          <p className="mt-2 text-gray-400">Manage products, services, and marketplace transactions</p>
        </div>
        <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Add New Product</DialogTitle>
              <DialogDescription className="text-gray-400">List a new product in the marketplace</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name" className="text-gray-300">
                  Product Name
                </Label>
                <Input
                  id="product-name"
                  placeholder="Enter product name..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Category
                  </Label>
                  <Select defaultValue="courses">
                    <SelectTrigger id="category" className="border-gray-700 bg-gray-900 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="courses">Courses</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="ebooks">E-books</SelectItem>
                      <SelectItem value="templates">Templates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="99"
                    className="border-gray-700 bg-gray-900 text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller" className="text-gray-300">
                  Seller
                </Label>
                <Select defaultValue="self">
                  <SelectTrigger id="seller" className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="self">Platform (TechMigo)</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission" className="text-gray-300">
                  Commission Rate (%)
                </Label>
                <Input
                  id="commission"
                  type="number"
                  placeholder="30"
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product..."
                  rows={4}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700">Add Product</Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                  onClick={() => setAddProductOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">156</div>
            <p className="mt-1 text-xs text-green-500">+12 this month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">2,543</div>
            <p className="mt-1 text-xs text-green-500">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">$245K</div>
            <p className="mt-1 text-xs text-green-500">+23.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">4.7</div>
            <p className="mt-1 text-xs text-gray-500">Across all products</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-800 bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-700 bg-gray-900 pl-10 text-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-gray-700 bg-gray-900 text-gray-100">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-gray-700 bg-gray-900 text-gray-100">
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">All Products</CardTitle>
          <CardDescription className="text-gray-400">Manage marketplace listings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-400">Product</TableHead>
                <TableHead className="text-gray-400">Seller</TableHead>
                <TableHead className="text-gray-400">Category</TableHead>
                <TableHead className="text-gray-400">Price</TableHead>
                <TableHead className="text-gray-400">Sales</TableHead>
                <TableHead className="text-gray-400">Revenue</TableHead>
                <TableHead className="text-gray-400">Rating</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="font-medium text-gray-100">{product.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gray-700 text-gray-300">
                          {product.seller
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-300">{product.seller}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-700">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">${product.price}</TableCell>
                  <TableCell className="text-gray-300">{product.sales}</TableCell>
                  <TableCell className="font-semibold text-amber-500">${product.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">⭐ {product.rating}</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={
                        product.status === "active"
                          ? "bg-green-600"
                          : product.status === "pending"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-amber-500 hover:bg-gray-700 hover:text-amber-400">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
