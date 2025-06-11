import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingDown, TrendingUp, Minus, RotateCcw } from 'lucide-react';
import { DataGrid, Modal, Form, StatusBadge } from '../../components/UI';
import { inventoryService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { inventoryValidationSchema, stockAdjustmentValidationSchema } from '../../utils/validationSchemas';
import { INVENTORY_STATUS, INVENTORY_CATEGORIES } from '../../constants';
import styles from './Inventory.module.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [adjustingItem, setAdjustingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, categoryFilter, statusFilter, stockFilter]);
  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAll();
      setInventory(response.data || []);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };  const filterInventory = () => {
    if (!Array.isArray(inventory)) return;
    
    let filtered = [...inventory];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (stockFilter === 'low') {
      filtered = filtered.filter(item => (item.currentStock || 0) <= (item.minStock || 0));
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(item => (item.currentStock || 0) === 0);
    }

    setFilteredInventory(filtered);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await inventoryService.update(editingItem.id, formData);
      } else {
        await inventoryService.create(formData);
      }
      await loadInventory();
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save inventory item:', error);
    }
  };

  const handleAdjustmentSubmit = async (formData) => {
    try {
      await inventoryService.adjustStock(adjustingItem.id, formData);
      await loadInventory();
      setShowAdjustmentModal(false);
      setAdjustingItem(null);
    } catch (error) {
      console.error('Failed to adjust stock:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAdjustStock = (item) => {
    setAdjustingItem(item);
    setShowAdjustmentModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await inventoryService.delete(id);
        await loadInventory();
      } catch (error) {
        console.error('Failed to delete inventory item:', error);
      }
    }
  };
  const getStockStatus = (item) => {
    if (!item || typeof item.currentStock !== 'number') return 'unknown';
    if (item.currentStock === 0) return 'out-of-stock';
    if (item.currentStock <= (item.minStock || 0)) return 'low-stock';
    return 'in-stock';
  };

  const getStockIcon = (item) => {
    if (!item) return Package;
    const status = getStockStatus(item);
    switch (status) {
      case 'out-of-stock':
        return AlertTriangle;
      case 'low-stock':
        return TrendingDown;
      default:
        return Package;
    }
  };

  const columns = [
    {
      key: 'item',
      header: 'Item',      render: (item) => {
        if (!item) return '-';
        const IconComponent = getStockIcon(item);
        const status = getStockStatus(item);
        return (
          <div className={styles.itemInfo}>
            <div className={`${styles.itemIcon} ${styles[status]}`}>
              <IconComponent size={20} />
            </div>
            <div>
              <div className={styles.itemName}>{item.name || 'Unknown Item'}</div>
              <div className={styles.itemSku}>SKU: {item.sku || 'N/A'}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'category',
      header: 'Category',      render: (item) => {
        if (!item) return '-';
        return (
          <div className={styles.categoryBadge}>
            {Object.keys(INVENTORY_CATEGORIES).find(key => INVENTORY_CATEGORIES[key] === item.category)?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
          </div>
        );
      }
    },
    {
      key: 'stock',
      header: 'Stock',      render: (item) => {
        if (!item) return '-';
        const status = getStockStatus(item);
        return (
          <div className={styles.stockInfo}>
            <div className={`${styles.currentStock} ${styles[status]}`}>
              {item.currentStock || 0} {item.unit || 'units'}
            </div>
            <div className={styles.stockLimits}>
              Min: {item.minStock || 0} | Max: {item.maxStock || 0}
            </div>
          </div>
        );
      }
    },
    {
      key: 'value',
      header: 'Unit Price',      render: (item) => {
        if (!item) return '-';
        return (
          <div className={styles.priceInfo}>
            <span className={styles.unitPrice}>{formatCurrency(item.unitPrice || 0)}</span>
            <span className={styles.totalValue}>
              Total: {formatCurrency((item.currentStock || 0) * (item.unitPrice || 0))}
            </span>
          </div>
        );
      }
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (item) => item?.supplier || '-'
    },
    {
      key: 'lastRestocked',
      header: 'Last Restocked',      render: (item) => item?.lastRestocked ? formatDate(item.lastRestocked) : 'Never'
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item?.status || 'unknown'} />
    }
  ];

  const actions = [
    {
      icon: TrendingUp,
      label: 'Adjust Stock',
      onClick: handleAdjustStock
    },
    {
      icon: Edit,
      label: 'Edit',
      onClick: handleEdit
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: (item) => handleDelete(item.id),
      className: styles.deleteAction
    }
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Item Name',
      type: 'text',
      required: true,
      placeholder: 'Enter item name'
    },
    {
      name: 'sku',
      label: 'SKU',
      type: 'text',
      required: true,
      placeholder: 'Enter SKU'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter item description'
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: Object.entries(INVENTORY_CATEGORIES).map(([key, value]) => ({
        value,
        label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      })),
      placeholder: 'Select category'
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'text',
      required: true,
      placeholder: 'e.g., pieces, kg, liters'
    },
    {
      name: 'unitPrice',
      label: 'Unit Price',
      type: 'number',
      required: true,
      placeholder: 'Enter unit price',
      step: '0.01'
    },
    {
      name: 'currentStock',
      label: 'Current Stock',
      type: 'number',
      required: true,
      placeholder: 'Enter current stock'
    },
    {
      name: 'minStock',
      label: 'Minimum Stock',
      type: 'number',
      required: true,
      placeholder: 'Enter minimum stock level'
    },
    {
      name: 'maxStock',
      label: 'Maximum Stock',
      type: 'number',
      required: true,
      placeholder: 'Enter maximum stock level'
    },
    {
      name: 'supplier',
      label: 'Supplier',
      type: 'text',
      placeholder: 'Enter supplier name'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: Object.entries(INVENTORY_STATUS).map(([key, value]) => ({
        value,
        label: key.charAt(0) + key.slice(1).toLowerCase()
      })),
      defaultValue: INVENTORY_STATUS.ACTIVE
    }
  ];

  const adjustmentFields = [
    {
      name: 'type',
      label: 'Adjustment Type',
      type: 'select',
      required: true,
      options: [
        { value: 'increase', label: 'Increase Stock' },
        { value: 'decrease', label: 'Decrease Stock' },
        { value: 'set', label: 'Set Stock Level' }
      ]
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      placeholder: 'Enter quantity'
    },
    {
      name: 'reason',
      label: 'Reason',
      type: 'select',
      required: true,
      options: [
        { value: 'purchase', label: 'Purchase/Restock' },
        { value: 'usage', label: 'Usage/Consumption' },
        { value: 'damage', label: 'Damage/Loss' },
        { value: 'correction', label: 'Inventory Correction' },
        { value: 'transfer', label: 'Transfer' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Enter additional notes'
    }
  ];

  const stats = [
    {
      label: 'Total Items',
      value: inventory.length,
      color: 'primary'
    },
    {
      label: 'Low Stock',
      value: inventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length,
      color: 'warning'
    },
    {
      label: 'Out of Stock',
      value: inventory.filter(item => item.currentStock === 0).length,
      color: 'error'
    },
    {
      label: 'Total Value',
      value: formatCurrency(inventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0)),
      color: 'success'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventory Management</h1>
        <button
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add Item
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
              placeholder="Search by name, SKU, or description..."
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
            {Object.entries(INVENTORY_CATEGORIES).map(([key, value]) => (
              <option key={value} value={value}>
                {key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Stock Status</label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
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
            <option value={INVENTORY_STATUS.ACTIVE}>Active</option>
            <option value={INVENTORY_STATUS.INACTIVE}>Inactive</option>
          </select>
        </div>
      </div>

      <div className={styles.content}>
        <DataGrid
          data={filteredInventory}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="No inventory items found"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        size="large"
      >
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
          defaultValues={editingItem}
          validationSchema={inventoryValidationSchema}
          submitText={editingItem ? 'Update Item' : 'Create Item'}
        />
      </Modal>

      <Modal
        isOpen={showAdjustmentModal}
        onClose={() => {
          setShowAdjustmentModal(false);
          setAdjustingItem(null);
        }}
        title={`Adjust Stock - ${adjustingItem?.name}`}
        size="medium"
      >
        {adjustingItem && (
          <div className={styles.adjustmentModal}>
            <div className={styles.currentStockInfo}>
              <h4>Current Stock Level</h4>
              <div className={styles.stockDisplay}>
                <Package size={24} />
                <span>{adjustingItem.currentStock} {adjustingItem.unit}</span>
              </div>
            </div>
            <Form
              fields={adjustmentFields}
              onSubmit={handleAdjustmentSubmit}
              validationSchema={stockAdjustmentValidationSchema}
              submitText="Adjust Stock"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
