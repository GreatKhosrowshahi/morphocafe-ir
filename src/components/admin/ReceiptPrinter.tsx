/**
 * ReceiptPrinter.jsx
 * 
 * A production-grade receipt printing component for Morpho Café & Patisserie.
 * Specializing in high-end, luxury minimal design for 80mm POS printers.
 */

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number | string;
}

interface ReceiptOrder {
  cafeName?: string;
  cafeLogoUrl?: string;
  customerName?: string;
  orderId: string | number;
  dateTime: string;
  items: ReceiptItem[];
  totalAmount: number;
}

export const printReceipt = (order: ReceiptOrder) => {
  const {
    cafeName = "MORPHO",
    cafeLogoUrl = "/logopos.png",
    customerName,
    orderId,
    dateTime,
    items,
    totalAmount
  } = order;

  // Fallback for logo: Styled "M" if no logo URL is provided or if it fails
  const logoHtml = cafeLogoUrl
    ? `<img src="${cafeLogoUrl}" alt="${cafeName}" class="cafe-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
    : '';

  const fallbackLogoHtml = `<div class="logo-fallback" style="display: ${cafeLogoUrl ? 'none' : 'flex'}">M</div>`;

  const receiptHtml = `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>Receipt - ${orderId}</title>
      <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        body {
          font-family: 'Vazirmatn', sans-serif;
          background-color: #f0ebe4;
          display: flex;
          justify-content: center;
          padding: 20px 0;
          color: #000;
        }

        .receipt-container {
          width: 80mm;
          background: #fff;
          padding: 10mm 5mm;
          min-height: 100mm;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }

        @media print {
          body {
            background-color: #fff;
            padding: 0;
            display: block;
          }
          .receipt-container {
            width: 80mm;
            box-shadow: none;
            padding: 0;
            margin: 0;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }

        /* Typography & Layout */
        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .cafe-logo-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .cafe-logo {
          width: 180px;
          height: auto;
          object-fit: contain;
        }

        .logo-fallback {
          width: 70px;
          height: 70px;
          border: 2px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 900;
        }

        .divider {
          border: none;
          height: 1.5px;
          background-color: #000;
          margin: 15px 0;
        }

        .divider.dashed {
          background-color: transparent;
          border-top: 1.5px dashed #000;
          height: 0;
        }

        .order-info {
          text-align: right;
          font-size: 11px;
          line-height: 1.8;
          margin-bottom: 15px;
        }

        .info-row {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
        }

        .info-label {
          font-weight: 500;
          opacity: 0.6;
        }

        .info-value {
          font-weight: 800;
        }

        /* Table */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 11px;
        }

        th {
          text-align: right;
          font-weight: 800;
          padding-bottom: 8px;
          border-bottom: 1px solid #000;
        }

        td {
          padding: 8px 0;
          vertical-align: top;
        }

        tr:not(:last-child) td {
          border-bottom: 0.5px solid #eee;
        }

        .col-item { width: 40%; text-align: right; }
        .col-qty { width: 15%; text-align: center; }
        .col-price { width: 20%; text-align: right; }
        .col-total { width: 25%; text-align: right; font-weight: 800; }

        .total-section {
          text-align: right;
          margin: 15px 0;
        }

        .total-amount {
          font-size: 20px;
          font-weight: 900;
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 8px;
        }

        .toman {
          font-size: 12px;
          font-weight: 500;
        }

        .closing-message {
          text-align: center;
          font-weight: 500;
          font-size: 10px;
          margin: 25px 0;
          padding: 0 10px;
          line-height: 1.6;
          opacity: 0.9;
        }

        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 9px;
        }

        .footer-morpho {
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .instagram {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-bottom: 8px;
        }

        .insta-icon {
          width: 12px;
          height: 12px;
        }

        .address {
          opacity: 0.7;
          line-height: 1.4;
        }
      </style>
    </head>
    <body onload="window.print(); window.onafterprint = function(){ window.close(); };">
      <div class="receipt-container">
        <!-- Header -->
        <div class="header">
          <div class="cafe-logo-wrapper">
            ${logoHtml}
            ${fallbackLogoHtml}
          </div>
        </div>

        <hr class="divider">

        <!-- Order Information -->
        <div class="order-info">
          <div class="info-row">
            <span class="info-label">مشتری:</span>
            <span class="info-value">${customerName || 'مشتری حضوری'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">شماره سفارش:</span>
            <span class="info-value">${orderId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">تاریخ و ساعت:</span>
            <span class="info-value">${dateTime}</span>
          </div>
        </div>

        <hr class="divider dashed">

        <!-- Items Table -->
        <table>
          <thead>
            <tr>
              <th class="col-item">آیتم</th>
              <th class="col-qty">تعداد</th>
              <th class="col-price">قیمت واحد</th>
              <th class="col-total">جمع</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => {
    // Robust parsing for Persian digits and commas
    const toEng = (s) => s.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    const safePrice = parseFloat(toEng(item.price).replace(/,/g, '')) || 0;
    return `
              <tr>
                <td class="col-item">${item.name}</td>
                <td class="col-qty">${item.quantity}</td>
                <td class="col-price">${safePrice.toLocaleString('fa-IR')}</td>
                <td class="col-total">${(safePrice * item.quantity).toLocaleString('fa-IR')}</td>
              </tr>
              `;
  }).join('')}
          </tbody>
        </table>

        <hr class="divider">

        <!-- Total -->
        <div class="total-section">
          <div class="total-amount">
            <span>${totalAmount.toLocaleString('fa-IR')}</span>
            <span class="toman">تومان</span>
          </div>
        </div>

        <hr class="divider">

        <!-- Closing Message -->
        <p class="closing-message">
          ☕ ممنون از انتخاب شما — لحظات خوشی در کنار ما داشتید — مشتاق دیدار دوبارهتان هستیم 🌿
        </p>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-morpho">MORPHO MORPHO MORPHO</div>
          <div class="instagram">
            <svg class="insta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            morpho.patisserie
          </div>
          <p class="address">
            بلوار آزادگان، ابتدای بلوار فرمانداری، کافه مورفو
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=450,height=600');
  if (printWindow) {
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  } else {
    alert('لطفاً اجازه باز شدن پنجره پاپ‌آپ را بدهید.');
  }
};

/**
 * Usage Example:
 * 
 * import { printReceipt } from './components/admin/ReceiptPrinter';
 * 
 * const handlePrint = () => {
 *   const orderData = {
 *     cafeName: "MORPHO",
 *     cafeLogoUrl: "/logopos.png",
 *     customerName: "علی رضایی",
 *     orderId: "1042",
 *     dateTime: "۱۴۰۳/۱۱/۲۲ - ۱۴:۳۵",
 *     items: [
 *       { name: "اسپرسو دوبل", quantity: 2, price: 45000 },
 *       { name: "کیک شکلاتی", quantity: 1, price: 38000 }
 *     ],
 *     totalAmount: 128000
 *   };
 *   printReceipt(orderData);
 * };
 * 
 * <button onClick={handlePrint}>چاپ رسید</button>
 */
