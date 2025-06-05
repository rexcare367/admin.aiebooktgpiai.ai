import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftSnackbar from "components/SoftSnackbar";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Sidenav from "examples/Sidenav";

// AI EBOOK DASHBOARD React context
import { useSoftUIController, setMiniSidenav, setLayout, setTransparentSidenav } from "context";

// Routes
import routes from "routes";

// Images
import brand from "assets/images/logo-ct.png";

// NewReward page components
// import Header from "layouts/rewards/rewards/new-reward/components/Header";
import ProductInfo from "layouts/rewards/rewards/new-reward/components/ProductInfo";

// Mock functions for testing
const mockCreateReward = async (data) => {
  console.log('Mock creating reward:', data);
  return { success: true, rewardId: 'mock-id' };
};

function NewReward() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("info");
  const [showAlert, setShowAlert] = useState(false);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleSubmitSuccess = () => {
    setAlertColor("success");
    setAlertMessage("Reward created successfully!");
    setShowAlert(true);
    
    setTimeout(() => {
      navigate("/rewards/rewards/reward-list");
    }, 2000);
  };

  const handleSubmitError = (error) => {
    setAlertColor("error");
    setAlertMessage(error.message || "Failed to create reward");
    setShowAlert(true);
  };

  // Set the layout to dashboard
  useEffect(() => {
    setLayout(dispatch, "dashboard");
    setTransparentSidenav(dispatch, false);
  }, [pathname]);

  return (
    <SoftBox sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidenav
        color={sidenavColor}
        brand={brand}
        brandName="AI EBOOK DASHBOARD"
        routes={routes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      <SoftBox sx={{ flex: 1 }}>
        <DashboardLayout>
          <DashboardNavbar />
          {/* <Header /> */}
          <SoftBox mt={1} mb={20}>
            <Grid container justifyContent="center">
              <Grid item xs={12} lg={8}>
                <ProductInfo 
                  onSubmitSuccess={handleSubmitSuccess}
                  onSubmitError={handleSubmitError}
                  onSubmitManual={mockCreateReward}
                />
              </Grid>
            </Grid>
          </SoftBox>
          <Footer />

          <SoftSnackbar
            color={alertColor}
            icon={alertColor === "success" ? "check" : "warning"}
            title="Reward System"
            content={alertMessage}
            open={showAlert}
            onClose={() => setShowAlert(false)}
            close={() => setShowAlert(false)}
          />
        </DashboardLayout>
      </SoftBox>
    </SoftBox>
  );
}

export default NewReward;