"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Package, Search, Plus, Edit, Trash2, AlertTriangle } from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: string
  brand: string
  unit_price: number
  cost_price: number
  stock_quantity: number
  min_stock_level: number
  is_active: boolean
  created_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API call
    const mockProducts: Product[] = [
      {
        id: "1",
        sku: "SKU-001",
        name: "Steel Beam 10ft",
        description: "High-grade steel beam, 10 feet length",
        category: "Steel",
        brand: "SteelCorp",
        unit_price: 299.99,
        cost_price: 199.99,
        stock_quantity: 50,
        min_stock_level: 10,
        is_active: true,
        created_at: "2024-01-01",
      },
      {
        id: "2",
        sku: "SKU-002",
        name: "Concrete Mix 50lb",
        description: "Premium concrete mix, 50 pound bag",
        category: "Concrete",
        brand: "ConcretePro",
        unit_price: 12.99,
        cost_price: 8.5,
        stock_quantity: 200,
        min_stock_level: 25,
        is_active: true,
        created_at: "2024-01-01",
      },
      {
        id: "3",
        sku: "SKU-003",
        name: "Rebar #4 20ft",
        description: "Grade 60 rebar, #4 size, 20 feet",
        category: "Steel",
        brand: "SteelCorp",
        unit_price: 45.99,
        cost_price: 32.0,
        stock_quantity: 5,
        min_stock_level: 15,
        is_active: true,
        created_at: "2024-01-01",
      },
      {
        id: "4",
        sku: "SKU-004",
        name: 'Plywood 4x8 3/4"',
        description: "Construction grade plywood sheet",
        category: "Lumber",
        brand: "WoodWorks",
        unit_price: 89.99,
        cost_price: 65.0,
        stock_quantity: 75,
        min_stock_level: 20,
        is_active: true,
        created_at: "2024-01-01",
      },
      {
        id: "5",
        sku: "SKU-005",
        name: 'PVC Pipe 4" 10ft',
        description: "Schedule 40 PVC pipe, 4 inch diameter",
        category: "Plumbing",
        brand: "PipePro",
        unit_price: 28.99,
        cost_price: 18.5,
        stock_quantity: 150,
        min_stock_level: 30,
        is_active: false,
        created_at: "2024-01-01",
      },
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((product) => product.is_active)
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((product) => !product.is_active)
      } else if (statusFilter === "low_stock") {
        filtered = filtered.filter((product) => product.stock_quantity <= product.min_stock_level)
      }
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, categoryFilter, statusFilter])

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const lowStockCount = products.filter((p) => p.stock_quantity <= p.min_stock_level).length
  const inactiveCount = products.filter((p) => !p.is_active).length

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId))
    }
  }

  const toggleProductStatus = (productId: string) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, is_active: !p.is_active } : p)))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading products...</p>
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
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
            </Link>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Product Catalog</h2>
          <p className="text-muted-foreground">Manage your product inventory and pricing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Products</p>
                  <p className="text-2xl font-bold">{products.filter((p) => p.is_active).length}</p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold">{lowStockCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{inactiveCount}</p>
                </div>
                <Package className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name, SKU, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product catalog and inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You haven't added any products yet"}
                </p>
                <Button asChild>
                  <Link href="/admin/products/new">Add Your First Product</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">${product.unit_price.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">Cost: ${product.cost_price.toFixed(2)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{product.stock_quantity}</span>
                            {product.stock_quantity <= product.min_stock_level && (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">Min: {product.min_stock_level}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleProductStatus(product.id)}
                              className={product.is_active ? "text-orange-600" : "text-green-600"}
                            >
                              {product.is_active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
