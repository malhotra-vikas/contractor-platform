"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download } from "lucide-react"

interface PDFGeneratorProps {
  type: "quote" | "purchase-order"
  id: string
  label?: string
  className?: string
}

export function PDFGenerator({ type, id, label, className }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const generatePDF = async () => {
    setIsGenerating(true)
    setError("")

    try {
      const endpoint = type === "quote" ? "/api/pdf/quote" : "/api/pdf/purchase-order"
      const payload = type === "quote" ? { quoteId: id } : { orderId: id }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        // Create a blob from the HTML content and trigger download
        // In a real application, you would convert HTML to PDF on the server
        const blob = new Blob([data.html], { type: "text/html" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = data.filename.replace(".pdf", ".html") // For demo purposes
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        setError(data.error || "Failed to generate PDF")
      }
    } catch (err) {
      setError("An error occurred while generating the PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={generatePDF} disabled={isGenerating} variant="outline" size="sm">
        {isGenerating ? (
          <>
            <FileText className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            {label || `Download ${type === "quote" ? "Quote" : "Purchase Order"} PDF`}
          </>
        )}
      </Button>
    </div>
  )
}
