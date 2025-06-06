import jsPDF from 'jspdf';
import { Order } from '../store/orderStore';

export const generateReceipt = (order: Order): string => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('TechSupplies Cameroon', pageWidth / 2, yPos, { align: 'center' });
  
  // Receipt title and info
  yPos += 20;
  doc.setFontSize(16);
  doc.text('Purchase Receipt', pageWidth / 2, yPos, { align: 'center' });
  
  // Date and Order ID
  yPos += 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 20, yPos);
  doc.text(`Order ID: ${order.id}`, pageWidth - 20, yPos, { align: 'right' });

  // Shipping Address
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Shipping Address:', 20, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(order.shipping_address, 20, yPos);

  // Items Table Header
  yPos += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, yPos);
  doc.text('Qty', 120, yPos);
  doc.text('Price', 150, yPos);
  doc.text('Total', pageWidth - 20, yPos, { align: 'right' });
  
  // Items
  yPos += 5;
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  order.items.forEach(item => {
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(item.name, 20, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    doc.text(`${item.price.toLocaleString()} XAF`, 150, yPos);
    doc.text(`${(item.price * item.quantity).toLocaleString()} XAF`, pageWidth - 20, yPos, { align: 'right' });
  });

  // Totals
  yPos += 10;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  doc.text('Subtotal:', 120, yPos);
  doc.text(`${order.subtotal.toLocaleString()} XAF`, pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 10;
  doc.text('Shipping:', 120, yPos);
  doc.text(`${order.shipping.toLocaleString()} XAF`, pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 120, yPos);
  doc.text(`${order.total.toLocaleString()} XAF`, pageWidth - 20, yPos, { align: 'right' });

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for shopping with TechSupplies Cameroon!', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text('For any questions, please contact support@techsuppliescameroon.com', pageWidth / 2, yPos, { align: 'center' });

  // Generate PDF blob URL
  return doc.output('dataurlstring');
};

export const downloadReceipt = (order: Order) => {
  const doc = generateReceipt(order);
  const link = document.createElement('a');
  link.href = doc;
  link.download = `receipt-${order.id}.pdf`;
  link.click();
}; 