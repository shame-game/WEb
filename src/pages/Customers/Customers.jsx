import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, User, Phone, Mail, MapPin } from 'lucide-react';
import { customerService } from '../../services';
import { customerValidationSchema } from '../../utils/validationSchemas';
import DataGrid from '../../components/UI/DataGrid';
import Modal from '../../components/UI/Modal';
import Form from '../../components/UI/Form';
import StatusBadge from '../../components/UI/StatusBadge';
import styles from './Customers.module.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm
      };
      const response = await customerService.getAll(params);
      setCustomers(response.data.items || response.data);
      setTotalItems(response.data.total || response.data.length);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Mock data for development
      const mockData = generateMockCustomers();
      setCustomers(mockData);
      setTotalItems(mockData.length);
    } finally {
      setLoading(false);
    }
  };

  const generateMockCustomers = () => [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phoneNumber: '+1234567890',
      address: '123 Main St, City, State',
      dateOfBirth: '1985-06-15',
      nationalId: 'ID123456789',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phoneNumber: '+1234567891',
      address: '456 Oak Ave, City, State',
      dateOfBirth: '1990-03-22',
      nationalId: 'ID987654321',
      isActive: true,
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@email.com',
      phoneNumber: '+1234567892',
      address: '789 Pine Rd, City, State',
      dateOfBirth: '1978-11-08',
      nationalId: 'ID456789123',
      isActive: false,
      createdAt: '2024-01-05T09:15:00Z'
    }
  ];

  const handleCreate = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Are you sure you want to delete customer "${customer.firstName} ${customer.lastName}"?`)) {
      try {
        await customerService.delete(customer.id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer. Please try again.');
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCustomer) {
        await customerService.update(selectedCustomer.id, data);
      } else {
        await customerService.create(data);
      }
      setShowModal(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      throw error;
    }
  };
  const columns = [
    {
      key: 'fullName',
      label: 'Tên khách hàng',
      render: (_, customer) => {
        if (!customer) return '-';
        return (
          <div className={styles.customerInfo}>
            <div className={styles.customerIcon}>
              <User size={20} />
            </div>
            <div>
              <div className={styles.customerName}>
                {customer.fullName || 'Không có tên'}
              </div>
              <div className={styles.customerId}>ID: {customer.identityCard || customer.nationalId || 'N/A'}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'contact',
      label: 'Thông tin liên hệ',
      render: (_, customer) => {
        if (!customer) return '-';
        return (
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Mail size={14} />
              <span>{customer.email || 'N/A'}</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={14} />
              <span>{customer.phone || customer.phoneNumber || 'N/A'}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      render: (_, customer) => {
        if (!customer) return '-';
        return (
          <div className={styles.addressInfo}>
            <MapPin size={14} />
            <span>{customer.address || 'N/A'}</span>
          </div>
        );
      }
    },
    {
      key: 'dateOfBirth',
      label: 'Ngày sinh',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A'    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (_, customer) => {
        if (!customer) return '-';
        return (
          <StatusBadge status={customer.status || customer.isActive ? 'active' : 'inactive'} />
        );
      }
    },
    {
      key: 'actions',
      label: 'Hành động',
      render: (_, customer) => {
        if (!customer) return '-';
        return (
          <div className={styles.actions}>
            <button
              onClick={() => handleEdit(customer)}
              className={styles.editButton}
              title="Sửa"
            >
              <Edit2 size={16} />
            </button>
            <button              onClick={() => handleDelete(customer)}
              className={styles.deleteButton}
              title="Xóa"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      }
    }
  ];
  const formFields = [
    {
      name: 'fullName',
      label: 'Họ và tên',
      type: 'text',
      required: true,
      placeholder: 'Nhập họ và tên đầy đủ'
    },
    {
      name: 'email',
      label: 'Địa chỉ email',
      type: 'email',
      required: true,
      placeholder: 'Nhập địa chỉ email'
    },
    {
      name: 'phone',
      label: 'Số điện thoại',
      type: 'tel',
      required: true,
      placeholder: 'Nhập số điện thoại'
    },
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'text',
      required: true,
      placeholder: 'Nhập địa chỉ đầy đủ'
    },
    {
      name: 'dateOfBirth',
      label: 'Ngày sinh',
      type: 'date',
      required: true
    },
    {
      name: 'identityCard',
      label: 'CMND/CCCD',
      type: 'text',      required: true,
      placeholder: 'Nhập số CMND/CCCD'
    },
    {
      name: 'nationality',
      label: 'Quốc tịch',
      type: 'text',
      placeholder: 'Nhập quốc tịch'
    },
    {
      name: 'status',
      label: 'Trạng thái hoạt động',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Hoạt động' },
        { value: 'INACTIVE', label: 'Không hoạt động' }
      ],
      defaultValue: 'ACTIVE'
    }
  ];

  return (
    <div className={styles.customers}>
      <div className={styles.header}>
        <div>
          <h1>Quản lý khách hàng</h1>
          <p>Quản lý thông tin khách và khách hàng của khách sạn</p>
        </div>
        <button onClick={handleCreate} className={styles.createButton}>
          <Plus size={20} />
          Thêm khách hàng
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={20} />          <input
            type="text"
            placeholder="Tìm kiếm khách hàng theo tên, email, hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataGrid
        data={customers}
        columns={columns}
        loading={loading}
        emptyMessage="Không tìm thấy khách hàng nào"
        pagination={{
          currentPage,
          totalItems,
          itemsPerPage,
          onPageChange: setCurrentPage
        }}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCustomer ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
      >
        <Form
          fields={formFields}
          initialData={selectedCustomer}
          validationSchema={customerValidationSchema}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Customers;