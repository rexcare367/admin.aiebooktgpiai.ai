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
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Invoice({ date, id, price, noGutter = false }) {
  return (
    <SoftBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      pr={1}
      mb={noGutter ? 0 : 1}
    >
      <SoftBox lineHeight={1.125}>
        <SoftTypography display="block" variant="button" fontWeight="medium">
          {date}
        </SoftTypography>
        <SoftTypography variant="caption" fontWeight="regular" color="text">
          {id}
        </SoftTypography>
      </SoftBox>
      <SoftBox display="flex" alignItems="center">
        <SoftTypography variant="button" fontWeight="regular" color="text">
          {price}
        </SoftTypography>
        <SoftBox
          display="flex"
          alignItems="center"
          lineHeight={1}
          ml={3}
          sx={{ cursor: "pointer" }}
        >
          <Icon fontSize="small">picture_as_pdf</Icon>
          <SoftTypography variant="button" fontWeight="bold">
            &nbsp;PDF
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}


// Typechecking props for the Invoice
Invoice.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Invoice;
