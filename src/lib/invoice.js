/**
 * Print / Save Order Invoice as PDF
 */
export function printOrderInvoice(order) {
  if (!order) return;

  const orderId = order.orderId || order._id || "N/A";
  const orderDate = order.date || new Date(order.createdAt || Date.now()).toLocaleDateString();
  const customerName = order.customerName || "Valued Customer";
  const phone = order.phone || "N/A";
  const address = order.address || "N/A";
  const city = order.city || "";
  const paymentMethod = order.paymentMethod || "Cash on Delivery";
  const paymentStatus = order.paymentStatus || "Pending";
  const status = order.status || "Processing";
  const subtotal = Number(order.subtotal || order.total || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const total = Number(order.total || subtotal + deliveryFee);

  const itemsHtml = (order.items || [])
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #111827;">${item.name || "Product"}</strong>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity || 1} ${item.unit || "piece"}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">৳${Number(item.price || 0).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">৳${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${orderId} - Kundu Agro & Fisheries</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 30px;
            color: #1f2937;
            background: #fff;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          }
          .header-table {
            width: 100%;
            margin-bottom: 24px;
            border-bottom: 2px solid #059669;
            padding-bottom: 16px;
          }
          .company-title {
            font-size: 22px;
            font-weight: 800;
            color: #047857;
            margin: 0;
          }
          .company-subtitle {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: 900;
            color: #111827;
            text-align: right;
            margin: 0;
          }
          .meta-table {
            width: 100%;
            margin-bottom: 24px;
          }
          .section-card {
            background: #f9fafb;
            border: 1px solid #f3f4f6;
            border-radius: 12px;
            padding: 16px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            margin-bottom: 24px;
          }
          .items-table th {
            background: #047857;
            color: #ffffff;
            padding: 10px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-table {
            width: 280px;
            margin-left: auto;
            margin-bottom: 24px;
          }
          .summary-table td {
            padding: 6px 10px;
          }
          .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
          }
          @media print {
            body { padding: 0; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table class="header-table">
            <tr>
              <td>
                <h1 class="company-title">🌱 Kundu Agro & Fisheries</h1>
                <div class="company-subtitle">Premium Fisheries, Seeds & Agricultural Products Supplier</div>
                <div class="company-subtitle">Email: support@kunduagro.com | Phone: +880 1700-000000</div>
              </td>
              <td>
                <h2 class="invoice-title">OFFICIAL INVOICE</h2>
                <div style="text-align: right; font-size: 13px; font-weight: bold; color: #047857; margin-top: 4px;">
                  #${orderId}
                </div>
                <div style="text-align: right; font-size: 12px; color: #6b7280; margin-top: 2px;">
                  Date: ${orderDate}
                </div>
              </td>
            </tr>
          </table>

          <table class="meta-table">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 12px;">
                <div class="section-card">
                  <div style="font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase; margin-bottom: 6px;">
                    📍 Billed & Shipped To:
                  </div>
                  <div style="font-size: 13px; font-weight: bold; color: #111827;">${customerName}</div>
                  <div style="font-size: 12px; color: #374151; margin-top: 2px;">📞 ${phone}</div>
                  <div style="font-size: 12px; color: #4b5563; margin-top: 4px;">${address}, ${city}</div>
                </div>
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 12px;">
                <div class="section-card">
                  <div style="font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase; margin-bottom: 6px;">
                    💳 Payment & Status:
                  </div>
                  <div style="font-size: 12px; color: #374151;">Method: <strong>${paymentMethod}</strong></div>
                  <div style="font-size: 12px; color: #374151; margin-top: 2px;">Payment Status: <strong>${paymentStatus}</strong></div>
                  <div style="font-size: 12px; color: #374151; margin-top: 2px;">Order Status: <strong style="color: #047857;">${status}</strong></div>
                </div>
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th style="border-top-left-radius: 8px;">#</th>
                <th style="text-align: left;">Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right; border-top-right-radius: 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="summary-table">
            <tr>
              <td style="font-size: 12px; color: #4b5563;">Subtotal:</td>
              <td style="font-size: 12px; font-weight: bold; text-align: right;">৳${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #4b5563;">Delivery Fee:</td>
              <td style="font-size: 12px; font-weight: bold; text-align: right; color: #059669;">৳${deliveryFee.toFixed(2)}</td>
            </tr>
            <tr style="border-top: 2px solid #111827;">
              <td style="font-size: 14px; font-weight: 900; color: #111827; padding-top: 8px;">Grand Total:</td>
              <td style="font-size: 16px; font-weight: 900; color: #047857; text-align: right; padding-top: 8px;">৳${total.toFixed(2)}</td>
            </tr>
          </table>

          <div class="footer">
            Thank you for choosing <strong>Kundu Agro & Fisheries</strong>! For any questions regarding this invoice, please contact support.
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
