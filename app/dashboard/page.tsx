"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Package, FileText, Clock, DollarSign, LogOut } from "lucide-react"

interface DashboardStats {
  activeQuotes: number
  pendingOrders: number
  totalSpent: number
  recentActivity: Array<{
    id: string
    type: "quote" | "order" | "payment"
    description: string
    date: string
    status: string
  }>
}

export default function SubcontractorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API call
    const mockStats: DashboardStats = {
      activeQuotes: 3,
      pendingOrders: 2,
      totalSpent: 15420.5,
      recentActivity: [
        {
          id: "1",
          type: "quote",
          description: "Quote request for steel beams submitted",
          date: "2024-01-15",
          status: "pending",
        },
        {
          id: "2",
          type: "order",
          description: "Order #ORD-001 delivered",
          date: "2024-01-14",
          status: "completed",
        },
        {
          id: "3",
          type: "payment",
          description: "Payment of $2,500 processed",
          date: "2024-01-13",
          status: "completed",
        },
      ],
    }

    setTimeout(() => {
      setStats(mockStats)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Subcontractor Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">Manage your quotes, orders, and business operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Quotes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeQuotes}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button asChild className="h-20 flex-col">
            <Link href="/products">
              <Package className="h-6 w-6 mb-2" />
              Browse Products
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
            <Link href="/quotes">
              <FileText className="h-6 w-6 mb-2" />
              My Quotes
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
            <Link href="/orders">
              <Package className="h-6 w-6 mb-2" />
              My Orders
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
            <Link href="/messages">
              <Clock className="h-6 w-6 mb-2" />
              Messages
            </Link>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.type === "quote" && <FileText className="h-5 w-5 text-blue-500" />}
                    {activity.type === "order" && <Package className="h-5 w-5 text-green-500" />}
                    {activity.type === "payment" && <DollarSign className="h-5 w-5 text-primary" />}
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <Badge variant={activity.status === "completed" ? "default" : "secondary"}>{activity.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
