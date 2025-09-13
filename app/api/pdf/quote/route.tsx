import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { quoteId } = await request.json()

    // Mock quote data - replace with database query
    const mockQuote = {
      quote_number: "QT-2024-001",
      quote_request_number: "QR-2024-001",
      customer: {
        name: "John Smith",
        company: "ABC Construction",
        email: "john@abcconstruction.com",
        phone: "+1-555-0101",
        address: "123 Main St, City, State 12345",
      },
      items: [
        {
          product_name: "Steel Beam 10ft",
          quantity: 10,
          unit_price: 299.99,
          line_total: 2999.9,
          availability: "Available",
          estimated_delivery: "2024-02-15",
        },
        {
          product_name: "Concrete Mix 50lb",
          quantity: 50,
          unit_price: 12.99,
          line_total: 649.5,
          availability: "Available",
          estimated_delivery: "2024-02-15",
        },
        {
          product_name: "Rebar #4 20ft",
          quantity: 25,
          unit_price: 45.99,
          line_total: 1149.75,
          availability: "Limited Stock",
          estimated_delivery: "2024-02-20",
        },
      ],
      subtotal: 4799.15,
      tax_rate: 0.08,
      tax_amount: 383.93,
      total_amount: 5183.08,
      valid_until: "2024-02-01",
      terms: "Payment due within 30 days. Delivery charges may apply.",
      notes: "All prices are subject to availability and market conditions.",
      created_date: "2024-01-15",
    }

    // Generate HTML for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quote ${mockQuote.quote_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
          .company-info { display: flex; justify-content: space-between; align-items: start; }
          .logo { font-size: 24px; font-weight: bold; color: #059669; }
          .quote-info { text-align: right; }
          .customer-info { margin-bottom: 30px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .items-table th { background-color: #f8f9fa; font-weight: bold; }
          .items-table .number { text-align: right; }
          .totals { margin-left: auto; width: 300px; }
          .totals table { width: 100%; }
          .totals td { padding: 8px; border-bottom: 1px solid #eee; }
          .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #059669; }
          .terms { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <div>
              <div class="logo">B2B Platform</div>
              <div>Professional Construction Supplies</div>
              <div>Email: admin@platform.com</div>
              <div>Phone: +1-555-0100</div>
            </div>
            <div class="quote-info">
              <h2>QUOTE</h2>
              <div><strong>Quote #:</strong> ${mockQuote.quote_number}</div>
              <div><strong>Request #:</strong> ${mockQuote.quote_request_number}</div>
              <div><strong>Date:</strong> ${new Date(mockQuote.created_date).toLocaleDateString()}</div>
              <div><strong>Valid Until:</strong> ${new Date(mockQuote.valid_until).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div class="customer-info">
          <h3>Quote For:</h3>
          <div><strong>${mockQuote.customer.name}</strong></div>
          <div>${mockQuote.customer.company}</div>
          <div>${mockQuote.customer.address}</div>
          <div>Email: ${mockQuote.customer.email}</div>
          <div>Phone: ${mockQuote.customer.phone}</div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Line Total</th>
              <th>Availability</th>
              <th>Est. Delivery</th>
            </tr>
          </thead>
          <tbody>
            ${mockQuote.items
              .map(
                (item) => `
              <tr>
                <td>${item.product_name}</td>
                <td class="number">${item.quantity}</td>
                <td class="number">$${item.unit_price.toFixed(2)}</td>
                <td class="number">$${item.line_total.toFixed(2)}</td>
                <td>${item.availability}</td>
                <td>${new Date(item.estimated_delivery).toLocaleDateString()}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td>Subtotal:</td>
              <td class="number">$${mockQuote.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Tax (${(mockQuote.tax_rate * 100).toFixed(1)}%):</td>
              <td class="number">$${mockQuote.tax_amount.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>Total:</td>
              <td class="number">$${mockQuote.total_amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="terms">
          <h3>Terms & Conditions:</h3>
          <p>${mockQuote.terms}</p>
          ${mockQuote.notes ? `<p><strong>Notes:</strong> ${mockQuote.notes}</p>` : ""}
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This quote is valid until ${new Date(mockQuote.valid_until).toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `

    // In a real application, you would use a library like Puppeteer or jsPDF
    // For now, we'll return the HTML content that can be used to generate PDF
    return NextResponse.json({
      success: true,
      html: htmlContent,
      filename: `quote-${mockQuote.quote_number}.pdf`,
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
