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
      const response = await accountService.getAll();
      setAccounts(response.data || []);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await roleService.getAll();
      setRoles(response.data || []);
    } catch (error) {
      console.error('Failed to load roles:', error);
      setRoles([]);
    }
  };

  const filterAccounts = () => {
    let filtered = [...accounts];

    if (searchTerm) {      filtered = filtered.filter(account => {
        const displayName = account.displayName || '';
        const firstName = account.firstName || '';
        const lastName = account.lastName || '';
        const email = account.email || '';
        const username = account.username || '';
        
        return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               username.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(account => account.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(account => account.roleId === roleFilter);
    }

    setFilteredAccounts(filtered);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingAccount) {
        await accountService.update(editingAccount.id, formData);
      } else {
        await accountService.create(formData);
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountService.delete(id);
        await loadAccounts();
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const handleToggleStatus = async (account) => {
    try {
      const newStatus = account.status === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE;
      await accountService.update(account.id, { ...account, status: newStatus });
      await loadAccounts();
    } catch (error) {
      console.error('Failed to update account status:', error);
    }
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Name',      render: (account) => {
        if (!account) return '-';
        
        return (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={20} />
            </div>
            <div>
              <div className={styles.userName}>
                {account.displayName || `${account.firstName || ''} ${account.lastName || ''}`.trim() || 'Unknown User'}
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
      key: 'phone',
      header: 'Phone',
      render: (account) => {
        if (!account?.phone) return '-';
        
        return (
          <div className={styles.contactInfo}>
            <Phone size={16} />
            {account.phone}
          </div>
        );
      }
    },
    {
      key: 'role',
      header: 'Role',
      render: (account) => {
        if (!account) return '-';
        
        const role = roles.find(r => r.id === account.roleId);
        return (
          <div className={styles.roleInfo}>
            <Shield size={16} />
            {role ? role.name : 'Unknown'}
          </div>
        );
      }
    },    {
      key: 'status',
      header: 'Status',
      render: (account) => {
        if (!account) return '-';
        
        return (
          <StatusBadge 
            status={account.status}
            onClick={() => handleToggleStatus(account)}
            clickable
          />
        );
      }
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (account) => {
        if (!account) return '-';
        return account.lastLogin ? formatDate(account.lastLogin) : 'Never';
      }
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (account) => {
        if (!account?.createdAt) return '-';
        return formatDate(account.createdAt);
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
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: (account) => handleDelete(account.id),
      className: styles.deleteAction
    }
  ];

  const formFields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter first name'
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter last name'
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Enter username'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address'
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      placeholder: 'Enter phone number'
    },
    {
      name: 'roleId',
      label: 'Role',
      type: 'select',
      required: true,
      options: roles.map(role => ({ value: role.id, label: role.name })),
      placeholder: 'Select role'
    },
    ...(!editingAccount ? [{
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password'
    }, {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      required: true,
      placeholder: 'Confirm password'
    }] : []),
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: Object.entries(USER_STATUS).map(([key, value]) => ({
        value,
        label: key.charAt(0) + key.slice(1).toLowerCase()
      })),
      defaultValue: USER_STATUS.ACTIVE
    }
  ];

  const stats = [
    {
      label: 'Total Users',
      value: accounts.length,
      color: 'primary'
    },
    {
      label: 'Active Users',
      value: accounts.filter(a => a.status === USER_STATUS.ACTIVE).length,
      color: 'success'
    },
    {
      label: 'Inactive Users',
      value: accounts.filter(a => a.status === USER_STATUS.INACTIVE).length,
      color: 'warning'
    },
    {
      label: 'Online Now',
      value: accounts.filter(a => a.isOnline).length,
      color: 'info'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Accounts</h1>
        <button
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add User
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