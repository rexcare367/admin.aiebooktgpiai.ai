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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

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
import PagesHeaderCell from "../PagesHeaderCell";
import PagesBodyCell from "../PagesBodyCell";

function Pages({data=[]}) {
  console.log('data', data)
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
                <PagesHeaderCell>Book</PagesHeaderCell>
                <PagesHeaderCell>Read Count</PagesHeaderCell>
                <PagesHeaderCell>Total Duration</PagesHeaderCell>
              </TableRow>
            </SoftBox>
            <TableBody>
          {
            data.map((item, i)=>{
              const title = item.book_file_key.replace(/^\d+_/, '').replace(/_/g, ' ');
              return (
                <PagesBodyCell key={i} rows={[title, item.read_count, item.total_duration]} />
              )
            })
          }
            </TableBody>
          </Table>
        </TableContainer>
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the SoftDropzone
Pages.propTypes = {
  data: PropTypes.array
};

export default Pages;
