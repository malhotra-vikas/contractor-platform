"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Search, Filter, Package, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: string
  brand: string
  unit_price: number
  stock_quantity: number
  weight: number
  dimensions: string
  image_url: string
  is_active: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        sku: "SKU-001",
        name: "Steel Beam 10ft",
        description: "High-grade steel beam, 10 feet length",
        category: "Steel",
        brand: "SteelCorp",
        unit_price: 299.99,
        stock_quantity: 50,
        weight: 85.5,
        dimensions: "10ft x 6in x 4in",
        image_url: "/steel-beam-construction.jpg",
        is_active: true,
      },
      {
        id: "2",
        sku: "SKU-002",
        name: "Concrete Mix 50lb",
        description: "Premium concrete mix, 50 pound bag",
        category: "Concrete",
        brand: "ConcretePro",
        unit_price: 12.99,
        stock_quantity: 200,
        weight: 50.0,
        dimensions: "24in x 16in x 6in",
        image_url: "/concrete-mix-bag.png",
        is_active: true,
      },
      {
        id: "3",
        sku: "SKU-003",
        name: "Rebar #4 20ft",
        description: "Grade 60 rebar, #4 size, 20 feet",
        category: "Steel",
        brand: "SteelCorp",
        unit_price: 45.99,
        stock_quantity: 100,
        weight: 10.7,
        dimensions: "20ft x 0.5in dia",
        image_url: "/rebar-steel-construction.jpg",
        is_active: true,
      },
      {
        id: "4",
        sku: "SKU-004",
        name: 'Plywood 4x8 3/4"',
        description: "Construction grade plywood sheet",
        category: "Lumber",
        brand: "WoodWorks",
        unit_price: 89.99,
        stock_quantity: 75,
        weight: 61.0,
        dimensions: "48in x 96in x 0.75in",
        image_url: "/plywood-sheet-construction.jpg",
        is_active: true,
      },
      {
        id: "5",
        sku: "SKU-005",
        name: 'PVC Pipe 4" 10ft',
        description: "Schedule 40 PVC pipe, 4 inch diameter",
        category: "Plumbing",
        brand: "PipePro",
        unit_price: 28.99,
        stock_quantity: 150,
        weight: 12.5,
        dimensions: "10ft x 4in dia",
        image_url: "/pvc-pipe-plumbing.jpg",
        is_active: true,
      },
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, selectedBrand])

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const brands = Array.from(new Set(products.map((p) => p.brand)))

  const handleAddToQuote = (product: Product) => {
    // This would typically add to a quote request cart
    console.log("Adding to quote:", product)
    // You could show a toast notification here
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">B2B Platform</h1>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
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
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">B2B Platform</h1>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Product Catalog</h2>
          <p className="text-muted-foreground">
            Browse our comprehensive selection of construction materials and supplies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"} className="text-xs">
                      {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mb-1 line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="text-sm mb-2 line-clamp-2">{product.description}</CardDescription>
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <p>SKU: {product.sku}</p>
                    <p>Brand: {product.brand}</p>
                    <p>Stock: {product.stock_quantity} units</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">${product.unit_price.toFixed(2)}</div>
                    <Button size="sm" onClick={() => handleAddToQuote(product)} disabled={product.stock_quantity === 0}>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Quote
                    </Button>
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
