import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Home, Users, DollarSign, Bed, Star, Wifi } from 'lucide-react';
import { roomTypeService } from '../../services';
import { roomTypeValidationSchema } from '../../utils/validationSchemas';
import DataGrid from '../../components/UI/DataGrid';
import Modal from '../../components/UI/Modal';
import Form from '../../components/UI/Form';
import StatusBadge from '../../components/UI/StatusBadge';
import ResultPopup from '../../components/UI/ResultPopup';
import styles from './RoomTypes.module.css';

const RoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [resultPopup, setResultPopup] = useState({ show: false, type: '', message: '' });
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchRoomTypes();
  }, []);
  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await roomTypeService.getAll();
      setRoomTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRoomType(null);
    setShowModal(true);
  };

  const handleEdit = (roomType) => {
    setSelectedRoomType(roomType);
    setShowModal(true);
  };

  const handleDelete = async (roomType) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa loại phòng "${roomType.name}"?`)) {
      try {
        await roomTypeService.delete(roomType.id);
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Xóa loại phòng thành công!' 
        });
        fetchRoomTypes();
      } catch (error) {
        console.error('Error deleting room type:', error);
        
        let errorMessage = 'Lỗi khi xóa loại phòng. Vui lòng thử lại.';
        if (error.message === 'Cannot delete room type with existing rooms') {
          errorMessage = 'Không thể xóa loại phòng đang có phòng. Vui lòng xóa tất cả phòng thuộc loại này trước.';
        }
        
        setResultPopup({ 
          show: true, 
          type: 'error', 
          message: errorMessage 
        });
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedRoomType) {
        await roomTypeService.update(selectedRoomType.id, data);
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Cập nhật loại phòng thành công!' 
        });
      } else {
        await roomTypeService.create(data);
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Thêm loại phòng mới thành công!' 
        });
      }
      setShowModal(false);
      fetchRoomTypes();
    } catch (error) {
      console.error('Error saving room type:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi lưu thông tin loại phòng. Vui lòng thử lại.';
      if (error.message === 'Room type name already exists') {
        errorMessage = 'Tên loại phòng đã tồn tại. Vui lòng chọn tên khác.';
      }
      
      setResultPopup({ 
        show: true, 
        type: 'error', 
        message: errorMessage 
      });
    }  };
  const columns = [
    {
      key: 'roomTypeInfo',
      label: 'Thông tin loại phòng',
      render: (_, roomType) => {
        if (!roomType) return '-';
        const getIconForRoomType = (name) => {
          const roomTypeName = (name || '').toLowerCase();
          if (roomTypeName.includes('deluxe') || roomTypeName.includes('suite') || roomTypeName.includes('luxury')) {
            return <Star size={20} />;
          }
          if (roomTypeName.includes('standard') || roomTypeName.includes('classic')) {
            return <Bed size={20} />;
          }
          if (roomTypeName.includes('family') || roomTypeName.includes('twin')) {
            return <Users size={20} />;
          }
          if (roomTypeName.includes('business') || roomTypeName.includes('executive')) {
            return <Wifi size={20} />;
          }
          return <Home size={20} />; // Icon mặc định
        };

        return (
          <div className={styles.roomTypeInfo}>
            <div className={styles.roomTypeIcon}>
              {getIconForRoomType(roomType.name)}
            </div>
            <div>
              <div className={styles.roomTypeName}>{roomType.name || 'N/A'}</div>
              <div className={styles.roomTypeDescription}>{roomType.description || 'Không có mô tả'}</div>
            </div>
          </div>
        );
      }
    },    {
      key: 'basePrice',
      label: 'Giá cơ bản',
      render: (value, roomType) => {
        if (!roomType || !value) return '-';
        return (
          <div className={styles.priceInfo}>
            <div className={styles.priceWithIcon}>
              <DollarSign size={16} className={styles.priceIcon} />
              <span className={styles.price}>{value.toLocaleString('vi-VN')}đ</span>
            </div>
            <span className={styles.priceUnit}>/đêm</span>
          </div>
        );
      }
    },
    {
      key: 'maxOccupancy',
      label: 'Sức chứa',
      render: (value) => {
        if (!value) return '-';
        return (
          <div className={styles.occupancyInfo}>
            <Users size={16} />
            <span>{value} người</span>
          </div>
        );
      }
    },
    {
      key: 'roomCount',
      label: 'Số phòng',
      render: (value, roomType) => {
        if (!roomType) return '-';
        return (
          <div className={styles.roomCount}>
            <div className={styles.totalRooms}>Tổng: {value || 0}</div>
            <div className={styles.availableRooms}>Sẵn có: {roomType.availableRooms || 0}</div>
          </div>
        );
      }
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_, roomType) => (
        <div className={styles.actions}>
          <button
            onClick={() => handleEdit(roomType)}
            className={styles.editButton}
            title="Sửa"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(roomType)}
            className={styles.deleteButton}
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Tên loại phòng',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên loại phòng (VD: Standard Room, Deluxe Room)'
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      required: true,
      placeholder: 'Nhập mô tả chi tiết về loại phòng',
      maxLength: 500
    },
    {
      name: 'basePrice',
      label: 'Giá cơ bản (VNĐ)',
      type: 'number',
      required: true,
      placeholder: 'Nhập giá cơ bản',
      min: 0,
      step: 1000
    },
    {
      name: 'maxOccupancy',
      label: 'Sức chứa tối đa',
      type: 'number',
      required: true,
      placeholder: 'Số người tối đa',
      min: 1,
      max: 10
    },
    {
      name: 'amenities',
      label: 'Tiện nghi',
      type: 'textarea',
      placeholder: 'Nhập các tiện nghi (cách nhau bằng dấu phẩy)',
      helperText: 'VD: Wi-Fi miễn phí, Điều hòa, Smart TV'
    },
    {
      name: 'isActive',
      label: 'Trạng thái hoạt động',
      type: 'checkbox',
      defaultValue: true
    }
  ];
  // Filter room types by search term
  const filteredRoomTypes = roomTypes.filter(roomType =>
    (roomType.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (roomType.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.roomTypes}>
      <div className={styles.header}>
        <div>
          <h1>Quản lý loại phòng</h1>
          <p>Quản lý các loại phòng và thông tin chi tiết</p>
        </div>
        <button onClick={handleCreate} className={styles.createButton}>
          <Plus size={20} />
          Thêm loại phòng
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm loại phòng theo tên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataGrid
        data={filteredRoomTypes}
        columns={columns}
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRoomType ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
      >
        <Form
          fields={formFields}
          initialData={selectedRoomType}
          validationSchema={roomTypeValidationSchema}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      <ResultPopup
        show={resultPopup.show}
        type={resultPopup.type}
        title={resultPopup.type === 'success' ? 'Thành công' : 'Lỗi'}
        message={resultPopup.message}
        onClose={() => setResultPopup({ show: false, type: '', message: '' })}
      />
    </div>
  );
};

export default RoomTypes;