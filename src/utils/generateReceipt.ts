import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

export const generateReceipt = (order: Order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add header
  doc.setFontSize(20);
  doc.text('TechSupplies Cameroon', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Receipt', pageWidth / 2, 30, { align: 'center' });

  // Add order information
  doc.setFontSize(10);
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  doc.text(`Order Date: ${orderDate}`, 20, 40);
  doc.text(`Order ID: ${order.id}`, 20, 45);

  // Add customer information
  const customerInfoY = 55;
  if (order.userId && order.user) {
    doc.text('Customer Information:', 20, customerInfoY);
    doc.text(`Name: ${order.user.full_name || 'N/A'}`, 20, customerInfoY + 5);
    doc.text(`Email: ${order.user.email || 'N/A'}`, 20, customerInfoY + 10);
    doc.text(`Phone: ${order.user.phone_number || 'N/A'}`, 20, customerInfoY + 15);
  } else if (order.guestInfo) {
    doc.text('Guest Information:', 20, customerInfoY);
    doc.text(`Name: ${order.guestInfo.full_name}`, 20, customerInfoY + 5);
    doc.text(`Email: ${order.guestInfo.email}`, 20, customerInfoY + 10);
    doc.text(`Phone: ${order.guestInfo.phone_number}`, 20, customerInfoY + 15);
  }

  // Add shipping address
  doc.text('Shipping Address:', 20, customerInfoY + 25);
  doc.text(order.shippingAddress, 20, customerInfoY + 30);

  // Add payment information
  doc.text('Payment Information:', 20, customerInfoY + 40);
  doc.text(`Method: ${order.paymentMethod}`, 20, customerInfoY + 45);
  doc.text(`Number: ${order.paymentNumber}`, 20, customerInfoY + 50);

  // Add items table
  const tableY = customerInfoY + 60;
  autoTable(doc, {
    startY: tableY,
    head: [['Item', 'Quantity', 'Price (XAF)', 'Total (XAF)']],
    body: order.items.map(item => [
      item.name,
      item.quantity.toString(),
      item.price.toLocaleString(),
      (item.price * item.quantity).toLocaleString()
    ]),
    foot: [
      ['', '', 'Subtotal:', order.subtotal.toLocaleString()],
      ['', '', 'Shipping:', order.shipping.toLocaleString()],
      ['', '', 'Total:', order.total.toLocaleString()]
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
    footStyles: { fillColor: [243, 244, 246] }
  });

  // Add footer
  const finalY = doc.lastAutoTable?.finalY || tableY;
  doc.text('Thank you for shopping with TechSupplies Cameroon!', pageWidth / 2, finalY + 20, { align: 'center' });
  doc.text('For any inquiries, please contact us:', pageWidth / 2, finalY + 25, { align: 'center' });
  doc.text('Email: support@techsupplies.cm | Phone: +237 6XX XXX XXX', pageWidth / 2, finalY + 30, { align: 'center' });

  // Save the PDF
  doc.save(`receipt-${order.id}.pdf`);
};

export const downloadReceipt = (order: Order) => {
  generateReceipt(order);
}; 