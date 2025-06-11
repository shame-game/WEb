import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Home, Users, DollarSign, Bed, Star, Wifi } from 'lucide-react';
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
  }, []);  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://quanlyks.onrender.com/api/RoomType');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRoomTypes(data || []);
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
    if (window.confirm(`Bạn có chắc chắn muốn xóa loại phòng "${roomType.roomTypeName}"?`)) {
      try {
        // API call để xóa room type nếu cần
        // await fetch(`https://quanlyks.onrender.com/api/RoomType/${roomType.roomTypeId}`, { method: 'DELETE' });
        
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Chức năng xóa chưa được triển khai trên API' 
        });
        fetchRoomTypes();
      } catch (error) {
        console.error('Error deleting room type:', error);
        setResultPopup({ 
          show: true, 
          type: 'error', 
          message: 'Lỗi khi xóa loại phòng. Vui lòng thử lại.' 
        });
      }
    }
  };
  const handleSubmit = async (data) => {
    try {
      if (selectedRoomType) {
        // API call để cập nhật room type
        // await fetch(`https://quanlyks.onrender.com/api/RoomType/${selectedRoomType.roomTypeId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Chức năng cập nhật chưa được triển khai trên API' 
        });} else {
        // API call để tạo room type mới
        // await fetch('https://quanlyks.onrender.com/api/RoomType', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Chức năng tạo mới chưa được triển khai trên API' 
        });
      }
      setShowModal(false);
      fetchRoomTypes();
    } catch (error) {
      console.error('Error saving room type:', error);
      setResultPopup({ 
        show: true, 
        type: 'error', 
        message: 'Có lỗi xảy ra khi lưu thông tin loại phòng. Vui lòng thử lại.' 
      });
    }  };
  const columns = [
    {
      key: 'roomTypeInfo',
      label: 'Thông tin loại phòng',
      render: (_, roomType) => {
        if (!roomType) return '-';        const getIconForRoomType = (name) => {
          const roomTypeName = (name || '').toLowerCase();
          if (roomTypeName.includes('vip') || roomTypeName.includes('deluxe') || roomTypeName.includes('suite') || roomTypeName.includes('luxury')) {
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
              {getIconForRoomType(roomType.roomTypeName)}
            </div>
            <div>
              <div className={styles.roomTypeName}>{roomType.roomTypeName || 'N/A'}</div>
              <div className={styles.roomTypeId}>ID: {roomType.roomTypeId || 'N/A'}</div>
            </div>
          </div>
        );
      }
    },    {
      key: 'rooms',
      label: 'Số phòng',
      render: (value, roomType) => {
        if (!roomType) return '-';
        const roomCount = roomType.rooms ? roomType.rooms.length : 0;
        return (
          <div className={styles.roomCount}>
            <div className={styles.totalRooms}>Tổng: {roomCount}</div>
            <div className={styles.roomsInfo}>
              {roomType.rooms && roomType.rooms.length > 0 ? 
                `Có ${roomType.rooms.length} phòng` : 
                'Chưa có phòng nào'
              }
            </div>
          </div>
        );
      }
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
      name: 'roomTypeName',
      label: 'Tên loại phòng',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên loại phòng (VD: Phòng VIP, Phòng Standard)'
    }
  ];

  // Filter room types by search term
  const filteredRoomTypes = roomTypes.filter(roomType =>
    (roomType.roomTypeName || '').toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Tìm kiếm loại phòng theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataGrid        data={filteredRoomTypes}
        columns={columns}
        loading={loading}
        emptyMessage="Không tìm thấy loại phòng nào"
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRoomType ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
      >        <Form
          fields={formFields}
          initialData={selectedRoomType}
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