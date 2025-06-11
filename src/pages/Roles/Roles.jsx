import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Users } from 'lucide-react';
import { DataGrid } from '../../components/UI';
import styles from './Roles.module.css';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    filterRoles();
  }, [roles, searchTerm]);  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://quanlyks.onrender.com/api/Role');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRoles(data || []);
    } catch (error) {
      console.error('Failed to load roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };  const filterRoles = () => {
    let filtered = [...roles];

    if (searchTerm) {
      filtered = filtered.filter(role =>
        (role.roleName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRoles(filtered);
  };const handleCreate = () => {
    alert('Chức năng tạo mới chưa được triển khai trên API');
  };

  const handleEdit = (role) => {
    alert('Chức năng cập nhật chưa được triển khai trên API');
  };

  const handleDelete = async (roleId) => {
    alert('Chức năng xóa chưa được triển khai trên API');
  };

  const columns = [
    {
      key: 'roleName',
      header: 'Tên vai trò',
      render: (role) => {
        if (!role) return '-';
        return (
          <div className={styles.roleInfo}>
            <div className={styles.roleIcon}>
              <Shield size={20} />
            </div>
            <div>
              <div className={styles.roleName}>{role.roleName || 'Vai trò không xác định'}</div>
              <div className={styles.roleDescription}>ID: {role.roleId}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'customerCount',
      header: 'Số khách hàng',
      render: (role) => {
        if (!role) return '-';
        const customerCount = role.customers ? role.customers.length : 0;
        return (
          <div className={styles.userCount}>
            <Users size={16} />
            {customerCount}
          </div>
        );
      }
    },
    {
      key: 'roleId',
      header: 'ID',
      render: (role) => {
        if (!role) return '-';
        return role.roleId;
      }
    }
  ];
  const actions = [
    {
      icon: Edit,
      label: 'Sửa',
      onClick: handleEdit
    },
    {
      icon: Trash2,
      label: 'Xóa',
      onClick: (role) => handleDelete(role.roleId),
      className: styles.deleteAction
    }
  ];

  const stats = [
    {
      label: 'Tổng vai trò',
      value: roles.length,
      color: 'primary'
    },
    {
      label: 'Khách hàng',
      value: roles.reduce((total, role) => total + (role.customers ? role.customers.length : 0), 0),
      color: 'success'
    }
  ];
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vai trò</h1>
        <button
          className={styles.addButton}
          onClick={handleCreate}
        >
          <Plus size={20} />
          Thêm vai trò
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
          <label className={styles.filterLabel}>Tìm kiếm</label>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <DataGrid
          data={filteredRoles}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Không tìm thấy vai trò nào"
        />
      </div>
    </div>
  );
};

export default Roles;