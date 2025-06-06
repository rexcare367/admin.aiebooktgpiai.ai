/**
=========================================================
* AI EBOOK DASHBOARD React - v4.0.3
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// OrderDetails page components
import Header from "layouts/rewards/orders/order-details/components/Header";
import OrderInfo from "layouts/rewards/orders/order-details/components/OrderInfo";
import TrackOrder from "layouts/rewards/orders/order-details/components/TrackOrder";
import PaymentDetails from "layouts/rewards/orders/order-details/components/PaymentDetails";
import BillingInformation from "layouts/rewards/orders/order-details/components/BillingInformation";
import OrderSummary from "layouts/rewards/orders/order-details/components/OrderSummary";

function OrderDetails() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={7}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <SoftBox pt={2} px={2}>
                <Header />
              </SoftBox>
              <Divider />
              <SoftBox pt={1} pb={3} px={2}>
                <SoftBox mb={3}>
                  <OrderInfo />
                </SoftBox>
                <Divider />
                <SoftBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                      <TrackOrder />
                    </Grid>
                    <Grid item xs={12} md={6} lg={5}>
                      <PaymentDetails />
                      <SoftBox mt={3}>
                        <BillingInformation />
                      </SoftBox>
                    </Grid>
                    <Grid item xs={12} lg={3} sx={{ ml: "auto" }}>
                      <OrderSummary />
                    </Grid>
                  </Grid>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default OrderDetails;
