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
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Analytics application components
import PagesHeaderCell from "layouts/applications/analytics/components/PagesHeaderCell";
import PagesBodyCell from "layouts/applications/analytics/components/PagesBodyCell";

function Pages() {
  return (
    <Card>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <SoftTypography variant="h6">Pages</SoftTypography>
        <Tooltip title="Data is based from sessions and is 100% accurate" placement="left">
          <SoftButton variant="outlined" color="success" size="small" circular iconOnly>
            <Icon sx={{ fontWeight: "bold" }}>done</Icon>
          </SoftButton>
        </Tooltip>
      </SoftBox>
      <SoftBox py={1} px={2}>
        <TableContainer sx={{ boxShadow: "none" }}>
          <Table>
            <SoftBox component="thead">
              <TableRow>
                <PagesHeaderCell>page</PagesHeaderCell>
                <PagesHeaderCell>pages view</PagesHeaderCell>
                <PagesHeaderCell>avg. time</PagesHeaderCell>
                <PagesHeaderCell>bounce rate</PagesHeaderCell>
              </TableRow>
            </SoftBox>
            <TableBody>
              <PagesBodyCell rows={["1. /ebook", 345, "00:17:07", "40.91%"]} />
              <PagesBodyCell rows={["2. /pages/Library dashboard", 520, "00:23:13", "31.14%"]} />
              <PagesBodyCell rows={["3. /pages/AI dashboard", 122, "00:3:10", "54.10%"]} />
              <PagesBodyCell rows={["4. /eBook interface", "1,900", "00:30:42", "20.93%"]} />
              <PagesBodyCell rows={["5. /full page", "1,442", "00:31:50", "34.98%"]} />
            </TableBody>
          </Table>
        </TableContainer>
      </SoftBox>
    </Card>
  );
}

export default Pages;
