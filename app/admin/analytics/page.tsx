"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, TrendingUp, DollarSign, Package, Users, FileText, ShoppingCart } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsData {
  revenue: Array<{ month: string; revenue: number; orders: number }>
  topProducts: Array<{ name: string; sales: number; revenue: number }>
  customerActivity: Array<{ name: string; quotes: number; orders: number; value: number }>
  orderStatus: Array<{ name: string; value: number; color: string }>
  monthlyStats: {
    totalRevenue: number
    totalOrders: number
    activeCustomers: number
    pendingQuotes: number
    revenueGrowth: number
    orderGrowth: number
  }
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("6months")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock analytics data - replace with API call
    const mockData: AnalyticsData = {
      revenue: [
        { month: "Jul", revenue: 12500, orders: 15 },
        { month: "Aug", revenue: 18200, orders: 22 },
        { month: "Sep", revenue: 15800, orders: 19 },
        { month: "Oct", revenue: 22100, orders: 28 },
        { month: "Nov", revenue: 19500, orders: 24 },
        { month: "Dec", revenue: 25300, orders: 31 },
      ],
      topProducts: [
        { name: "Steel Beam 10ft", sales: 45, revenue: 13499.55 },
        { name: "Concrete Mix 50lb", sales: 120, revenue: 1558.8 },
        { name: 'Plywood 4x8 3/4"', sales: 35, revenue: 3149.65 },
        { name: "Rebar #4 20ft", sales: 28, revenue: 1287.72 },
        { name: 'PVC Pipe 4" 10ft', sales: 22, revenue: 637.78 },
      ],
      customerActivity: [
        { name: "ABC Construction", quotes: 8, orders: 6, value: 15420.5 },
        { name: "XYZ Builders", quotes: 5, orders: 4, value: 8750.25 },
        { name: "Johnson Contractors", quotes: 6, orders: 3, value: 12300.75 },
        { name: "Smith & Co", quotes: 4, orders: 2, value: 5680.0 },
        { name: "BuildRight Inc", quotes: 3, orders: 3, value: 9200.5 },
      ],
      orderStatus: [
        { name: "Completed", value: 45, color: "#059669" },
        { name: "Processing", value: 12, color: "#3b82f6" },
        { name: "Shipped", value: 8, color: "#f59e0b" },
        { name: "Pending", value: 5, color: "#6b7280" },
      ],
      monthlyStats: {
        totalRevenue: 25300,
        totalOrders: 31,
        activeCustomers: 23,
        pendingQuotes: 8,
        revenueGrowth: 12.5,
        orderGrowth: 8.3,
      },
    }

    setTimeout(() => {
      setAnalyticsData(mockData)
      setIsLoading(false)
    }, 1000)
  }, [timeRange])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            </Link>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Business Analytics</h2>
          <p className="text-muted-foreground">Track your business performance and growth metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsData.monthlyStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analyticsData.monthlyStats.revenueGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.monthlyStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analyticsData.monthlyStats.orderGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.monthlyStats.activeCustomers}</div>
              <p className="text-xs text-muted-foreground">Subcontractors with orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.monthlyStats.pendingQuotes}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Monthly revenue and order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status Distribution
              </CardTitle>
              <CardDescription>Current order status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.orderStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.topProducts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Customer Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Most active customers by order value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.customerActivity.map((customer, index) => (
                  <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.quotes} quotes • {customer.orders} orders
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">${customer.value.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total value</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
