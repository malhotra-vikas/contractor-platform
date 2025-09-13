import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    // Mock order data - replace with database query
    const mockOrder = {
      order_number: "ORD-2024-001",
      quote_number: "QT-2024-001",
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
          sku: "SKU-001",
          quantity: 10,
          unit_price: 299.99,
          line_total: 2999.9,
        },
        {
          product_name: "Concrete Mix 50lb",
          sku: "SKU-002",
          quantity: 50,
          unit_price: 12.99,
          line_total: 649.5,
        },
        {
          product_name: "Rebar #4 20ft",
          sku: "SKU-003",
          quantity: 25,
          unit_price: 45.99,
          line_total: 1149.75,
        },
      ],
      subtotal: 4799.15,
      tax_rate: 0.08,
      tax_amount: 383.93,
      total_amount: 5183.08,
      order_date: "2024-01-15",
      expected_delivery_date: "2024-02-15",
      shipping_address: "123 Main St, City, State 12345",
      payment_terms: "Net 30",
      status: "confirmed",
    }

    // Generate HTML for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Purchase Order ${mockOrder.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
          .company-info { display: flex; justify-content: space-between; align-items: start; }
          .logo { font-size: 24px; font-weight: bold; color: #059669; }
          .po-info { text-align: right; }
          .customer-info { margin-bottom: 30px; }
          .shipping-info { margin-bottom: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
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
          .status-badge { display: inline-block; padding: 4px 12px; background-color: #059669; color: white; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
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
            <div class="po-info">
              <h2>PURCHASE ORDER</h2>
              <div><strong>PO #:</strong> ${mockOrder.order_number}</div>
              <div><strong>Quote #:</strong> ${mockOrder.quote_number}</div>
              <div><strong>Order Date:</strong> ${new Date(mockOrder.order_date).toLocaleDateString()}</div>
              <div><strong>Expected Delivery:</strong> ${new Date(mockOrder.expected_delivery_date).toLocaleDateString()}</div>
              <div style="margin-top: 10px;"><span class="status-badge">${mockOrder.status}</span></div>
            </div>
          </div>
        </div>

        <div class="customer-info">
          <h3>Bill To:</h3>
          <div><strong>${mockOrder.customer.name}</strong></div>
          <div>${mockOrder.customer.company}</div>
          <div>${mockOrder.customer.address}</div>
          <div>Email: ${mockOrder.customer.email}</div>
          <div>Phone: ${mockOrder.customer.phone}</div>
        </div>

        <div class="shipping-info">
          <h3>Ship To:</h3>
          <div>${mockOrder.shipping_address}</div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            ${mockOrder.items
              .map(
                (item) => `
              <tr>
                <td>${item.sku}</td>
                <td>${item.product_name}</td>
                <td class="number">${item.quantity}</td>
                <td class="number">$${item.unit_price.toFixed(2)}</td>
                <td class="number">$${item.line_total.toFixed(2)}</td>
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
              <td class="number">$${mockOrder.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Tax (${(mockOrder.tax_rate * 100).toFixed(1)}%):</td>
              <td class="number">$${mockOrder.tax_amount.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>Total:</td>
              <td class="number">$${mockOrder.total_amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="terms">
          <h3>Terms & Conditions:</h3>
          <p><strong>Payment Terms:</strong> ${mockOrder.payment_terms}</p>
          <p><strong>Delivery:</strong> Expected delivery date is ${new Date(mockOrder.expected_delivery_date).toLocaleDateString()}. Actual delivery may vary based on product availability and shipping conditions.</p>
          <p><strong>Returns:</strong> All returns must be authorized and in original condition within 30 days of delivery.</p>
          <p><strong>Warranty:</strong> Products are covered by manufacturer warranty. Please retain this purchase order for warranty claims.</p>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>For questions about this order, please contact us at admin@platform.com or +1-555-0100</p>
          <p>Purchase Order generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `

    // In a real application, you would use a library like Puppeteer or jsPDF
    // For now, we'll return the HTML content that can be used to generate PDF
    return NextResponse.json({
      success: true,
      html: htmlContent,
      filename: `purchase-order-${mockOrder.order_number}.pdf`,
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
