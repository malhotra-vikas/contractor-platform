"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Building2, ArrowLeft, CreditCard, Shield, Lock } from "lucide-react"

interface Order {
  id: string
  order_number: string
  total_amount: number
  paid_amount: number
  payment_status: string
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
    line_total: number
  }>
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [paymentData, setPaymentData] = useState({
    amount: "",
    payment_method: "credit_card",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    cardholder_name: "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Mock data - replace with API call
    const mockOrder: Order = {
      id: params.id,
      order_number: "ORD-2024-001",
      total_amount: 4299.75,
      paid_amount: 2149.88,
      payment_status: "partial",
      items: [
        { product_name: "Steel Beam 10ft", quantity: 10, unit_price: 299.99, line_total: 2999.9 },
        { product_name: "Concrete Mix 50lb", quantity: 50, unit_price: 12.99, line_total: 649.5 },
        { product_name: "Rebar #4 20ft", quantity: 25, unit_price: 45.99, line_total: 1149.75 },
      ],
    }

    setTimeout(() => {
      setOrder(mockOrder)
      setPaymentData({
        ...paymentData,
        amount: (mockOrder.total_amount - mockOrder.paid_amount).toString(),
      })
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError("")
    setSuccess("")

    try {
      // Validate payment amount
      const paymentAmount = Number.parseFloat(paymentData.amount)
      const outstandingAmount = order ? order.total_amount - order.paid_amount : 0

      if (paymentAmount <= 0 || paymentAmount > outstandingAmount) {
        setError(`Payment amount must be between $0.01 and $${outstandingAmount.toFixed(2)}`)
        setIsProcessing(false)
        return
      }

      // Simulate payment processing
      console.log("Processing payment:", paymentData)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setSuccess(`Payment of $${paymentAmount.toFixed(2)} processed successfully!`)

      // Redirect after success
      setTimeout(() => {
        window.location.href = `/orders/${params.id}`
      }, 2000)
    } catch (err) {
      setError("Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const outstandingAmount = order ? order.total_amount - order.paid_amount : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Payment</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading payment details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Payment</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Order not found</p>
            <Button asChild className="mt-4">
              <Link href="/orders">Back to Orders</Link>
            </Button>
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
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Payment</h1>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/orders/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Order
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Make Payment</h2>
            <p className="text-muted-foreground">Secure payment processing for order {order.order_number}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Payment Amount */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Payment Amount ($) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        max={outstandingAmount}
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                      <p className="text-sm text-muted-foreground">Maximum payment: ${outstandingAmount.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_method">Payment Method *</Label>
                      <Select
                        value={paymentData.payment_method}
                        onValueChange={(value) => setPaymentData({ ...paymentData, payment_method: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="debit_card">Debit Card</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Card Details */}
                {(paymentData.payment_method === "credit_card" || paymentData.payment_method === "debit_card") && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Card Details
                      </CardTitle>
                      <CardDescription>Your payment information is secure and encrypted</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardholder_name">Cardholder Name *</Label>
                        <Input
                          id="cardholder_name"
                          value={paymentData.cardholder_name}
                          onChange={(e) => setPaymentData({ ...paymentData, cardholder_name: e.target.value })}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card_number">Card Number *</Label>
                        <Input
                          id="card_number"
                          value={paymentData.card_number}
                          onChange={(e) => setPaymentData({ ...paymentData, card_number: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry_month">Month *</Label>
                          <Select
                            value={paymentData.expiry_month}
                            onValueChange={(value) => setPaymentData({ ...paymentData, expiry_month: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                  {String(i + 1).padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiry_year">Year *</Label>
                          <Select
                            value={paymentData.expiry_year}
                            onValueChange={(value) => setPaymentData({ ...paymentData, expiry_year: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                                  {new Date().getFullYear() + i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing_address">Address *</Label>
                      <Input
                        id="billing_address"
                        value={paymentData.billing_address}
                        onChange={(e) => setPaymentData({ ...paymentData, billing_address: e.target.value })}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billing_city">City *</Label>
                        <Input
                          id="billing_city"
                          value={paymentData.billing_city}
                          onChange={(e) => setPaymentData({ ...paymentData, billing_city: e.target.value })}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing_state">State *</Label>
                        <Input
                          id="billing_state"
                          value={paymentData.billing_state}
                          onChange={(e) => setPaymentData({ ...paymentData, billing_state: e.target.value })}
                          placeholder="NY"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing_zip">ZIP Code *</Label>
                      <Input
                        id="billing_zip"
                        value={paymentData.billing_zip}
                        onChange={(e) => setPaymentData({ ...paymentData, billing_zip: e.target.value })}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" disabled={isProcessing} className="w-full">
                  {isProcessing ? "Processing Payment..." : `Pay $${paymentData.amount || "0.00"}`}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>{order.order_number}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.product_name} × {item.quantity}
                        </span>
                        <span>${item.line_total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-bold">${order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Paid Amount:</span>
                      <span className="font-bold">${order.paid_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Outstanding:</span>
                      <span className="font-bold">${outstandingAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <Separator />
                  <Badge
                    variant={order.payment_status === "paid" ? "default" : "secondary"}
                    className="w-full justify-center"
                  >
                    {order.payment_status}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure SSL encrypted payment</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
