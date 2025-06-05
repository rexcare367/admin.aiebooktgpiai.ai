import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const { user, loading } = useAuth('admin');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.attributes?.email === process.env.REACT_APP_ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};