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
import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function DefaultNavbarLink({
  name,
  openHandler = false,
  closeHandler = false,
  children = false,
  collapseStatus = false,
  light = false,
  ...rest
}) {
  return (
    <>
      <SoftBox
        {...rest}
        mx={1}
        p={1}
        onMouseEnter={children ? undefined : openHandler}
        onMouseLeave={children ? undefined : closeHandler}
        display="flex"
        alignItems="baseline"
        color={light ? "white" : "dark"}
        sx={{ cursor: "pointer", userSelect: "none" }}
      >
        <SoftTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color="inherit"
          sx={{ fontWeight: "100%" }}
        >
          {name}
        </SoftTypography>
        <SoftTypography variant="body2" color={light ? "white" : "dark"}>
          <Icon sx={{ fontWeight: "bold", verticalAlign: "middle" }}>keyboard_arrow_down</Icon>
        </SoftTypography>
      </SoftBox>
      {children && (
        <Collapse in={Boolean(collapseStatus)} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}


// Typechecking props for the DefaultNavbarLink
DefaultNavbarLink.propTypes = {
  name: PropTypes.string.isRequired,
  openHandler: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  closeHandler: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  children: PropTypes.node,
  collapseStatus: PropTypes.bool,
  light: PropTypes.bool,
};

export default DefaultNavbarLink;
