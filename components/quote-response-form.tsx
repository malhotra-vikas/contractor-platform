"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign } from "lucide-react"

interface QuoteItem {
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
  availability_status: string
  estimated_delivery_date: string
  notes: string
}

interface QuoteResponseFormProps {
  quoteRequestId: string
  items: Array<{
    product_name: string
    quantity: number
    notes: string
  }>
  onSubmit: (quoteData: any) => void
  isLoading?: boolean
}

export function QuoteResponseForm({ quoteRequestId, items, onSubmit, isLoading }: QuoteResponseFormProps) {
  const [formData, setFormData] = useState({
    valid_until: "",
    terms: "",
    notes: "",
  })

  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(
    items.map((item) => ({
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: 0,
      line_total: 0,
      availability_status: "available",
      estimated_delivery_date: "",
      notes: item.notes,
    })),
  )

  const [error, setError] = useState("")

  const updateQuoteItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const updatedItems = [...quoteItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }

    // Recalculate line total when unit price or quantity changes
    if (field === "unit_price" || field === "quantity") {
      updatedItems[index].line_total = updatedItems[index].unit_price * updatedItems[index].quantity
    }

    setQuoteItems(updatedItems)
  }

  const getTotalAmount = () => {
    return quoteItems.reduce((sum, item) => sum + item.line_total, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.valid_until) {
      setError("Please set a valid until date")
      return
    }

    const invalidItems = quoteItems.filter((item) => item.unit_price <= 0)
    if (invalidItems.length > 0) {
      setError("Please set valid unit prices for all items")
      return
    }

    const quoteData = {
      quote_request_id: quoteRequestId,
      total_amount: getTotalAmount(),
      valid_until: formData.valid_until,
      terms: formData.terms,
      notes: formData.notes,
      items: quoteItems,
    }

    onSubmit(quoteData)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Quote Response</CardTitle>
        <CardDescription>Provide pricing and availability information for the requested items</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quote Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quote Items</h3>
            {quoteItems.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{item.product_name}</h4>
                    <Badge variant="outline">Qty: {item.quantity}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Unit Price ($) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateQuoteItem(index, "unit_price", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Availability Status</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={item.availability_status}
                        onChange={(e) => updateQuoteItem(index, "availability_status", e.target.value)}
                      >
                        <option value="available">Available</option>
                        <option value="limited">Limited Stock</option>
                        <option value="backorder">Backorder</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Delivery</Label>
                      <Input
                        type="date"
                        value={item.estimated_delivery_date}
                        onChange={(e) => updateQuoteItem(index, "estimated_delivery_date", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Line Total:</span>
                    <span className="text-lg font-bold text-primary">${item.line_total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quote Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">Total Quote Amount:</span>
                </div>
                <span className="text-2xl font-bold text-primary">${getTotalAmount().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quote Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_until">Valid Until *</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="pl-10"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              placeholder="Payment terms, delivery conditions, warranties, etc..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information or special considerations..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Sending Quote..." : "Send Quote"}
            </Button>
            <Button type="button" variant="outline" className="flex-1 bg-transparent">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
