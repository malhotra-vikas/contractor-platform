"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, FileText, Search, Plus, Eye, Clock, CheckCircle, XCircle } from "lucide-react"

interface QuoteRequest {
  id: string
  request_number: string
  status: "pending" | "quoted" | "approved" | "rejected" | "expired"
  notes: string
  requested_delivery_date: string
  created_at: string
  items: Array<{
    product_name: string
    quantity: number
    notes: string
  }>
  quote?: {
    quote_number: string
    total_amount: number
    valid_until: string
    status: "sent" | "accepted" | "rejected" | "expired"
  }
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API call
    const mockQuotes: QuoteRequest[] = [
      {
        id: "1",
        request_number: "QR-2024-001",
        status: "quoted",
        notes: "Need materials for new construction project",
        requested_delivery_date: "2024-02-15",
        created_at: "2024-01-10",
        items: [
          { product_name: "Steel Beam 10ft", quantity: 10, notes: "For main structure" },
          { product_name: "Concrete Mix 50lb", quantity: 50, notes: "Foundation work" },
          { product_name: "Rebar #4 20ft", quantity: 25, notes: "Reinforcement" },
        ],
        quote: {
          quote_number: "QT-2024-001",
          total_amount: 4299.75,
          valid_until: "2024-02-01",
          status: "sent",
        },
      },
      {
        id: "2",
        request_number: "QR-2024-002",
        status: "pending",
        notes: "Urgent order for plumbing supplies",
        requested_delivery_date: "2024-01-25",
        created_at: "2024-01-12",
        items: [
          { product_name: 'PVC Pipe 4" 10ft', quantity: 20, notes: "Main drainage system" },
          { product_name: 'Plywood 4x8 3/4"', quantity: 15, notes: "Temporary flooring" },
        ],
      },
      {
        id: "3",
        request_number: "QR-2024-003",
        status: "approved",
        notes: "Materials for office renovation",
        requested_delivery_date: "2024-02-20",
        created_at: "2024-01-08",
        items: [{ product_name: 'Plywood 4x8 3/4"', quantity: 30, notes: "Wall partitions" }],
        quote: {
          quote_number: "QT-2024-003",
          total_amount: 2699.7,
          valid_until: "2024-01-30",
          status: "accepted",
        },
      },
    ]

    setTimeout(() => {
      setQuotes(mockQuotes)
      setFilteredQuotes(mockQuotes)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = quotes

    if (searchTerm) {
      filtered = filtered.filter(
        (quote) =>
          quote.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.notes.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((quote) => quote.status === statusFilter)
    }

    setFilteredQuotes(filtered)
  }, [quotes, searchTerm, statusFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "quoted":
        return <FileText className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "quoted":
        return "default"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "expired":
        return "secondary"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">My Quotes</h1>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading quotes...</p>
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
              <h1 className="text-2xl font-bold text-foreground">My Quotes</h1>
            </Link>
            <Button asChild>
              <Link href="/quotes/new">
                <Plus className="h-4 w-4 mr-2" />
                New Quote Request
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Quote Requests</h2>
          <p className="text-muted-foreground">Manage your quote requests and track their progress</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by quote number or notes..."
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
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredQuotes.length} of {quotes.length} quote requests
          </p>
        </div>

        {/* Quotes List */}
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No quotes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't created any quote requests yet"}
            </p>
            <Button asChild>
              <Link href="/quotes/new">Create Your First Quote Request</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(quote.status)}
                      <div>
                        <CardTitle className="text-lg">{quote.request_number}</CardTitle>
                        <CardDescription>Created on {new Date(quote.created_at).toLocaleDateString()}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(quote.status)}>{quote.status}</Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/quotes/${quote.id}`}>
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
                      <h4 className="font-semibold mb-2">Request Details</h4>
                      <p className="text-sm text-muted-foreground mb-2">{quote.notes}</p>
                      <p className="text-sm">
                        <span className="font-medium">Delivery Date:</span>{" "}
                        {new Date(quote.requested_delivery_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Items:</span> {quote.items.length} product(s)
                      </p>
                    </div>
                    {quote.quote && (
                      <div>
                        <h4 className="font-semibold mb-2">Quote Details</h4>
                        <p className="text-sm">
                          <span className="font-medium">Quote #:</span> {quote.quote.quote_number}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Total Amount:</span>{" "}
                          <span className="text-lg font-bold text-primary">
                            ${quote.quote.total_amount.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Valid Until:</span>{" "}
                          {new Date(quote.quote.valid_until).toLocaleDateString()}
                        </p>
                        <Badge variant={quote.quote.status === "accepted" ? "default" : "secondary"} className="mt-2">
                          {quote.quote.status}
                        </Badge>
                      </div>
                    )}
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
