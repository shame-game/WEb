import React, { useState, useEffect } from 'react';
import { DataGrid, StatusBadge, Modal } from '../../components/UI';
import { Plus, Eye, FileText, Download, Search } from 'lucide-react';
import { mockInvoices } from '../../data/mockData';
import styles from './Invoices.module.css';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setInvoices(mockInvoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handlePrintInvoice = (invoice) => {
    // Create printable content
    const printContent = `
      <html>
        <head>
          <title>Hóa đơn #${invoice.invoiceId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin: 20px 0; }
            .table { width: 100%; border-collapse: collapse; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f2f2f2; }
            .total { text-align: right; margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HÓA ĐƠN KHÁCH SẠN</h1>
            <h2>Hóa đơn #${invoice.invoiceId}</h2>
          </div>
          <div class="details">
            <p><strong>Khách hàng:</strong> ${invoice.customerName}</p>
            <p><strong>Phòng:</strong> ${invoice.roomNumber} - ${invoice.roomType || ''}</p>
            <p><strong>Ngày nhận phòng:</strong> ${invoice.checkInDate || ''}</p>
            <p><strong>Ngày trả phòng:</strong> ${invoice.checkOutDate || ''}</p>
            <p><strong>Số đêm:</strong> ${invoice.nights || ''}</p>
            <p><strong>Ngày xuất hóa đơn:</strong> ${invoice.issueDate}</p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Mô tả</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items?.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>1</td>
                  <td>${item.amount?.toLocaleString('vi-VN')} VNĐ</td>
                  <td>${item.amount?.toLocaleString('vi-VN')} VNĐ</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          <div class="total">
            <p>Tổng cộng: ${invoice.totalAmount?.toLocaleString('vi-VN')} VNĐ</p>
            <p>Trạng thái: ${getStatusText(invoice.status)}</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PAID': return 'Đã thanh toán';
      case 'PENDING': return 'Chờ thanh toán';
      case 'PARTIALLY_PAID': return 'Thanh toán một phần';
      case 'OVERDUE': return 'Quá hạn';
      default: return status;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'PARTIALLY_PAID': return 'info';
      case 'OVERDUE': return 'danger';
      default: return 'secondary';
    }
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchTerm || 
      invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceId.toString().includes(searchTerm);
    
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // DataGrid columns configuration
  const columns = [
    {
      key: 'invoiceId',
      header: 'Mã hóa đơn',
      width: '120px',
      render: (value, invoice) => `#HD${invoice.invoiceId}`
    },
    {
      key: 'bookingId',
      header: 'Mã đặt phòng',
      width: '120px',
      render: (value, invoice) => `#${invoice.bookingId}`
    },
    {
      key: 'customerName',
      header: 'Khách hàng',
      render: (value, invoice) => invoice.customerName
    },
    {
      key: 'roomInfo',
      header: 'Phòng',
      render: (value, invoice) => (
        <div>
          <div>{invoice.roomNumber}</div>
          <div className={styles.roomType}>{invoice.roomType}</div>
        </div>
      )
    },
    {
      key: 'issueDate',
      header: 'Ngày xuất',
      width: '120px',
      render: (value, invoice) => invoice.issueDate
    },
    {
      key: 'totalAmount',
      header: 'Tổng tiền',
      width: '120px',
      render: (value, invoice) => `${invoice.totalAmount?.toLocaleString('vi-VN')} VNĐ`
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '120px',
      render: (value, invoice) => (
        <StatusBadge 
          status={invoice.status} 
          variant={getStatusVariant(invoice.status)}
        />
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '120px',
      render: (value, invoice) => (
        <div className={styles.actions}>
          <button 
            onClick={() => handleViewInvoice(invoice)} 
            className={styles.viewButton}
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => handlePrintInvoice(invoice)} 
            className={styles.printButton}
            title="In hóa đơn"
          >
            <FileText size={16} />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'PENDING', label: 'Chờ thanh toán' },
    { value: 'PARTIALLY_PAID', label: 'Thanh toán một phần' },
    { value: 'OVERDUE', label: 'Quá hạn' }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý hóa đơn</h1>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tìm kiếm</label>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo khách hàng, phòng hoặc mã hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.filterInput}
            />
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Trạng thái</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Grid */}
      <div className={styles.content}>
        <DataGrid
          data={filteredInvoices}
          columns={columns}
          loading={loading}
          emptyMessage="Không tìm thấy hóa đơn nào"
        />
      </div>

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <Modal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          title={`Chi tiết hóa đơn #HD${selectedInvoice.invoiceId}`}
          className={styles.invoiceModal}
        >
          <div className={styles.invoiceDetail}>
            {/* Invoice Info */}
            <div className={styles.invoiceInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Mã đặt phòng:</span>
                  <span className={styles.infoValue}>#{selectedInvoice.bookingId}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Khách hàng:</span>
                  <span className={styles.infoValue}>{selectedInvoice.customerName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phòng:</span>
                  <span className={styles.infoValue}>{selectedInvoice.roomNumber} - {selectedInvoice.roomType}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày nhận phòng:</span>
                  <span className={styles.infoValue}>{selectedInvoice.checkInDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày trả phòng:</span>
                  <span className={styles.infoValue}>{selectedInvoice.checkOutDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số đêm:</span>
                  <span className={styles.infoValue}>{selectedInvoice.nights}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày xuất hóa đơn:</span>
                  <span className={styles.infoValue}>{selectedInvoice.issueDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Trạng thái:</span>
                  <StatusBadge 
                    status={selectedInvoice.status} 
                    variant={getStatusVariant(selectedInvoice.status)}
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className={styles.invoiceItems}>
              <h3>Chi tiết hóa đơn</h3>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Mô tả</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>1</td>
                      <td>{item.amount?.toLocaleString('vi-VN')} VNĐ</td>
                      <td>{item.amount?.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Total */}
            <div className={styles.invoiceTotal}>
              <div className={styles.totalRow}>
                <span>Tạm tính:</span>
                <span>{selectedInvoice.subtotal?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className={styles.totalRow}>
                <span>Thuế:</span>
                <span>{selectedInvoice.taxAmount?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Tổng cộng:</span>
                <span>{selectedInvoice.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.modalActions}>
              <button 
                onClick={() => handlePrintInvoice(selectedInvoice)} 
                className={styles.printButton}
              >
                <FileText size={16} />
                In hóa đơn
              </button>
              <button 
                onClick={() => setShowInvoiceModal(false)} 
                className={styles.closeButton}
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Invoices;
