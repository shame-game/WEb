import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, Bed, DollarSign, TrendingUp, Clock, Star, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../../services';
import { StatusBadge } from '../../components/UI';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
    pendingPayments: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await dashboardService.getStats();
      setStats(statsResponse.data);

      // Fetch revenue data for last 12 months
      const revenueResponse = await dashboardService.getRevenueData();
      setRevenueData(revenueResponse.data);

      // Fetch occupancy data for last 30 days
      const occupancyResponse = await dashboardService.getOccupancyData();
      setOccupancyData(occupancyResponse.data);

      // Fetch room type distribution
      const roomTypeResponse = await dashboardService.getRoomTypeData();
      setRoomTypeData(roomTypeResponse.data);

      // Fetch recent bookings
      const bookingsResponse = await dashboardService.getRecentBookings();
      setRecentBookings(bookingsResponse.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon} style={{ backgroundColor: `${color}20`, color }}>
          <Icon size={24} />
        </div>
        <div className={styles.statTrend}>
          {trend && (
            <>
              <TrendingUp size={16} className={trend > 0 ? styles.trendUp : styles.trendDown} />
              <span className={trend > 0 ? styles.trendUp : styles.trendDown}>
                {Math.abs(trend)}%
              </span>
            </>
          )}
        </div>
      </div>
      <div className={styles.statContent}>
        <h3 className={styles.statValue}>{value}</h3>
        <p className={styles.statTitle}>{title}</p>
        {subtitle && <p className={styles.statSubtitle}>{subtitle}</p>}
      </div>
    </div>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening at your hotel today.</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={Bed}
          color="#0088FE"
          subtitle={`${stats.availableRooms} available`}
          trend={2.5}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          color="#00C49F"
          subtitle="This month"
          trend={15.3}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue?.toLocaleString()}`}
          icon={DollarSign}
          color="#FFBB28"
          subtitle="Current month"
          trend={8.7}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={Users}
          color="#FF8042"
          subtitle="Current"
          trend={-2.1}
        />
      </div>

      {/* Daily Operations */}
      <div className={styles.operationsGrid}>
        <div className={styles.operationCard}>
          <div className={styles.operationHeader}>
            <Clock size={20} />
            <h3>Today's Operations</h3>
          </div>
          <div className={styles.operationStats}>
            <div className={styles.operationItem}>
              <span className={styles.operationLabel}>Check-ins</span>
              <span className={styles.operationValue}>{stats.checkInsToday}</span>
            </div>
            <div className={styles.operationItem}>
              <span className={styles.operationLabel}>Check-outs</span>
              <span className={styles.operationValue}>{stats.checkOutsToday}</span>
            </div>
            <div className={styles.operationItem}>
              <span className={styles.operationLabel}>Pending Payments</span>
              <span className={styles.operationValue}>{stats.pendingPayments}</span>
            </div>
          </div>
        </div>

        <div className={styles.operationCard}>
          <div className={styles.operationHeader}>
            <AlertTriangle size={20} />
            <h3>Quick Actions</h3>
          </div>          <div className={styles.quickActions}>
            <button className={styles.actionButton}>Đặt phòng mới</button>
            <button className={styles.actionButton}>Check-in khách</button>
            <button className={styles.actionButton}>Bảo trì phòng</button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <h3>Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0088FE"
                fill="#0088FE"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Chart */}
        <div className={styles.chartCard}>
          <h3>Occupancy Rate (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Occupancy Rate']} />
              <Line
                type="monotone"
                dataKey="occupancyRate"
                stroke="#00C49F"
                strokeWidth={2}
                dot={{ fill: '#00C49F' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Room Type Distribution */}
        <div className={styles.chartCard}>
          <h3>Room Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roomTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {roomTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Bookings */}
        <div className={styles.chartCard}>
          <h3>Recent Bookings</h3>
          <div className={styles.recentBookings}>
            {recentBookings.map((booking) => (
              <div key={booking.id} className={styles.bookingItem}>
                <div className={styles.bookingInfo}>
                  <span className={styles.guestName}>{booking.guestName}</span>
                  <span className={styles.roomNumber}>Room {booking.roomNumber}</span>
                </div>
                <div className={styles.bookingDetails}>
                  <span className={styles.bookingDate}>
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </span>
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;