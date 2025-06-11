import React, { useState, useEffect } from 'react';
import { DataGrid, StatusBadge, Modal, ModalButton, Form, FormField } from '../../components/UI';
import { invoiceService, paymentService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { paymentSchema } from '../../utils/validationSchemas';
import { Plus, Eye } from 'lucide-react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getAll();
      setInvoices(response.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (invoiceId) => {
    try {
      const response = await paymentService.getByInvoiceId(invoiceId);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  const handleViewInvoice = async (invoice) => {
    setSelectedInvoice(invoice);
    await fetchPayments(invoice.invoiceId);
  };

  const handleAddPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (data) => {
    try {
      await paymentService.create({
        ...data,
        invoiceId: selectedInvoice.invoiceId
      });
      
      // Refresh data
      await fetchInvoices();
      await fetchPayments(selectedInvoice.invoiceId);
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };
  const columns = [
    {
      key: 'invoiceId',
      title: 'Mã HĐ',
      render: (value) => value ? `HD${value.toString().padStart(4, '0')}` : '-'
    },
    {
      key: 'bookingId',
      title: 'Mã booking',
      render: (value) => value ? `BK${value.toString().padStart(4, '0')}` : '-'
    },
    {
      key: 'issueDate',
      title: 'Ngày xuất',
      render: (value) => value ? formatDate(value, 'DD/MM/YYYY') : '-'
    },
    {
      key: 'totalAmount',
      title: 'Tổng tiền',
      render: (value) => formatCurrency(value || 0)
    },
    {
      key: 'taxAmount',
      title: 'Thuế',
      render: (value) => formatCurrency(value || 0)
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (value) => <StatusBadge status={value || 'unknown'} type="invoice" />
    }
  ];

  const paymentMethods = [
    { value: 'Cash', label: 'Tiền mặt' },
    { value: 'CreditCard', label: 'Thẻ tín dụng' },
    { value: 'BankTransfer', label: 'Chuyển khoản' },
    { value: 'EWallet', label: 'Ví điện tử' }
  ];

  const remainingAmount = selectedInvoice ? 
    selectedInvoice.totalAmount - payments.reduce((sum, p) => sum + p.amount, 0) : 0;

  return (
    <div>
      <DataGrid
        title="Quản lý hóa đơn"
        data={invoices}
        columns={columns}
        loading={loading}
        onView={handleViewInvoice}
        searchable={true}
        sortable={true}
      />

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Chi tiết hóa đơn HD${selectedInvoice?.invoiceId?.toString().padStart(4, '0')}`}
        size="large"
      >
        {selectedInvoice && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Invoice Info */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <div>
                <strong>Mã booking:</strong> BK{selectedInvoice.bookingId?.toString().padStart(4, '0')}
              </div>
              <div>
                <strong>Ngày xuất:</strong> {formatDate(selectedInvoice.issueDate)}
              </div>
              <div>
                <strong>Tổng tiền:</strong> {formatCurrency(selectedInvoice.totalAmount)}
              </div>
              <div>
                <strong>Thuế:</strong> {formatCurrency(selectedInvoice.taxAmount)}
              </div>
              <div>
                <strong>Trạng thái:</strong> <StatusBadge status={selectedInvoice.status} type="invoice" />
              </div>
              <div>
                <strong>Còn nợ:</strong> 
                <span style={{ color: remainingAmount > 0 ? '#ef4444' : '#10b981' }}>
                  {formatCurrency(remainingAmount)}
                </span>
              </div>
            </div>

            {/* Payment History */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: 0 }}>Lịch sử thanh toán</h4>
                {remainingAmount > 0 && (
                  <button
                    onClick={handleAddPayment}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Plus size={16} />
                    Thêm thanh toán
                  </button>
                )}
              </div>

              {payments.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
                  Chưa có thanh toán nào
                </p>
              ) : (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                          Ngày
                        </th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                          Số tiền
                        </th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                          Phương thức
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, index) => (
                        <tr key={payment.paymentId} style={{ borderBottom: index < payments.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                          <td style={{ padding: '0.75rem' }}>
                            {formatDate(payment.paymentDate, 'DD/MM/YYYY HH:mm')}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            {formatCurrency(payment.amount)}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            {paymentMethods.find(m => m.value === payment.paymentMethod)?.label || payment.paymentMethod}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Thêm thanh toán"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ModalButton variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Hủy
            </ModalButton>
            <ModalButton type="submit" form="payment-form">
              Lưu
            </ModalButton>
          </div>
        }
      >
        <Form
          id="payment-form"
          onSubmit={handlePaymentSubmit}
          validationSchema={paymentSchema}
          defaultValues={{
            amount: remainingAmount,
            paymentMethod: '',
            paymentDate: new Date().toISOString().slice(0, 16)
          }}
        >
          {({ control, errors }) => (
            <>
              <FormField
                name="amount"
                label="Số tiền"
                type="number"
                step="1000"
                min="1000"
                max={remainingAmount}
                required
                control={control}
                errors={errors}
              />
              <FormField
                name="paymentMethod"
                label="Phương thức thanh toán"
                type="select"
                options={paymentMethods}
                required
                control={control}
                errors={errors}
              />
              <FormField
                name="paymentDate"
                label="Ngày thanh toán"
                type="datetime-local"
                required
                control={control}
                errors={errors}
              />
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Invoices;
