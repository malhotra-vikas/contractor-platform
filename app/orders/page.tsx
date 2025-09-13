"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Building2, Package, Search, Eye, Truck, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Order {
  id: string
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "completed" | "cancelled"
  payment_status: "unpaid" | "partial" | "paid"
  total_amount: number
  paid_amount: number
  order_date: string
  expected_delivery_date: string
  actual_delivery_date?: string
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
    line_total: number
  }>
  shipping_address: string
  quote_number: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API call
    const mockOrders: Order[] = [
      {
        id: "1",
        order_number: "ORD-2024-001",
        status: "processing",
        payment_status: "partial",
        total_amount: 4299.75,
        paid_amount: 2149.88,
        order_date: "2024-01-15",
        expected_delivery_date: "2024-02-15",
        quote_number: "QT-2024-001",
        shipping_address: "123 Main St, City, State 12345",
        items: [
          { product_name: "Steel Beam 10ft", quantity: 10, unit_price: 299.99, line_total: 2999.9 },
          { product_name: "Concrete Mix 50lb", quantity: 50, unit_price: 12.99, line_total: 649.5 },
          { product_name: "Rebar #4 20ft", quantity: 25, unit_price: 45.99, line_total: 1149.75 },
        ],
      },
      {
        id: "2",
        order_number: "ORD-2024-002",
        status: "delivered",
        payment_status: "paid",
        total_amount: 1929.85,
        paid_amount: 1929.85,
        order_date: "2024-01-12",
        expected_delivery_date: "2024-01-25",
        actual_delivery_date: "2024-01-24",
        quote_number: "QT-2024-002",
        shipping_address: "456 Oak Ave, City, State 12346",
        items: [
          { product_name: 'PVC Pipe 4" 10ft', quantity: 20, unit_price: 28.99, line_total: 579.8 },
          { product_name: 'Plywood 4x8 3/4"', quantity: 15, unit_price: 89.99, line_total: 1349.85 },
        ],
      },
      {
        id: "3",
        order_number: "ORD-2024-003",
        status: "shipped",
        payment_status: "paid",
        total_amount: 2699.7,
        paid_amount: 2699.7,
        order_date: "2024-01-10",
        expected_delivery_date: "2024-02-20",
        quote_number: "QT-2024-003",
        shipping_address: "789 Pine Rd, City, State 12347",
        items: [{ product_name: 'Plywood 4x8 3/4"', quantity: 30, unit_price: 89.99, line_total: 2699.7 }],
      },
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.quote_number.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "processing":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "completed":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "unpaid":
        return "destructive"
      case "partial":
        return "secondary"
      case "paid":
        return "default"
      default:
        return "secondary"
    }
  }

  const getPaymentProgress = (order: Order) => {
    return (order.paid_amount / order.total_amount) * 100
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
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
            <Link href="/dashboard" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Order History</h2>
          <p className="text-muted-foreground">Track your orders and manage payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => !["delivered", "completed", "cancelled"].includes(o.status)).length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => ["delivered", "completed"].includes(o.status)).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    ${orders.reduce((sum, order) => sum + order.paid_amount, 0).toLocaleString()}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">
                    ${orders.reduce((sum, order) => sum + (order.total_amount - order.paid_amount), 0).toLocaleString()}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number or quote number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet"}
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <CardTitle className="text-lg">{order.order_number}</CardTitle>
                        <CardDescription>
                          Ordered on {new Date(order.order_date).toLocaleDateString()} • Quote: {order.quote_number}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      <Badge variant={getPaymentStatusVariant(order.payment_status)}>{order.payment_status}</Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Order Details</h4>
                      <p className="text-sm">
                        <span className="font-medium">Items:</span> {order.items.length} product(s)
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Expected Delivery:</span>{" "}
                        {new Date(order.expected_delivery_date).toLocaleDateString()}
                      </p>
                      {order.actual_delivery_date && (
                        <p className="text-sm">
                          <span className="font-medium">Delivered:</span>{" "}
                          {new Date(order.actual_delivery_date).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-sm">
                        <span className="font-medium">Shipping Address:</span> {order.shipping_address}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Payment Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Amount:</span>
                          <span className="font-bold">${order.total_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Paid Amount:</span>
                          <span className="font-bold text-green-600">${order.paid_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Outstanding:</span>
                          <span className="font-bold text-orange-600">
                            ${(order.total_amount - order.paid_amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Payment Progress</span>
                            <span>{Math.round(getPaymentProgress(order))}%</span>
                          </div>
                          <Progress value={getPaymentProgress(order)} className="h-2" />
                        </div>
                        {order.payment_status !== "paid" && (
                          <Button size="sm" className="w-full mt-3" asChild>
                            <Link href={`/orders/${order.id}/payment`}>
                              <CreditCard className="h-4 w-4 mr-1" />
                              Make Payment
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
