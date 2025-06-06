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
import Card from "@mui/material/Card";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// AI EBOOK DASHBOARD React example components
import DefaultItem from "examples/Items/DefaultItem";

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox pt={2} px={2}>
        <SoftTypography variant="h6" fontWeight="bold">
          الأحداث القادمة
        </SoftTypography>
        <SoftTypography variant="button" color="text" fontWeight="bold">
          انضم
        </SoftTypography>
      </SoftBox>
      <SoftBox p={2}>
        <DefaultItem icon="paid" title="أسبوع الإنترنت" description="01 يونيو 2021, ي 12:30 PM" />
        <SoftBox mt={3.5}>
          <DefaultItem
            color="primary"
            icon="notifications"
            title="لقاء مع ماري"
            description="24 مايو 2021, ي 10:00 PM"
          />
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default OrdersOverview;
