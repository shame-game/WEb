import React from 'react';
import { Download, Printer, X, Building2, Phone, Mail, MapPin, User, Save } from 'lucide-react';
import styles from './InvoicePreview.module.css';

const InvoicePreview = ({ data, onClose, onSaveInvoice }) => {
  const handleDownload = () => {
    // Create printable content
    const printContent = document.getElementById('invoice-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn #${data.invoiceId}</title>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              background: white;
            }
            .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .invoice-header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 30px; 
              text-align: center; 
              margin-bottom: 30px;
              border-radius: 10px;
            }
            .hotel-logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .invoice-title { font-size: 24px; margin-bottom: 5px; }
            .invoice-number { font-size: 18px; opacity: 0.9; }
            .info-section { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 30px; 
              margin-bottom: 30px; 
            }
            .hotel-info, .customer-info { 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 8px; 
              border-left: 4px solid #667eea;
            }
            .info-title { 
              font-size: 16px; 
              font-weight: 600; 
              color: #667eea; 
              margin-bottom: 15px;
              border-bottom: 1px solid #e9ecef;
              padding-bottom: 5px;
            }
            .invoice-details { 
              background: #fff; 
              border: 1px solid #e9ecef; 
              border-radius: 8px; 
              padding: 20px; 
              margin-bottom: 30px; 
            }
            .detail-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              border-bottom: 1px solid #f1f3f5;
            }
            .detail-row:last-child { border-bottom: none; }
            .invoice-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .invoice-table th { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 15px; 
              text-align: left; 
              font-weight: 600;
            }
            .invoice-table td { 
              padding: 15px; 
              border-bottom: 1px solid #f1f3f5; 
            }
            .totals-section { 
              background: #f8f9fa; 
              padding: 25px; 
              border-radius: 8px; 
              margin: 20px 0;
              border: 1px solid #e9ecef;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              border-bottom: 1px solid #e9ecef;
            }
            .total-row:last-child { border-bottom: none; }
            .grand-total { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 15px 20px; 
              margin: 15px -25px -25px -25px; 
              font-weight: bold; 
              font-size: 18px;
              border-radius: 0 0 8px 8px;
            }
            .status-section { text-align: center; margin: 20px 0; }
            .status { 
              display: inline-block; 
              padding: 10px 25px; 
              border-radius: 25px; 
              font-weight: 600; 
              text-transform: uppercase; 
              letter-spacing: 1px;
            }
            .status.pending { background: #fff3cd; color: #856404; border: 2px solid #ffeaa7; }
            .status.paid { background: #d4edda; color: #155724; border: 2px solid #00b894; }
            .invoice-footer { 
              text-align: center; 
              margin-top: 40px; 
              padding: 20px; 
              background: #f8f9fa; 
              border-radius: 8px;
              border-top: 3px solid #667eea;
            }
            @media (max-width: 600px) {
              .info-section { grid-template-columns: 1fr; }
              .invoice-table { font-size: 14px; }
              .invoice-table th, .invoice-table td { padding: 10px 8px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  const handlePrint = () => {
    window.print();
  };

  const handleSaveInvoice = () => {
    if (onSaveInvoice) {
      onSaveInvoice(data);
    }
  };

  return (
    <div className={styles.invoicePreview}>
      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button onClick={handleSaveInvoice} className={styles.saveButton}>
          <Save size={16} />
          Xuất hóa đơn
        </button>
        <button onClick={handleDownload} className={styles.downloadButton}>
          <Download size={16} />
          Tải xuống PDF
        </button>
        <button onClick={handlePrint} className={styles.printButton}>
          <Printer size={16} />
          In hóa đơn
        </button>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={16} />
          Đóng
        </button>
      </div>

      {/* Invoice Content */}
      <div id="invoice-content" className={styles.invoiceContent}>
        {/* Header */}
        <div className={styles.invoiceHeader}>
          <div className={styles.hotelLogo}>
            <Building2 size={32} />
            <span>KHÁCH SẠN LUXURY</span>
          </div>
          <div className={styles.invoiceTitle}>HÓA ĐƠN THANH TOÁN</div>
          <div className={styles.invoiceNumber}>Số hóa đơn: #{data.invoiceId}</div>
        </div>

        {/* Hotel & Customer Info */}
        <div className={styles.infoSection}>
          <div className={styles.hotelInfo}>
            <h3 className={styles.infoTitle}>
              <Building2 size={18} />
              Thông tin khách sạn
            </h3>
            <div className={styles.infoItem}>
              <MapPin size={16} />
              <span>123 Đường Nguyễn Huệ, Quận 1</span>
            </div>
            <div className={styles.infoItem}>
              <span>TP. Hồ Chí Minh, Việt Nam</span>
            </div>
            <div className={styles.infoItem}>
              <Phone size={16} />
              <span>(028) 123-4567</span>
            </div>
            <div className={styles.infoItem}>
              <Mail size={16} />
              <span>info@khachsanluxury.com</span>
            </div>
            <div className={styles.taxInfo}>
              MST: 0123456789
            </div>
          </div>
          
          <div className={styles.customerInfo}>
            <h3 className={styles.infoTitle}>
              <User size={18} />
              Thông tin khách hàng
            </h3>
            <div className={styles.customerName}>{data.customerName}</div>
            <div className={styles.roomDetails}>
              <div className={styles.roomItem}>
                <strong>Phòng:</strong> {data.roomNumber}
              </div>
              <div className={styles.roomItem}>
                <strong>Loại phòng:</strong> {data.roomType}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className={styles.invoiceDetails}>
          <h3 className={styles.detailsTitle}>Chi tiết đặt phòng</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Mã đặt phòng:</span>
              <span className={styles.detailValue}>#{data.bookingId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ngày xuất hóa đơn:</span>
              <span className={styles.detailValue}>{data.issueDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ngày đến hạn:</span>
              <span className={styles.detailValue}>{data.dueDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ngày nhận phòng:</span>
              <span className={styles.detailValue}>{data.checkInDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ngày trả phòng:</span>
              <span className={styles.detailValue}>{data.checkOutDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Số đêm:</span>
              <span className={styles.detailValue}>{data.nights} đêm</span>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className={styles.itemsSection}>
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>Mô tả dịch vụ</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className={styles.serviceDescription}>
                    <strong>Phòng {data.roomNumber} - {data.roomType}</strong>
                    <div className={styles.serviceDetails}>
                      Từ {data.checkInDate} đến {data.checkOutDate}
                    </div>
                  </div>
                </td>
                <td className={styles.quantity}>{data.nights} đêm</td>
                <td className={styles.unitPrice}>{data.roomPrice?.toLocaleString('vi-VN')} VNĐ</td>
                <td className={styles.amount}>{data.subtotal?.toLocaleString('vi-VN')} VNĐ</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className={styles.totalsSection}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Tạm tính:</span>
            <span className={styles.totalValue}>{data.subtotal?.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Thuế VAT (10%):</span>
            <span className={styles.totalValue}>{data.taxAmount?.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span className={styles.totalLabel}>TỔNG CỘNG:</span>
            <span className={styles.totalValue}>{data.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>

        {/* Status */}
        <div className={styles.statusSection}>
          <div className={`${styles.status} ${styles[data.status?.toLowerCase()]}`}>
            Trạng thái: {getStatusText(data.status)}
          </div>
        </div>

        {/* Payment Info */}
        <div className={styles.paymentInfo}>
          <h3>Thông tin thanh toán</h3>
          <p>Quý khách vui lòng thanh toán theo thông tin sau:</p>
          <div className={styles.bankInfo}>
            <div><strong>Ngân hàng:</strong> Vietcombank - Chi nhánh TP.HCM</div>
            <div><strong>Số tài khoản:</strong> 0123456789</div>
            <div><strong>Chủ tài khoản:</strong> Khách sạn Luxury</div>
            <div><strong>Nội dung chuyển khoản:</strong> HĐ{data.invoiceId} {data.customerName}</div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.invoiceFooter}>
          <div className={styles.thankYou}>
            <h3>Cảm ơn quý khách đã sử dụng dịch vụ!</h3>
            <p>Chúng tôi rất hân hạnh được phục vụ quý khách.</p>
            <p>Mọi thắc mắc xin vui lòng liên hệ: <strong>info@khachsanluxury.com</strong></p>
          </div>
          <div className={styles.footerNote}>
            <small>Hóa đơn này được tạo tự động bởi hệ thống quản lý khách sạn.</small>
          </div>
        </div>
      </div>
    </div>
  );

  function getStatusText(status) {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'overdue': return 'Quá hạn';
      case 'partially_paid': return 'Thanh toán một phần';
      default: return 'Chờ xử lý';
    }
  }
};

export default InvoicePreview;
