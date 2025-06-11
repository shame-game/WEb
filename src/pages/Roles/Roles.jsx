import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Users, Settings, Eye } from 'lucide-react';
import { DataGrid, Modal, Form, StatusBadge } from '../../components/UI';
import { roleService } from '../../services';
import { formatDate } from '../../utils/helpers';
import { roleValidationSchema } from '../../utils/validationSchemas';
import { ROLE_STATUS, PERMISSIONS } from '../../constants';
import styles from './Roles.module.css';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewingPermissions, setViewingPermissions] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    filterRoles();
  }, [roles, searchTerm, statusFilter]);
  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAll();
      setRoles(response.data || []);
    } catch (error) {
      console.error('Failed to load roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRoles = () => {
    let filtered = [...roles];

    if (searchTerm) {
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(role => role.status === statusFilter);
    }

    setFilteredRoles(filtered);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingRole) {
        await roleService.update(editingRole.id, formData);
      } else {
        await roleService.create(formData);
      }
      await loadRoles();
      setShowModal(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleService.delete(id);
        await loadRoles();
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const handleViewPermissions = (role) => {
    setViewingPermissions(role);
    setShowPermissionsModal(true);
  };

  const handleToggleStatus = async (role) => {
    try {
      const newStatus = role.status === ROLE_STATUS.ACTIVE ? ROLE_STATUS.INACTIVE : ROLE_STATUS.ACTIVE;
      await roleService.update(role.id, { ...role, status: newStatus });
      await loadRoles();
    } catch (error) {
      console.error('Failed to update role status:', error);
    }
  };  const columns = [
    {
      key: 'name',
      header: 'Tên vai trò',
      render: (role) => {
        if (!role) return '-';
        return (
          <div className={styles.roleInfo}>
            <div className={styles.roleIcon}>
              <Shield size={20} />
            </div>
            <div>
              <div className={styles.roleName}>{role.name || 'Vai trò không xác định'}</div>
              <div className={styles.roleDescription}>{role.description || 'Không có mô tả'}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'userCount',
      header: 'Người dùng',
      render: (role) => {
        if (!role) return '-';
        return (
          <div className={styles.userCount}>
            <Users size={16} />
            {role.userCount || 0}
          </div>
        );
      }
    },
    {
      key: 'permissions',
      header: 'Quyền hạn',
      render: (role) => {
        if (!role) return '-';
        return (
          <div className={styles.permissionsSummary}>
            <span className={styles.permissionCount}>
              {role.permissions ? role.permissions.length : 0} quyền
            </span>
            <button
              className={styles.viewPermissionsBtn}
              onClick={() => handleViewPermissions(role)}
            >
              <Eye size={14} />
              Xem
            </button>
          </div>
        );
      }    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (role) => {
        if (!role) return '-';
        return (
          <StatusBadge 
            status={role.status}
            onClick={() => handleToggleStatus(role)}
            clickable
          />
        );
      }
    },{
      key: 'createdAt',
      header: 'Ngày tạo',
      render: (role) => {
        if (!role?.createdAt) return '-';
        return formatDate(role.createdAt);
      }
    },
    {
      key: 'updatedAt',
      header: 'Cập nhật',
      render: (role) => {
        if (!role?.updatedAt) return '-';
        return formatDate(role.updatedAt);
      }
    }
  ];

  const actions = [
    {
      icon: Settings,
      label: 'Quyền hạn',
      onClick: handleViewPermissions
    },
    {
      icon: Edit,
      label: 'Sửa',
      onClick: handleEdit
    },
    {
      icon: Trash2,
      label: 'Xóa',
      onClick: (role) => handleDelete(role.id),
      className: styles.deleteAction
    }
  ];
  const formFields = [
    {
      name: 'name',
      label: 'Tên vai trò',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên vai trò'
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      required: true,
      placeholder: 'Nhập mô tả vai trò'
    },
    {
      name: 'permissions',
      label: 'Quyền hạn',
      type: 'checkbox-group',
      options: Object.entries(PERMISSIONS).map(([key, value]) => ({
        value: value,
        label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      })),
      required: true
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      options: Object.entries(ROLE_STATUS).map(([key, value]) => ({
        value,
        label: key.charAt(0) + key.slice(1).toLowerCase()
      })),
      defaultValue: ROLE_STATUS.ACTIVE
    }
  ];

  const stats = [
    {
      label: 'Tổng vai trò',
      value: roles.length,
      color: 'primary'
    },
    {
      label: 'Vai trò hoạt động',
      value: roles.filter(r => r.status === ROLE_STATUS.ACTIVE).length,
      color: 'success'    },
    {
      label: 'Vai trò hệ thống',
      value: roles.filter(r => r.isSystem).length,
      color: 'info'
    },
    {
      label: 'Vai trò tùy chỉnh',
      value: roles.filter(r => !r.isSystem).length,
      color: 'warning'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vai trò & Quyền hạn</h1>
        <button
          className={styles.addButton}
          onClick={() => setShowModal(true)}
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
              placeholder="Tìm kiếm theo tên vai trò hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Trạng thái</label>          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value={ROLE_STATUS.ACTIVE}>Hoạt động</option>
            <option value={ROLE_STATUS.INACTIVE}>Không hoạt động</option>
          </select>
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

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRole(null);
        }}
        title={editingRole ? 'Sửa vai trò' : 'Thêm vai trò mới'}
        size="large"
      >
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
          defaultValues={editingRole}
          validationSchema={roleValidationSchema}
          submitText={editingRole ? 'Cập nhật vai trò' : 'Tạo vai trò'}
        />
      </Modal>

      <Modal
        isOpen={showPermissionsModal}
        onClose={() => {
          setShowPermissionsModal(false);
          setViewingPermissions(null);
        }}
        title={`Quyền hạn của ${viewingPermissions?.name}`}
        size="medium"
      >
        {viewingPermissions && (
          <div className={styles.permissionsView}>            <div className={styles.permissionsHeader}>
              <h3>Thông tin vai trò</h3>
              <p>{viewingPermissions.description}</p>
            </div>
            <div className={styles.permissionsList}>
              <h4>Quyền hạn được cấp:</h4>
              {viewingPermissions.permissions && viewingPermissions.permissions.length > 0 ? (
                <div className={styles.permissions}>
                  {viewingPermissions.permissions.map((permission, index) => (
                    <div key={index} className={styles.permissionItem}>
                      <Shield size={16} />
                      {Object.keys(PERMISSIONS).find(key => PERMISSIONS[key] === permission)?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || permission}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noPermissions}>Không có quyền hạn nào được cấp</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Roles;