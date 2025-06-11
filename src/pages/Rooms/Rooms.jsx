import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Bed, MapPin, Settings, Filter } from 'lucide-react';
import DataGrid from '../../components/UI/DataGrid';
import Modal from '../../components/UI/Modal';
import Form from '../../components/UI/Form';
import StatusBadge from '../../components/UI/StatusBadge';
import ResultPopup from '../../components/UI/ResultPopup';
import styles from './Rooms.module.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchRooms();
  }, []);  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://quanlyks.onrender.com/api/Room');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRooms(data || []);
      setTotalItems(data.length || 0);
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
        // Remove room from local state
        setRooms(prevRooms => 
          prevRooms.filter(r => r.roomId !== room.roomId)
        );
        setTotalItems(prevTotal => prevTotal - 1);
        
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: `Xóa phòng ${room.roomNumber} thành công!` 
        });
      } catch (error) {
        console.error('Error deleting room:', error);
        setResultPopup({ 
          show: true, 
          type: 'error', 
          message: 'Lỗi khi xóa phòng. Vui lòng thử lại.' 
        });
      }
    }
  };const handleSubmit = async (data) => {
    try {
      if (selectedRoom) {
        // Update existing room locally
        const updatedRoom = {
          ...selectedRoom,
          ...data,
          price: parseFloat(data.price)
        };
        
        setRooms(prevRooms => 
          prevRooms.map(room => 
            room.roomId === selectedRoom.roomId ? updatedRoom : room
          )
        );
        
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: `Cập nhật phòng ${data.roomNumber} thành công!` 
        });
      } else {
        // Add new room locally
        const newRoom = {
          roomId: Date.now(), // Temporary ID
          ...data,
          price: parseFloat(data.price)
        };
        
        setRooms(prevRooms => [...prevRooms, newRoom]);
        setTotalItems(prevTotal => prevTotal + 1);
        
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: `Thêm phòng ${data.roomNumber} thành công!` 
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving room:', error);
      setResultPopup({ 
        show: true, 
        type: 'error', 
        message: 'Có lỗi xảy ra khi lưu thông tin phòng. Vui lòng thử lại.' 
      });
    }
  };
  const getStatusColor = (status) => {
    const colors = {
      'Available': '#10B981',
      'Occupied': '#F59E0B',
      'Maintenance': '#EF4444',
      'Cleaning': '#3B82F6',
      'Out of Order': '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Occupied': return 'warning';
      case 'Maintenance': return 'danger';
      case 'Cleaning': return 'info';
      case 'Out of Order': return 'secondary';
      default: return 'secondary';
    }
  };  const columns = [
    {
      key: 'roomInfo',
      label: 'Chi tiết phòng',
      render: (room) => {
        if (!room) return '-';
        return (
          <div className={styles.roomInfo}>
            <div className={styles.roomIcon} style={{ backgroundColor: `${getStatusColor(room.status)}20` }}>
              <Bed size={20} style={{ color: getStatusColor(room.status) }} />
            </div>
            <div>
              <div className={styles.roomNumber}>Phòng {room.roomNumber || 'N/A'}</div>
              <div className={styles.roomId}>ID: {room.roomId || 'N/A'}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'roomType',
      label: 'Loại phòng',
      render: (room) => {
        if (!room) return '-';
        return (
          <div className={styles.roomType}>
            <div className={styles.roomTypeName}>{room.roomType || 'N/A'}</div>
          </div>
        );
      }
    },
    {
      key: 'price',
      label: 'Giá phòng',
      render: (room) => {
        if (!room || !room.price) return '-';
        return (
          <div className={styles.priceInfo}>
            <span className={styles.price}>{room.price.toLocaleString('vi-VN')} VNĐ</span>
            <span className={styles.priceUnit}>/ đêm</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (room) => {
        if (!room || !room.status) return '-';
        return (
          <StatusBadge 
            status={room.status} 
            variant={getStatusVariant(room.status)}
          />
        );
      }    }
  ];

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
    },    {
      icon: Settings,
      label: 'Bảo trì',
      onClick: (room) => {
        if (window.confirm(`Chuyển phòng ${room.roomNumber} sang trạng thái bảo trì?`)) {
          const updatedRoom = {
            ...room,
            status: 'Maintenance'
          };
          
          setRooms(prevRooms => 
            prevRooms.map(r => 
              r.roomId === room.roomId ? updatedRoom : r
            )
          );
          
          setResultPopup({ 
            show: true, 
            type: 'success', 
            message: `Phòng ${room.roomNumber} đã được chuyển sang trạng thái bảo trì!` 
          });
        }
      },
      className: styles.maintenanceAction
    }
  ];

  const formFields = [
    {
      name: 'roomNumber',
      label: 'Số phòng',
      type: 'text',
      required: true,
      placeholder: 'Nhập số phòng (VD: A101, 201)'
    },
    {
      name: 'roomType',
      label: 'Loại phòng',
      type: 'text',
      required: true,
      placeholder: 'Nhập loại phòng (VD: Phòng đơn, Phòng đôi)'
    },
    {
      name: 'price',
      label: 'Giá phòng (VNĐ)',
      type: 'number',
      required: true,
      placeholder: 'Nhập giá phòng',
      min: 0
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      options: [
        { value: 'Available', label: 'Có sẵn' },
        { value: 'Occupied', label: 'Đã đặt' },
        { value: 'Maintenance', label: 'Bảo trì' },
        { value: 'Cleaning', label: 'Đang dọn dẹp' },
        { value: 'Out of Order', label: 'Hỏng hóc' }
      ],
      defaultValue: 'Available'
    }
  ];

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = !searchTerm || 
      room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || room.status === statusFilter;
    const matchesType = !typeFilter || room.roomType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get unique room types for filter
  const roomTypes = [...new Set(rooms.map(room => room.roomType))].filter(Boolean);

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
            <option value="Available">Có sẵn</option>
            <option value="Occupied">Đã đặt</option>
            <option value="Maintenance">Bảo trì</option>
            <option value="Cleaning">Đang dọn dẹp</option>
            <option value="Out of Order">Hỏng hóc</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả loại phòng</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>      <DataGrid
        data={filteredRooms}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="Không tìm thấy phòng nào"
        pagination={{
          currentPage,
          totalItems: filteredRooms.length,
          itemsPerPage,
          onPageChange: setCurrentPage
        }}
      /><Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
      >        <Form
          fields={formFields}
          initialData={selectedRoom}
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