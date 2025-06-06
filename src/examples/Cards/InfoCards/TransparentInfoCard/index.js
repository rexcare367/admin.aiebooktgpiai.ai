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

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function TransparentInfoCard({ color = "info", icon, description, value = "" }) {
  return (
    <SoftBox display="flex" flexDirection="column" alignItems="center" textAlign="center" p={3}>
      <SoftBox
        display="grid"
        justifyContent="center"
        alignItems="center"
        bgColor={color}
        color="white"
        width="3rem"
        height="3rem"
        shadow="md"
        borderRadius="md"
        variant="gradient"
        mb={1}
      >
        <Icon fontSize="default">{icon}</Icon>
      </SoftBox>
      <SoftBox mb={1} lineHeight={0}>
        <SoftTypography variant="button" color="text" fontWeight="medium">
          {description}
        </SoftTypography>
      </SoftBox>
      {value && (
        <SoftTypography variant="h5" fontWeight="bold">
          {value}
        </SoftTypography>
      )}
    </SoftBox>
  );
}


// Typechecking props for the TransparentInfoCard
TransparentInfoCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
};

export default TransparentInfoCard;
