import { Order } from '../types/index.ts';

interface DriveFileResponse {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

/**
 * Find or create the dedicated app folder in Google Drive: "MY SHOP BD Downloads"
 */
export async function getOrCreateShopFolder(accessToken: string, folderName = 'MY SHOP BD Downloads'): Promise<string> {
  const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    throw new Error(`Failed to search Google Drive: ${errorText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create Google Drive folder: ${errorText}`);
  }

  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Save an order confirmation & digital entitlement receipt directly to user's Google Drive
 */
export async function saveOrderToGoogleDrive(
  order: Order,
  accessToken: string
): Promise<DriveFileResponse> {
  const folderId = await getOrCreateShopFolder(accessToken);

  const receiptContent = `========================================================
MY SHOP BD — OFFICIAL ORDER & DIGITAL RECEIPT
========================================================
Order Number:    ${order.orderNumber}
Date:            ${new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} BST
Customer:        ${order.shippingAddress.fullName}
Email:           ${order.userEmail}
Phone:           ${order.userPhone}
Payment Method:  ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})
${order.paymentDetails?.transactionId ? `Transaction ID:  ${order.paymentDetails.transactionId}` : ''}
Fulfillment:     ${order.fulfillmentStatus.toUpperCase()}

ITEMS PURCHASED:
--------------------------------------------------------
${order.items
  .map(
    (item, index) =>
      `${index + 1}. [${item.type.toUpperCase()}] ${item.productName}
   Qty: ${item.quantity} x ৳${item.unitPrice.toLocaleString()} = ৳${item.totalPrice.toLocaleString()}`
  )
  .join('\n')}

SUMMARY:
--------------------------------------------------------
Subtotal:        ৳${order.subtotal.toLocaleString()}
Discount:        ৳${order.discountAmount.toLocaleString()} ${order.couponCode ? `(Coupon: ${order.couponCode})` : ''}
Delivery Fee:    ৳${order.shippingFee.toLocaleString()}
TOTAL AMOUNT:    ৳${order.totalAmount.toLocaleString()} BDT

DELIVERY ADDRESS:
--------------------------------------------------------
${order.shippingAddress.streetAddress}
${order.shippingAddress.upazilaOrArea}, ${order.shippingAddress.district}, ${order.shippingAddress.division}
Bangladesh

DIGITAL ACCESS NOTICE:
All digital items included in this order are accessible from your
MY SHOP BD account under "My Digital Library" with verified tokens.

Thank you for choosing MY SHOP BD!
Support Hotline: +880 1711-000999 | support@myshopbd.com
========================================================`;

  const fileName = `MY_SHOP_BD_Invoice_${order.orderNumber}.txt`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'text/plain',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    receiptContent +
    closeDelimiter;

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Failed to upload order invoice to Google Drive: ${errorText}`);
  }

  const uploadedFile = await uploadRes.json();
  return uploadedFile;
}

/**
 * Backup purchased digital product file (sample PDF/content) into customer's Google Drive
 */
export async function backupDigitalProductToDrive(
  productName: string,
  fileName: string,
  fileContentText: string,
  accessToken: string
): Promise<DriveFileResponse> {
  const folderId = await getOrCreateShopFolder(accessToken);

  const metadata = {
    name: `[MY_SHOP_BD] ${fileName}`,
    parents: [folderId],
    mimeType: 'text/markdown',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/markdown; charset=UTF-8\r\n\r\n' +
    `# ${productName}\n\n*Purchased from MY SHOP BD*\n\n${fileContentText}` +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Drive backup failed: ${errText}`);
  }

  return await res.json();
}
