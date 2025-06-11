import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, User, Phone, Mail, MapPin } from 'lucide-react';
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
  }, []);  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://quanlyks.onrender.com/api/Customer');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCustomers(data || []);
      setTotalItems(data.length || 0);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Fallback to empty array on error
      setCustomers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };
  const handleDelete = async (customer) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${customer.fullName}"?`)) {
      try {
        // API call để xóa customer nếu cần
        // await fetch(`https://quanlyks.onrender.com/api/Customer/${customer.customerId}`, { method: 'DELETE' });
        
        // Tạm thời chỉ refresh dữ liệu
        fetchCustomers();
        alert('Chức năng xóa chưa được triển khai trên API');
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Lỗi khi xóa người dùng. Vui lòng thử lại.');
      }
    }
  };
  const handleSubmit = async (data) => {
    try {
      if (selectedCustomer) {
        // API call để cập nhật customer
        // await fetch(`https://quanlyks.onrender.com/api/Customer/${selectedCustomer.customerId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        alert('Chức năng cập nhật chưa được triển khai trên API');
      } else {
        // API call để tạo customer mới
        // await fetch('https://quanlyks.onrender.com/api/Customer', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        alert('Chức năng tạo mới chưa được triển khai trên API');
      }
      setShowModal(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      throw error;
    }
  };  const columns = [
    {      key: 'fullName',
      label: 'Tên người dùng',
      render: (customer) => {
        if (!customer) return '-';
        return (
          <div className={styles.customerInfo}>
            <div className={styles.customerIcon}>
              <User size={20} />
            </div>            <div>
              <div className={styles.customerName}>
                {customer.fullName || 'Không có tên'}
              </div>
              <div className={styles.customerId}>ID: {customer.customerId || 'N/A'}</div>
            </div>
          </div>
        );
      }
    },    {
      key: 'contact',
      label: 'Thông tin liên hệ',
      render: (customer) => {
        if (!customer) return '-';
        return (
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Mail size={14} />
              <span>{customer.email || 'N/A'}</span>
            </div>            <div className={styles.contactItem}>
              <Phone size={14} />
              <span>{customer.phoneNumber || 'N/A'}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      render: (customer) => {
        if (!customer) return '-';
        return (
          <div className={styles.addressInfo}>
            <MapPin size={14} />
            <span>{customer.address || 'N/A'}</span>
          </div>
        );
      }
    },    {
      key: 'username',
      label: 'Tên đăng nhập',
      render: (customer) => {
        if (!customer) return '-';
        return (
          <div className={styles.usernameInfo}>
            <span>{customer.username || 'N/A'}</span>
          </div>
        );
      }
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (customer) => {
        if (!customer) return '-';
        return (
          <StatusBadge 
            status={customer.roleName || 'User'} 
            variant={customer.roleName === 'Admin' ? 'success' : 'secondary'} 
          />
        );
      }
    }
  ];  const formFields = [
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
      name: 'phoneNumber',
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
      name: 'username',
      label: 'Tên đăng nhập',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên đăng nhập'
    },
    {
      name: 'roleName',
      label: 'Vai trò',
      type: 'select',
      options: [
        { value: 'User', label: 'Người dùng' },
        { value: 'Admin', label: 'Quản trị viên' }
      ],
      defaultValue: 'User'
    }  ];

  // Actions for the DataGrid
  const actions = [
    {
      icon: Edit2,
      label: 'Sửa',
      onClick: handleEdit
    },
    {
      icon: Trash2,
      label: 'Xóa',
      onClick: handleDelete,
      className: styles.deleteAction
    }
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.fullName?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phoneNumber?.toLowerCase().includes(searchLower) ||
      customer.username?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.customers}>
      <div className={styles.header}>        <div>
          <h1>Quản lý người dùng & khách hàng</h1>
          <p>Quản lý thông tin tài khoản người dùng và khách hàng của khách sạn</p>
        </div>
        <button onClick={handleCreate} className={styles.createButton}>
          <Plus size={20} />
          Thêm người dùng
        </button>
      </div>      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng theo tên, email, hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>      <DataGrid
        data={filteredCustomers}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="Không tìm thấy người dùng nào"
        pagination={{
          currentPage,
          totalItems: filteredCustomers.length,
          itemsPerPage,
          onPageChange: setCurrentPage
        }}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCustomer ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
      >        <Form
          fields={formFields}
          initialData={selectedCustomer}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}        />
      </Modal>
    </div>
  );
};

export default Customers;