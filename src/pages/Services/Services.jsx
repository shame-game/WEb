import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Clock, DollarSign, Star, Coffee, Utensils, Car, Wifi, Heart } from 'lucide-react';
import { DataGrid, Modal, Form, StatusBadge } from '../../components/UI';
import { serviceService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { serviceValidationSchema } from '../../utils/validationSchemas';
import { SERVICE_STATUS, SERVICE_CATEGORIES } from '../../constants';
import styles from './Services.module.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, categoryFilter, statusFilter]);
  // Helper function to get service icon based on category
  const getServiceIcon = (category) => {
    switch (category) {
      case SERVICE_CATEGORIES.SPA_WELLNESS:
        return <Heart className={styles.serviceIcon} />;
      case SERVICE_CATEGORIES.FOOD_BEVERAGE:
        return <Utensils className={styles.serviceIcon} />;
      case SERVICE_CATEGORIES.TRANSPORTATION:
        return <Car className={styles.serviceIcon} />;
      case SERVICE_CATEGORIES.WIFI_TECH:
        return <Wifi className={styles.serviceIcon} />;
      default:
        return <Coffee className={styles.serviceIcon} />;
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAll();
      setServices(response.data || []);
    } catch (error) {
      console.error('Failed to load services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (searchTerm) {
      filtered = filtered.filter(service =>
        (service.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter);
    }

    setFilteredServices(filtered);
  };
  const handleSubmit = async (formData) => {
    try {
      if (editingService) {
        await serviceService.update(editingService.id, formData);
      } else {
        await serviceService.create(formData);
      }
      await loadServices();
      setShowModal(false);
      setEditingService(null);
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Lỗi khi lưu dịch vụ. Vui lòng thử lại.');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
      try {
        await serviceService.delete(id);
        await loadServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Lỗi khi xóa dịch vụ. Vui lòng thử lại.');
      }
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      const newStatus = service.status === SERVICE_STATUS.ACTIVE ? SERVICE_STATUS.INACTIVE : SERVICE_STATUS.ACTIVE;
      await serviceService.update(service.id, { ...service, status: newStatus });
      await loadServices();
    } catch (error) {
      console.error('Failed to update service status:', error);
      alert('Lỗi khi cập nhật trạng thái dịch vụ.');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Dịch Vụ',
      render: (service) => {
        if (!service) return '-';
        return (
          <div className={styles.serviceInfo}>
            <div className={styles.serviceIconWrapper}>
              {getServiceIcon(service.category)}
            </div>
            <div>
              <div className={styles.serviceName}>{service.name || 'Không rõ tên'}</div>
              <div className={styles.serviceDescription}>{service.description || 'Không có mô tả'}</div>
            </div>
          </div>
        );
      }
    },    {
      key: 'category',
      header: 'Danh Mục',
      render: (service) => {
        if (!service) return '-';
        const categoryNames = {
          [SERVICE_CATEGORIES.SPA_WELLNESS]: 'Spa & Wellness',
          [SERVICE_CATEGORIES.FOOD_BEVERAGE]: 'Đồ Ăn & Đồ Uống',
          [SERVICE_CATEGORIES.TRANSPORTATION]: 'Vận Chuyển',
          [SERVICE_CATEGORIES.WIFI_TECH]: 'Wi-Fi & Công Nghệ'
        };
        return (
          <div className={styles.categoryBadge}>
            {categoryNames[service.category] || 'Không rõ'}
          </div>
        );
      }
    },
    {
      key: 'price',
      header: 'Giá',
      render: (service) => {
        if (!service) return '-';
        return (
          <div className={styles.priceInfo}>
            <span className={styles.price}>{formatCurrency(service.price || 0)}</span>
            {service.duration && (
              <span className={styles.duration}>
                <Clock size={14} />
                {service.duration} phút
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'rating',
      header: 'Đánh Giá',
      render: (service) => {
        if (!service) return '-';
        return service.rating ? (
          <div className={styles.rating}>
            <Star size={16} />
            {service.rating.toFixed(1)}
            <span className={styles.reviewCount}>({service.reviewCount || 0})</span>
          </div>
        ) : '-';
      }
    },
    {
      key: 'availability',
      header: 'Thời Gian',
      render: (service) => {
        if (!service) return '-';
        return (
          <div className={styles.availability}>
            {service.isAvailable24h ? (
              <span className={styles.available24h}>24/7</span>
            ) : (
              <span className={styles.businessHours}>
                {service.startTime || 'N/A'} - {service.endTime || 'N/A'}
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Trạng Thái',
      render: (service) => {
        if (!service) return '-';
        return (
          <StatusBadge 
            status={service.status}
            onClick={() => handleToggleStatus(service)}
            clickable
          />
        );
      }
    },
    {
      key: 'createdAt',
      header: 'Ngày Tạo',
      render: (service) => {
        if (!service?.createdAt) return '-';
        return formatDate(service.createdAt);
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
      onClick: (service) => handleDelete(service.id),
      className: styles.deleteAction
    }
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Tên Dịch Vụ',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên dịch vụ'
    },
    {
      name: 'description',
      label: 'Mô Tả',
      type: 'textarea',
      required: true,
      placeholder: 'Nhập mô tả dịch vụ'
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: Object.entries(SERVICE_CATEGORIES).map(([key, value]) => ({
        value,
        label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      })),
      placeholder: 'Select category'
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      placeholder: 'Enter price',
      step: '0.01'
    },
    {
      name: 'duration',
      label: 'Duration (minutes)',
      type: 'number',
      placeholder: 'Enter duration in minutes'
    },
    {
      name: 'isAvailable24h',
      label: 'Available 24/7',
      type: 'checkbox'
    },
    {
      name: 'startTime',
      label: 'Start Time',
      type: 'time',
      condition: (values) => !values.isAvailable24h
    },
    {
      name: 'endTime',
      label: 'End Time',
      type: 'time',
      condition: (values) => !values.isAvailable24h
    },
    {
      name: 'maxCapacity',
      label: 'Maximum Capacity',
      type: 'number',
      placeholder: 'Enter maximum capacity'
    },
    {
      name: 'requirements',
      label: 'Special Requirements',
      type: 'textarea',
      placeholder: 'Enter any special requirements'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: Object.entries(SERVICE_STATUS).map(([key, value]) => ({
        value,
        label: key.charAt(0) + key.slice(1).toLowerCase()
      })),
      defaultValue: SERVICE_STATUS.ACTIVE
    }
  ];

  const stats = [
    {
      label: 'Total Services',
      value: services.length,
      color: 'primary'
    },
    {
      label: 'Active Services',
      value: services.filter(s => s.status === SERVICE_STATUS.ACTIVE).length,
      color: 'success'
    },
    {
      label: 'Average Price',
      value: services.length > 0 ? formatCurrency(services.reduce((sum, s) => sum + s.price, 0) / services.length) : '$0',
      color: 'info'
    },
    {
      label: 'High Rated',
      value: services.filter(s => s.rating >= 4.5).length,
      color: 'warning'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hotel Services</h1>
        <button
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add Service
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
              placeholder="Search by service name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Categories</option>
            {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
              <option key={value} value={value}>
                {key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value={SERVICE_STATUS.ACTIVE}>Active</option>
            <option value={SERVICE_STATUS.INACTIVE}>Inactive</option>
          </select>
        </div>
      </div>

      <div className={styles.content}>
        <DataGrid
          data={filteredServices}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="No services found"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingService(null);
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="large"
      >
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
          defaultValues={editingService}
          validationSchema={serviceValidationSchema}
          submitText={editingService ? 'Update Service' : 'Create Service'}
        />
      </Modal>
    </div>
  );
};

export default Services;