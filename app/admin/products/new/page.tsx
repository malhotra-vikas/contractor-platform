"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, ArrowLeft } from "lucide-react"
import { ProductForm } from "@/components/product-form"

export default function NewProductPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (productData: any) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      console.log("Creating product:", productData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to products list
      window.location.href = "/admin/products"
    } catch (error) {
      console.error("Error creating product:", error)
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
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Add New Product</h2>
          <p className="text-muted-foreground">Create a new product listing for your catalog</p>
        </div>

        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
