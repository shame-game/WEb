import { useAuth } from '../context/AuthContext';
import { hasPermission, hasAnyPermission, hasAllPermissions, getUserPermissions } from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.roleName;

  return {
    hasPermission: (permission) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(userRole, permissions),
    getUserPermissions: () => getUserPermissions(userRole),
    userRole
  };
};
