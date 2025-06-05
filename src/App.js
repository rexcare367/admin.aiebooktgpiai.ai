import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Components
import SoftBox from "components/SoftBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import { ProtectedRoute } from './components/ProtectedRoute'; 
import { AuthProvider } from './components/AuthProvider';

// Theme
import theme from "assets/theme";

// Routes and Context
import routes from "routes";
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brand from "assets/images/logo-ct.png";

// Hooks
import { useAuth } from "hooks/useAuth";
import { useAdminAuth } from './context/AdminAuthContext';

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdminAuth();

  // Cache for the rtl
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        // Debug log
        console.log('Creating route:', route.route);
        
        return (
          <Route
            key={route.key}
            path={route.route}
            element={
              route.protected && route.adminOnly ? (
                <ProtectedRoute requireAdmin={true}>
                  {route.component}
                </ProtectedRoute>
              ) : route.route.startsWith('/authentication/') ? (
                route.component
              ) : (
                <ProtectedRoute requireAdmin={false}>
                  {route.component}
                </ProtectedRoute>
              )
            }
          />
        );
      }

      return null;
    }).filter(Boolean);

  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

  // Filter routes for Sidenav based on auth status and admin status
  const filteredRoutes = useMemo(() => {
    if (!isAuthenticated) {
      return routes.filter(route => 
        route.type === 'collapse' && route.key === 'authentication'
      );
    }
    
    if (!isAdmin) {
      return routes.filter(route => 
        !route.adminOnly && route.type !== 'authentication'
      );
    }
    
    return routes;
  }, [isAuthenticated, isAdmin]);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {layout === "dashboard" && isAuthenticated && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="AI EBOOK DASHBOARD"
              routes={filteredRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            {isAdmin && <Configurator />}
            {isAdmin && configsButton}
          </>
        )}
        <Routes>
          {getRoutes(routes)}
          <Route path="/rewards/rewards/edit-reward/:rewardId" element={<ProtectedRoute>{routes.find(r => r.key === 'rewards')?.collapse?.find(r => r.key === 'rewards')?.collapse?.find(r => r.key === 'edit-reward')?.component}</ProtectedRoute>} />
          <Route path="/rewards/rewards/reward-page/:rewardId" element={<ProtectedRoute>{routes.find(r => r.key === 'rewards')?.collapse?.find(r => r.key === 'rewards')?.collapse?.find(r => r.key === 'reward-page')?.component}</ProtectedRoute>} />
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboards/default" />
              ) : (
                <Navigate to="/authentication/sign-in/basic" />
              )
            }
          />
        </Routes>
      </ThemeProvider>
  );
}