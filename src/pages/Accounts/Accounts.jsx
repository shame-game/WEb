import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Shield, User, Mail, Phone } from 'lucide-react';
import { DataGrid, Modal, Form, StatusBadge } from '../../components/UI';
import { accountService, roleService } from '../../services';
import { formatDate } from '../../utils/helpers';
import { userValidationSchema } from '../../utils/validationSchemas';
import { USER_STATUS } from '../../constants';
import styles from './Accounts.module.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadAccounts();
    loadRoles();
  }, []);
  useEffect(() => {
    filterAccounts();
  }, [accounts, searchTerm, statusFilter, roleFilter]);
  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://quanlyks.onrender.com/api/Customer');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAccounts(data || []);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };
  const loadRoles = async () => {
    try {
      // Tạm thời sử dụng roles tĩnh vì API không có roles endpoint
      const mockRoles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' }
      ];
      setRoles(mockRoles);
    } catch (error) {
      console.error('Failed to load roles:', error);
      setRoles([]);
    }
  };
  const filterAccounts = () => {
    let filtered = [...accounts];

    if (searchTerm) {
      filtered = filtered.filter(account => {
        const fullName = account.fullName || '';
        const email = account.email || '';
        const username = account.username || '';
        const phoneNumber = account.phoneNumber || '';
        
        return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               username.toLowerCase().includes(searchTerm.toLowerCase()) ||
               phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(account => {
        // Map roleName to status for filtering
        if (statusFilter === 'Admin') {
          return account.roleName === 'Admin';
        } else if (statusFilter === 'User') {
          return account.roleName === 'User';
        }
        return true;
      });
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(account => account.roleName === roleFilter);
    }

    setFilteredAccounts(filtered);
  };
  const handleSubmit = async (formData) => {
    try {
      if (editingAccount) {
        // API call để cập nhật account
        // await fetch(`https://quanlyks.onrender.com/api/Customer/${editingAccount.customerId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        alert('Chức năng cập nhật chưa được triển khai trên API');
      } else {
        // API call để tạo account mới
        // await fetch('https://quanlyks.onrender.com/api/Customer', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        alert('Chức năng tạo mới chưa được triển khai trên API');
      }
      await loadAccounts();
      setShowModal(false);
      setEditingAccount(null);
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowModal(true);
  };
  const handleDelete = async (customerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        // API call để xóa account
        // await fetch(`https://quanlyks.onrender.com/api/Customer/${customerId}`, { method: 'DELETE' });
        
        alert('Chức năng xóa chưa được triển khai trên API');
        await loadAccounts();
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };
  const handleToggleStatus = async (account) => {
    try {
      alert('Chức năng thay đổi trạng thái chưa được triển khai trên API');
      // Có thể implement logic toggle status tại đây nếu API hỗ trợ
    } catch (error) {
      console.error('Failed to update account status:', error);
    }
  };
  const columns = [
    {
      key: 'fullName',
      header: 'Tên người dùng',
      render: (account) => {
        if (!account) return '-';
        
        return (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={20} />
            </div>
            <div>
              <div className={styles.userName}>
                {account.fullName || 'Không có tên'}
              </div>
              <div className={styles.userUsername}>@{account.username || 'unknown'}</div>
            </div>
          </div>
        );
      }
    },    {
      key: 'email',
      header: 'Email',
      render: (account) => {
        if (!account?.email) return '-';
        
        return (
          <div className={styles.contactInfo}>
            <Mail size={16} />
            {account.email}
          </div>
        );
      }
    },
    {
      key: 'phoneNumber',
      header: 'Số điện thoại',
      render: (account) => {
        if (!account?.phoneNumber) return '-';
        
        return (
          <div className={styles.contactInfo}>
            <Phone size={16} />
            {account.phoneNumber}
          </div>
        );
      }
    },
    {
      key: 'address',
      header: 'Địa chỉ',
      render: (account) => {
        if (!account?.address) return '-';
        return account.address;
      }
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: (account) => {
        if (!account) return '-';
        
        return (
          <div className={styles.roleInfo}>
            <Shield size={16} />
            {account.roleName || 'User'}
          </div>
        );
      }
    },    {
      key: 'customerId',
      header: 'ID',
      render: (account) => {
        if (!account) return '-';
        return `#${account.customerId}`;
      }
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'View',
      onClick: (account) => {
        // Could open a view modal with detailed information
        console.log('View account:', account);
      }
    },
    {
      icon: Edit,
      label: 'Edit',
      onClick: handleEdit
    },    {
      icon: Trash2,
      label: 'Xóa',
      onClick: (account) => handleDelete(account.customerId),
      className: styles.deleteAction
    }
  ];
  const formFields = [
    {
      name: 'fullName',
      label: 'Họ và tên',
      type: 'text',
      required: true,
      placeholder: 'Nhập họ và tên'
    },
    {
      name: 'username',
      label: 'Tên đăng nhập',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên đăng nhập'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Nhập địa chỉ email'
    },
    {
      name: 'phoneNumber',
      label: 'Số điện thoại',
      type: 'tel',
      placeholder: 'Nhập số điện thoại'
    },
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'text',
      placeholder: 'Nhập địa chỉ'
    },
    {
      name: 'roleName',
      label: 'Vai trò',
      type: 'select',
      required: true,
      options: [
        { value: 'User', label: 'Người dùng' },
        { value: 'Admin', label: 'Quản trị viên' }
      ],
      placeholder: 'Chọn vai trò'
    }
  ];
  const stats = [
    {
      label: 'Tổng người dùng',
      value: accounts.length,
      color: 'primary'
    },
    {
      label: 'Quản trị viên',
      value: accounts.filter(a => a.roleName === 'Admin').length,
      color: 'success'
    },
    {
      label: 'Người dùng',
      value: accounts.filter(a => a.roleName === 'User').length,
      color: 'warning'
    },
    {
      label: 'Có email',
      value: accounts.filter(a => a.email).length,
      color: 'info'
    }
  ];

  return (
    <div className={styles.container}>      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý tài khoản người dùng</h1>
        <button
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Thêm người dùng
        </button>
      </div>

      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={`${styles.statCard} ${styles[stat.color]}`}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Search</label>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value={USER_STATUS.ACTIVE}>Active</option>
            <option value={USER_STATUS.INACTIVE}>Inactive</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.content}>
        <DataGrid
          data={filteredAccounts}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="No user accounts found"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAccount(null);
        }}
        title={editingAccount ? 'Edit User Account' : 'Add New User Account'}
        size="large"
      >
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
          defaultValues={editingAccount}
          validationSchema={userValidationSchema}
          submitText={editingAccount ? 'Update User' : 'Create User'}
        />
      </Modal>
    </div>
  );
};

export default Accounts;