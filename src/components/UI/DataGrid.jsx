import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import styles from './DataGrid.module.css';

const DataGrid = ({
  title,
  data = [],
  columns = [],
  actions = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchable = true,
  sortable = true,
  pageSize = 10,
  emptyMessage = 'No data available'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
      return data.filter(item =>
      columns.some(column => {
        const value = item[column.key];
        return value && value.toString && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, currentPageSize]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / currentPageSize);
  const startRecord = (currentPage - 1) * currentPageSize + 1;
  const endRecord = Math.min(currentPage * currentPageSize, sortedData.length);

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (loading) {
    return (
      <div className={styles.dataGrid}>
        <div className={styles.loading}>Đang tải...</div>
      </div>
    );
  }
  return (
    <div className={styles.dataGrid}>      {/* Table */}
      <div className={styles.tableContainer}>        {sortedData.length === 0 ? (
          <div className={styles.empty}>
            {searchTerm ? 'No matching results found' : emptyMessage}
          </div>
        ) : (
          <table className={styles.table}>            <thead className={styles.tableHeader}>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} style={{ width: column.width }}>
                    {sortable && column.sortable !== false ? (
                      <div
                        className={styles.sortableHeader}
                        onClick={() => handleSort(column.key)}
                      >
                        {column.header}
                        {getSortIcon(column.key)}
                      </div>
                    ) : (
                      column.header
                    )}                  </th>
                ))}
                {actions.length > 0 && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {sortedData.map((item, index) => (
                <tr key={item.id || item.roleId || item.roomTypeId || item.customerId || item.roomId || index}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}                  {actions.length > 0 && (
                    <td>
                      <div className={styles.actions}>
                        {actions
                          .filter(action => !action.condition || action.condition(item))
                          .map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className={`${styles.actionButton} ${action.className || ''}`}
                            onClick={() => action.onClick(item)}
                            title={action.label}
                            disabled={action.disabled && action.disabled(item)}
                          >
                            <action.icon size={16} />
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>{/* Pagination */}
      {loading && (
        <div className={styles.loading}>Loading...</div>
      )}
    </div>
  );
};

export default DataGrid;
