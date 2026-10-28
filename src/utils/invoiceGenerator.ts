import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Order, StoreSettings } from '../types/index.ts';

/**
 * Generates a clean, print-ready, professional HTML invoice string for an order
 */
export function generateInvoiceHtml(order: Order, storeSettings?: Partial<StoreSettings>): string {
  const storeName = storeSettings?.storeName || 'MY SHOP BD';
  const whatsappNumber = storeSettings?.whatsappNumber || '01940320627';
  const hotline = '+880 1711-000999';
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isPaid = order.paymentStatus === 'paid';
  const paymentBadgeColor = isPaid ? '#047857' : '#b45309';
  const paymentBadgeBg = isPaid ? '#d1fae5' : '#fef3c7';

  const itemsHtml = order.items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px; font-size: 13px; color: #475569; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #0f172a; font-weight: 600;">
          ${item.productName}
          ${item.type === 'digital' ? '<span style="font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; margin-left: 6px; text-transform: uppercase;">Digital Item</span>' : ''}
        </td>
        <td style="padding: 10px 12px; font-size: 13px; color: #475569; text-align: right;">Tk ${item.unitPrice.toLocaleString('en-US')}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #0f172a; text-align: center; font-weight: 700;">${item.quantity}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #0f172a; text-align: right; font-weight: 700;">Tk ${item.totalPrice.toLocaleString('en-US')}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.orderNumber} - ${storeName}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-logo {
      display: inline-block;
      background: #0d9488;
      color: #ffffff;
      font-weight: 900;
      font-size: 20px;
      padding: 6px 14px;
      border-radius: 8px;
      letter-spacing: 0.5px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-left: 8px;
      vertical-align: middle;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .two-cols {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 24px;
    }
    .col-box {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .col-box h4 {
      margin: 0 0 10px 0;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      font-weight: 700;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #f1f5f9;
      color: #475569;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      border-bottom: 2px solid #cbd5e1;
    }
    .summary-table {
      width: 280px;
      margin-left: auto;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .summary-table td {
      padding: 6px 10px;
      font-size: 13px;
    }
    .summary-table tr.total-row {
      border-top: 2px solid #0f172a;
      font-weight: 800;
      font-size: 16px;
      color: #0d9488;
    }
    .footer-note {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    .print-actions {
      text-align: center;
      margin-bottom: 20px;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 12px;
    }
    .btn {
      background: #0d9488;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .btn:hover {
      background: #0f766e;
    }
  </style>
</head>
<body>
  <div class="no-print print-actions">
    <button class="btn" onclick="window.print()">🖨️ Click to Print / Save as PDF (এক ক্লিকে PDF সেভ করুন)</button>
    <span style="font-size: 12px; color: #64748b; margin-left: 12px;">Tip: Select "Save as PDF" in the printer destination dropdown.</span>
  </div>

  <div class="invoice-card">
    <!-- Top Header -->
    <div class="header">
      <div>
        <span class="brand-logo">BD</span>
        <span class="brand-title">${storeName}</span>
        <p style="margin: 6px 0 0 0; font-size: 12px; color: #64748b;">
          Authorized E-Commerce & Retail Marketplace in Bangladesh<br>
          Hotline: <strong>${hotline}</strong> • WhatsApp: <strong>${whatsappNumber}</strong><br>
          Dhaka, Bangladesh
        </p>
      </div>

      <div style="text-align: right;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 900; color: #0d9488; letter-spacing: -0.5px;">INVOICE</h2>
        <p style="margin: 4px 0 2px 0; font-size: 14px; font-family: monospace; font-weight: 800; color: #0f172a;">${order.orderNumber}</p>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">Date: ${formattedDate}</p>
        <span class="badge" style="background: ${paymentBadgeBg}; color: ${paymentBadgeColor};">
          ${order.paymentStatus === 'paid' ? 'PAID / পরিশোধিত' : 'PAYMENT PENDING'}
        </span>
      </div>
    </div>

    <!-- Details Columns -->
    <div class="two-cols">
      <!-- Customer Info -->
      <div class="col-box">
        <h4>Customer & Delivery Details (গ্রাহকের তথ্য)</h4>
        <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #0f172a;">
          ${order.shippingAddress.fullName || 'Customer'}
        </p>
        <p style="margin: 0 0 4px 0; font-size: 13px; color: #334155;">
          <strong>Phone:</strong> ${order.userPhone || order.shippingAddress.phone || 'N/A'}
        </p>
        <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.4;">
          <strong>Address:</strong> ${order.shippingAddress.streetAddress || 'Direct Digital Delivery'}<br>
          ${order.shippingAddress.upazilaOrArea ? order.shippingAddress.upazilaOrArea + ', ' : ''}${order.shippingAddress.district || 'Dhaka'}, ${order.shippingAddress.division || 'Dhaka'}
        </p>
      </div>

      <!-- Payment & Shipment Summary -->
      <div class="col-box">
        <h4>Payment & Courier (পেমেন্ট ও কুরিয়ার)</h4>
        <p style="margin: 0 0 4px 0; font-size: 13px; color: #334155;">
          <strong>Payment Method:</strong> <span style="text-transform: uppercase; font-weight: 700; color: #0d9488;">${order.paymentMethod}</span>
        </p>
        ${
          order.paymentDetails?.transactionId
            ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #334155;">
                <strong>TrxID:</strong> <code style="background: #e2e8f0; padding: 2px 4px; border-radius: 4px;">${order.paymentDetails.transactionId}</code>
              </p>`
            : ''
        }
        <p style="margin: 0 0 4px 0; font-size: 13px; color: #334155;">
          <strong>Fulfillment Status:</strong> <span style="text-transform: capitalize; font-weight: 700;">${order.fulfillmentStatus.replace('_', ' ')}</span>
        </p>
        ${
          order.tracking?.carrier
            ? `<p style="margin: 0; font-size: 12px; color: #0369a1; line-height: 1.4;">
                <strong>Courier:</strong> ${order.tracking.carrier}<br>
                <strong>Tracking Code:</strong> <span style="font-weight: 800; font-family: monospace;">${order.tracking.trackingNumber || 'N/A'}</span>
              </p>`
            : `<p style="margin: 0; font-size: 12px; color: #64748b;">Assigned to warehouse fulfillment rider.</p>`
        }
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th style="width: 40px; text-align: center;">#</th>
          <th style="text-align: left;">Item Description</th>
          <th style="width: 100px; text-align: right;">Unit Price</th>
          <th style="width: 60px; text-align: center;">Qty</th>
          <th style="width: 110px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Financial Breakdown -->
    <table class="summary-table">
      <tr>
        <td style="color: #64748b;">Subtotal:</td>
        <td style="text-align: right; font-weight: 600;">Tk ${order.subtotal.toLocaleString('en-US')}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Delivery Fee:</td>
        <td style="text-align: right; font-weight: 600;">
          ${order.shippingFee === 0 ? '<span style="color: #0d9488; font-weight: 700;">FREE</span>' : `Tk ${order.shippingFee.toLocaleString('en-US')}`}
        </td>
      </tr>
      ${
        order.discountAmount > 0
          ? `<tr>
              <td style="color: #e11d48;">Discount:</td>
              <td style="text-align: right; color: #e11d48; font-weight: 700;">- Tk ${order.discountAmount.toLocaleString('en-US')}</td>
            </tr>`
          : ''
      }
      <tr class="total-row">
        <td>Total Amount:</td>
        <td style="text-align: right;">Tk ${order.totalAmount.toLocaleString('en-US')}</td>
      </tr>
    </table>

    <!-- Guarantee & Signature -->
    <div class="footer-note">
      <div>
        <p style="margin: 0; font-weight: 700; color: #0f172a;">100% Authentic Quality Guaranteed</p>
        <p style="margin: 2px 0 0 0;">Thank you for shopping with ${storeName}. For support, call ${hotline} or WhatsApp ${whatsappNumber}.</p>
      </div>
      <div style="text-align: right;">
        <div style="font-family: cursive; font-size: 16px; color: #0d9488; font-weight: bold; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
          ${storeName} Authorized
        </div>
        <span style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Authorized Officer / Seal</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 1-Click Print & Save as PDF function
 * Opens print preview in an iframe or dedicated window that automatically triggers window.print()
 */
export function printInvoicePdf(order: Order, storeSettings?: Partial<StoreSettings>): void {
  const invoiceHtml = generateInvoiceHtml(order, storeSettings);

  // Try using a hidden iframe for seamless printing
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(invoiceHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          // Fallback to window open if iframe print fails
          openPrintWindow(invoiceHtml);
        } finally {
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 60000);
        }
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Iframe print failed, falling back to window.open', err);
  }

  // Fallback to window.open
  openPrintWindow(invoiceHtml);
}

function openPrintWindow(html: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

/**
 * 1-Click Direct Download of PDF Invoice (.pdf)
 * Generates an authentic .pdf file and triggers direct download to device
 */
export async function downloadInvoicePdf(order: Order, storeSettings?: Partial<StoreSettings>): Promise<boolean> {
  const invoiceHtml = generateInvoiceHtml(order, storeSettings);

  if (typeof document !== 'undefined') {
    let container: HTMLDivElement | null = null;
    try {
      container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '794px'; // Standard A4 width at 96 DPI
      container.style.backgroundColor = '#ffffff';
      container.style.zIndex = '-9999';
      container.innerHTML = invoiceHtml;

      // Hide the print actions banner from the exported PDF
      const printActions = container.querySelector('.print-actions');
      if (printActions) {
        (printActions as HTMLElement).style.display = 'none';
      }

      document.body.appendChild(container);

      // Brief delay for fonts & layout calculations
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(`Invoice-${order.orderNumber}.pdf`);
      return true;
    } catch (canvasErr) {
      console.warn('Canvas rendering encountered issue, falling back to direct vector PDF:', canvasErr);
      try {
        generateDirectVectorPdf(order, storeSettings);
        return true;
      } catch (vectorErr) {
        console.warn('Direct vector PDF failed, downloading HTML invoice:', vectorErr);
        downloadInvoiceHtmlFile(order, storeSettings);
        return false;
      }
    } finally {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
  }

  return false;
}

/**
 * Pure jsPDF Vector PDF Generator
 * Creates a clean, native PDF document without requiring DOM canvas rasterization
 */
export function generateDirectVectorPdf(order: Order, storeSettings?: Partial<StoreSettings>): void {
  const storeName = storeSettings?.storeName || 'MY SHOP BD';
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Header Banner
  pdf.setFillColor(13, 148, 136); // #0d9488
  pdf.rect(0, 0, 210, 26, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text(storeName, 14, 12);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Authorized Retail & Digital Marketplace | Hotline: +880 1711-000999', 14, 18);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('INVOICE', 196, 12, { align: 'right' });

  pdf.setFontSize(9);
  pdf.text(`Order: ${order.orderNumber}`, 196, 18, { align: 'right' });

  // Reset text color
  pdf.setTextColor(30, 41, 59);

  // Meta details cards
  pdf.setDrawColor(226, 232, 240);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(14, 32, 88, 38, 2, 2, 'FD');
  pdf.roundedRect(108, 32, 88, 38, 2, 2, 'FD');

  // Customer block
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text('CUSTOMER DETAILS', 18, 38);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text(order.shippingAddress.fullName || 'Customer', 18, 45);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Phone: ${order.userPhone || order.shippingAddress.phone || 'N/A'}`, 18, 51);
  const addressLine = `${order.shippingAddress.streetAddress || ''}, ${order.shippingAddress.district || 'Dhaka'}`;
  pdf.text(addressLine.slice(0, 45), 18, 57);
  pdf.text(`Division: ${order.shippingAddress.division || 'Dhaka'}`, 18, 63);

  // Order & Payment block
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text('PAYMENT & STATUS', 112, 38);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Payment: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})`, 112, 45);
  if (order.paymentDetails?.transactionId) {
    pdf.text(`TrxID: ${order.paymentDetails.transactionId}`, 112, 51);
  } else {
    pdf.text(`Status: ${order.fulfillmentStatus}`, 112, 51);
  }
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB');
  pdf.text(`Date: ${dateStr}`, 112, 57);
  pdf.text(`Courier: ${order.tracking?.carrier || 'Standard BD Delivery'}`, 112, 63);

  // Items table header
  let y = 78;
  pdf.setFillColor(241, 245, 249);
  pdf.rect(14, y, 182, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  pdf.text('#', 18, y + 5.5);
  pdf.text('Product Description', 28, y + 5.5);
  pdf.text('Unit Price', 130, y + 5.5, { align: 'right' });
  pdf.text('Qty', 155, y + 5.5, { align: 'center' });
  pdf.text('Total', 192, y + 5.5, { align: 'right' });

  // Items rows
  y += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);

  order.items.forEach((item, idx) => {
    const rowY = y + 6;
    pdf.setDrawColor(241, 245, 249);
    pdf.line(14, y + 8, 196, y + 8);
    pdf.text(String(idx + 1), 18, rowY);
    pdf.text(item.productName.slice(0, 48), 28, rowY);
    pdf.text(`Tk ${item.unitPrice.toLocaleString('en-US')}`, 130, rowY, { align: 'right' });
    pdf.text(String(item.quantity), 155, rowY, { align: 'center' });
    pdf.text(`Tk ${item.totalPrice.toLocaleString('en-US')}`, 192, rowY, { align: 'right' });
    y += 9;
  });

  // Summary
  y += 6;
  pdf.setDrawColor(203, 213, 225);
  pdf.line(120, y, 196, y);
  y += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Subtotal:', 140, y);
  pdf.setTextColor(15, 23, 42);
  pdf.text(`Tk ${order.subtotal.toLocaleString('en-US')}`, 192, y, { align: 'right' });

  y += 6;
  pdf.setTextColor(100, 116, 139);
  pdf.text('Delivery Fee:', 140, y);
  pdf.setTextColor(15, 23, 42);
  pdf.text(order.shippingFee === 0 ? 'FREE' : `Tk ${order.shippingFee.toLocaleString('en-US')}`, 192, y, { align: 'right' });

  if (order.discountAmount > 0) {
    y += 6;
    pdf.setTextColor(225, 29, 72);
    pdf.text('Discount:', 140, y);
    pdf.text(`- Tk ${order.discountAmount.toLocaleString('en-US')}`, 192, y, { align: 'right' });
  }

  y += 7;
  pdf.setFillColor(13, 148, 136);
  pdf.rect(120, y - 4, 76, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Total Amount:', 124, y + 1.5);
  pdf.text(`Tk ${order.totalAmount.toLocaleString('en-US')}`, 192, y + 1.5, { align: 'right' });

  // Footer seal
  y += 24;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  pdf.text('100% Authentic Quality Guaranteed • Official MY SHOP BD Invoice', 14, y);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(13, 148, 136);
  pdf.text('MY SHOP BD Authorized', 196, y, { align: 'right' });

  pdf.save(`Invoice-${order.orderNumber}.pdf`);
}

/**
 * 1-Click Download Offline Invoice HTML file (.html)
 */
export function downloadInvoiceHtmlFile(order: Order, storeSettings?: Partial<StoreSettings>): void {
  const invoiceHtml = generateInvoiceHtml(order, storeSettings);
  const blob = new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${order.orderNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

