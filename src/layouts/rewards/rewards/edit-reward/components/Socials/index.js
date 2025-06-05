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
import Grid from "@mui/material/Grid";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// EditReward page components
import FormField from "layouts/rewards/rewards/edit-reward/components/FormField";

function Socials() {
  return (
    <Card>
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="bold">
          Socials
        </SoftTypography>
        <SoftBox mt={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormField type="text" label="shopify handle" defaultValue="@soft" />
            </Grid>
            <Grid item xs={12}>
              <FormField type="text" label="facebook account" defaultValue="https://..." />
            </Grid>
            <Grid item xs={12}>
              <FormField type="text" label="instagram account" defaultValue="https://..." />
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default Socials;
