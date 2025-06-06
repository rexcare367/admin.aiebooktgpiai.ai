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

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React base styles
import typography from "assets/theme/base/typography";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftProgress from "components/SoftProgress";

function ReportsBarChartItem({ color = "dark", icon, label, progress }) {
  const { size } = typography;

  return (
    <SoftBox width="100%">
      <SoftBox display="flex" alignItems="center" mb={2}>
        <SoftBox
          bgColor={icon.color}
          width="1.25rem"
          height="1.25rem"
          borderRadius="sm"
          color="white"
          fontSize={size.xs}
          display="flex"
          justifyContent="center"
          alignItems="center"
          shadow="md"
          mr={1}
          variant="gradient"
        >
          <Icon>{icon.component}</Icon>
        </SoftBox>
        <SoftTypography
          variant="caption"
          textTransform="capitalize"
          fontWeight="medium"
          color="text"
        >
          {label}
        </SoftTypography>
      </SoftBox>
      <SoftBox mt={1}>
        <SoftTypography variant="h4" fontWeight="bold" color={color}>
          {progress.content}
        </SoftTypography>
        <SoftBox width="75%" mt={0.5}>
          <SoftProgress value={progress.percentage} color={color} />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}


// Typechecking props for the ReportsBarChartItem
ReportsBarChartItem.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.shape({
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"])
      .isRequired,
    component: PropTypes.node.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  progress: PropTypes.shape({
    content: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
  }).isRequired,
};

export default ReportsBarChartItem;
