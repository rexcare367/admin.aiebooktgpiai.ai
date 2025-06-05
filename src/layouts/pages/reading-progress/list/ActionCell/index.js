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
import Tooltip from "@mui/material/Tooltip";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function ActionCell({userIC, refetch}) {
  const getReadingProgressByUserIC = async () => {
    window.location.href = `/pages/reading_progress/detail?user_ic=${userIC}`;
  };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }} onClick={getReadingProgressByUserIC}>
        <Tooltip title="View Detail" placement="top">
          <Icon>visibility</Icon>
        </Tooltip>
      </SoftTypography>
      <SoftBox mx={2}>
        <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }} onClick={refetch}>
          <Tooltip title="Reload" placement="top">
            <Icon>refresh</Icon>
          </Tooltip>
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

// Typechecking props for the SoftDropzone
ActionCell.propTypes = {
  userIC: PropTypes.string,
  refetch: PropTypes.func.isRequired
};

export default ActionCell;
