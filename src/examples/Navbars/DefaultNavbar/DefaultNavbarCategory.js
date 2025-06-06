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

function DefaultNavbarCategory({ color = "info", icon, title }) {
  return (
    <SoftBox width="100%" display="flex" alignItems="center" py={1}>
      <SoftBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="1.5rem"
        height="1.5rem"
        borderRadius="md"
        color="white"
        bgColor={color}
        variant="gradient"
        mr={1}
      >
        {typeof icon === "string" ? <Icon>{icon}</Icon> : icon}
      </SoftBox>
      <SoftTypography variant="button" fontWeight="bold">
        {title}
      </SoftTypography>
    </SoftBox>
  );
}


// Typechecking props for the DefaultNavbarCategory
DefaultNavbarCategory.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default DefaultNavbarCategory;
