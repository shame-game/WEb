import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Bed, MapPin, Settings, Filter } from 'lucide-react';
import { roomService, roomTypeService } from '../../services';
import { roomValidationSchema } from '../../utils/validationSchemas';
import { ROOM_STATUSES } from '../../constants';
import DataGrid from '../../components/UI/DataGrid';
import Modal from '../../components/UI/Modal';
import Form from '../../components/UI/Form';
import StatusBadge from '../../components/UI/StatusBadge';
import ResultPopup from '../../components/UI/ResultPopup';
import styles from './Rooms.module.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [resultPopup, setResultPopup] = useState({ show: false, type: '', message: '' });

  const itemsPerPage = 12;

  useEffect(() => {
    fetchRoomTypes();
    fetchRooms();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);  const fetchRoomTypes = async () => {
    try {
      const response = await roomTypeService.getAll();
      setRoomTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
      setRoomTypes([]);
    }
  };const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
        roomTypeId: typeFilter
      };
      const response = await roomService.getAll(params);
      setRooms(response.data || []);
      setTotalItems(response.data?.length || 0);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRoom(null);
    setShowModal(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };  const handleDelete = async (room) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phòng "${room.roomNumber}"?`)) {
      try {
        await roomService.delete(room.id);
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Xóa phòng thành công!' 
        });
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        
        // Handle specific errors
        let errorMessage = 'Lỗi khi xóa phòng. Vui lòng thử lại.';
        if (error.message === 'Cannot delete room with active bookings') {
          errorMessage = 'Không thể xóa phòng đang có đặt phòng hoạt động. Vui lòng hủy đặt phòng trước.';
        }
        
        setResultPopup({ 
          show: true, 
          type: 'error', 
          message: errorMessage 
        });
      }
    }
  };const handleSubmit = async (data) => {
    try {
      if (selectedRoom) {
        await roomService.update(selectedRoom.id, data);
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Cập nhật thông tin phòng thành công!' 
        });
      } else {
        await roomService.create(data);
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Thêm phòng mới thành công!' 
        });
      }
      setShowModal(false);
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      
      // Handle specific validation errors
      let errorMessage = 'Có lỗi xảy ra khi lưu thông tin phòng. Vui lòng thử lại.';
      if (error.message === 'Room number already exists') {
        errorMessage = 'Số phòng đã tồn tại. Vui lòng chọn số phòng khác.';
      } else if (error.message === 'Room type not found') {
        errorMessage = 'Loại phòng không tồn tại. Vui lòng chọn loại phòng hợp lệ.';
      }
      
      setResultPopup({ 
        show: true, 
        type: 'error', 
        message: errorMessage 
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: '#10B981',
      occupied: '#F59E0B',
      maintenance: '#EF4444',
      cleaning: '#3B82F6',
      'out-of-order': '#6B7280'
    };
    return colors[status] || '#6B7280';
  };
  const columns = [
    {
      key: 'roomInfo',
      label: 'Chi tiết phòng',
      render: (_, room) => {
        if (!room) return '-';
        return (
          <div className={styles.roomInfo}>
            <div className={styles.roomIcon} style={{ backgroundColor: `${getStatusColor(room.status)}20` }}>
              <Bed size={20} style={{ color: getStatusColor(room.status) }} />
            </div>
            <div>
              <div className={styles.roomNumber}>Phòng {room.roomNumber || 'N/A'}</div>
              <div className={styles.roomFloor}>Tầng {room.floor || 'N/A'}</div>
            </div>
          </div>
        );
      }
    },    {
      key: 'roomTypeName',
      label: 'Loại phòng',
      render: (value, room) => {
        if (!room) return '-';
        
        // Find room type details for additional info
        const roomType = roomTypes.find(rt => rt.id === room.roomTypeId);
        
        return (
          <div className={styles.roomType}>
            <div className={styles.roomTypeName}>{value || room.roomType?.name || 'N/A'}</div>
            {roomType && (
              <div className={styles.roomTypeDetails}>
                <span className={styles.basePrice}>{roomType.basePrice?.toLocaleString('vi-VN')}đ</span>
                <span className={styles.maxOccupancy}>Tối đa {roomType.maxOccupancy} người</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value, room) => {
        if (!room || !value) return '-';
        return (
          <StatusBadge status={value} />
        );
      }
    },    {
      key: 'description',
      label: 'Mô tả',
      render: (value) => (
        <div className={styles.description}>
          {value || '-'}
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Trạng thái hoạt động',
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_, room) => (
        <div className={styles.actions}>          <button
            onClick={() => handleEdit(room)}
            className={styles.editButton}
            title="Sửa"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(room)}
            className={styles.deleteButton}
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
          <button
            className={styles.maintenanceButton}
            title="Bảo trì"
          >
            <Settings size={16} />
          </button>
        </div>
      )
    }
  ];  const formFields = [
    {
      name: 'roomNumber',
      label: 'Số phòng',
      type: 'text',
      required: true,
      placeholder: 'Nhập số phòng (VD: 101, A201)'
    },
    {
      name: 'floor',
      label: 'Tầng',
      type: 'number',
      required: true,
      placeholder: 'Nhập số tầng',
      min: 1,
      max: 50
    },
    {
      name: 'roomTypeId',
      label: 'Loại phòng',
      type: 'select',
      required: true,
      options: roomTypes.map(type => ({
        value: type.id,
        label: `${type.name} - ${type.basePrice?.toLocaleString('vi-VN')}đ/đêm`
      })),
      placeholder: 'Chọn loại phòng'
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      options: ROOM_STATUSES.map(status => ({
        value: status.value,
        label: status.label
      })),
      defaultValue: 'available'
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      placeholder: 'Nhập mô tả phòng (tùy chọn)',
      maxLength: 500
    },
    {
      name: 'isActive',
      label: 'Trạng thái hoạt động',
      type: 'checkbox',
      defaultValue: true
    }
  ];

  return (
    <div className={styles.rooms}>      <div className={styles.header}>
        <div>
          <h1>Quản lý phòng</h1>
          <p>Quản lý các phòng khách sạn và tình trạng sẵn có</p>
        </div>
        <button onClick={handleCreate} className={styles.createButton}>
          <Plus size={20} />
          Thêm phòng
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={20} />          <input
            type="text"
            placeholder="Tìm kiếm phòng theo số hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả trạng thái</option>
            {ROOM_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả loại phòng</option>
            {roomTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataGrid
        data={rooms}
        columns={columns}
        loading={loading}
        pagination={{
          currentPage,
          totalItems,
          itemsPerPage,
          onPageChange: setCurrentPage
        }}
      />      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
      >
        <Form
          fields={formFields}
          initialData={selectedRoom}
          validationSchema={roomValidationSchema}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitText={selectedRoom ? 'Cập nhật' : 'Thêm mới'}
          cancelText="Hủy"
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

export default Rooms;