import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import { 
  Home, 
  Users, 
  Shield, 
  UserCheck, 
  Building, 
  Bed, 
  Coffee, 
  Calendar, 
  FileText, 
  Package, 
  BarChart3, 
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarCollapsed(false); // Always show sidebar on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);  const navigationItems = [
    { path: '/', icon: Home, label: 'Dashboard', permission: PERMISSIONS.DASHBOARD_VIEW },
    { path: '/accounts', icon: Users, label: 'Tài khoản', permission: PERMISSIONS.USER_MANAGEMENT },
    { path: '/roles', icon: Shield, label: 'Vai trò', permission: PERMISSIONS.ROLE_MANAGEMENT },
    { path: '/room-types', icon: Building, label: 'Loại phòng', permission: PERMISSIONS.ROOM_TYPE_MANAGEMENT },
    { path: '/rooms', icon: Bed, label: 'Phòng', permission: PERMISSIONS.ROOM_READ },
    { path: '/services', icon: Coffee, label: 'Dịch vụ', permission: PERMISSIONS.SERVICE_READ },
    { path: '/bookings', icon: Calendar, label: 'Đặt phòng', permission: PERMISSIONS.BOOKING_READ },
    { path: '/invoices', icon: FileText, label: 'Hóa đơn', permission: PERMISSIONS.INVOICE_READ },
    { path: '/inventory', icon: Package, label: 'Kho', permission: PERMISSIONS.INVENTORY_READ }
  ];
  // Filter navigation items based on user permissions
  const filteredNavigationItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarCollapsed(!sidebarCollapsed);
    }
    // Do nothing on desktop - sidebar stays visible
  };
  const getPageTitle = () => {
    const currentItem = filteredNavigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Hotel Management';
  };

  return (
    <div className={styles.layout}>      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className={`${styles.overlay} ${!sidebarCollapsed ? styles.visible : ''}`}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobile && sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          Hotel Manager
        </div>
          <nav>
          <ul className={styles.nav}>
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className={styles.navItem}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                    onClick={() => isMobile && setSidebarCollapsed(true)}
                  >
                    <Icon className={styles.navIcon} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>          <div className={styles.headerLeft}>
            {isMobile && (
              <button 
                className={styles.menuButton}
                onClick={toggleSidebar}
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
            )}
            <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <User size={16} />
              <span>{user?.displayName || 'User'}</span>
            </div>
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
