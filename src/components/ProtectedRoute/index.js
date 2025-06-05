import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdminAuth } from '../../context/AdminAuthContext';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const location = useLocation();

  if (loading || adminLoading) {
    return (
      <SoftBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <SoftTypography variant="h6">Loading...</SoftTypography>
      </SoftBox>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in/basic" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboards/default" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool
};