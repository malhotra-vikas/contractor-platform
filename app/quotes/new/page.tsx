"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, ArrowLeft, Plus, Trash2, Package } from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  unit_price: number
  stock_quantity: number
}

interface QuoteItem {
  product_id: string
  product_name: string
  quantity: number
  notes: string
}

export default function NewQuotePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    notes: "",
    requested_delivery_date: "",
  })
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Mock products data - replace with API call
    const mockProducts: Product[] = [
      { id: "1", sku: "SKU-001", name: "Steel Beam 10ft", unit_price: 299.99, stock_quantity: 50 },
      { id: "2", sku: "SKU-002", name: "Concrete Mix 50lb", unit_price: 12.99, stock_quantity: 200 },
      { id: "3", sku: "SKU-003", name: "Rebar #4 20ft", unit_price: 45.99, stock_quantity: 100 },
      { id: "4", sku: "SKU-004", name: 'Plywood 4x8 3/4"', unit_price: 89.99, stock_quantity: 75 },
      { id: "5", sku: "SKU-005", name: 'PVC Pipe 4" 10ft', unit_price: 28.99, stock_quantity: 150 },
    ]
    setProducts(mockProducts)
  }, [])

  const addQuoteItem = () => {
    setQuoteItems([
      ...quoteItems,
      {
        product_id: "",
        product_name: "",
        quantity: 1,
        notes: "",
      },
    ])
  }

  const removeQuoteItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index))
  }

  const updateQuoteItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const updatedItems = [...quoteItems]
    if (field === "product_id") {
      const selectedProduct = products.find((p) => p.id === value)
      updatedItems[index] = {
        ...updatedItems[index],
        product_id: value as string,
        product_name: selectedProduct?.name || "",
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }
    }
    setQuoteItems(updatedItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (quoteItems.length === 0) {
      setError("Please add at least one product to your quote request")
      setIsLoading(false)
      return
    }

    const invalidItems = quoteItems.filter((item) => !item.product_id || item.quantity <= 0)
    if (invalidItems.length > 0) {
      setError("Please ensure all items have a product selected and valid quantity")
      setIsLoading(false)
      return
    }

    try {
      const quoteRequestData = {
        ...formData,
        items: quoteItems,
      }

      console.log("Creating quote request:", quoteRequestData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess("Quote request submitted successfully! You will receive a response within 24 hours.")
      setFormData({ notes: "", requested_delivery_date: "" })
      setQuoteItems([])
    } catch (err) {
      setError("Failed to submit quote request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">New Quote Request</h1>
            </div>
            <Button variant="outline" asChild>
              <Link href="/quotes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quotes
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Quote Request</h2>
            <p className="text-muted-foreground">Request pricing for the products you need</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
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

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
                <CardDescription>Provide details about your quote request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Project Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Describe your project and any specific requirements..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_date">Requested Delivery Date</Label>
                  <Input
                    id="delivery_date"
                    type="date"
                    value={formData.requested_delivery_date}
                    onChange={(e) => setFormData({ ...formData, requested_delivery_date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quote Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Select the products you need for your project</CardDescription>
                  </div>
                  <Button type="button" onClick={addQuoteItem} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quoteItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No products added yet</p>
                    <Button type="button" onClick={addQuoteItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quoteItems.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Product {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuoteItem(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Product *</Label>
                            <Select
                              value={item.product_id}
                              onValueChange={(value) => updateQuoteItem(index, "product_id", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} - ${product.unit_price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuoteItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                              placeholder="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input
                              value={item.notes}
                              onChange={(e) => updateQuoteItem(index, "notes", e.target.value)}
                              placeholder="Special requirements..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Submitting Request..." : "Submit Quote Request"}
              </Button>
              <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/quotes">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
