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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// react-router components
import { Link } from "react-router-dom";

// @mui material components
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";

// AI EBOOK DASHBOARD React example components
import DefaultNavbarMenu from "examples/Navbars/DefaultNavbar/DefaultNavbarMenu";

function ApplicationsMenu({ routes, open = false, close = false, mobileMenu = false }) {
  const renderApplicationsMenuRoute = (routeName) =>
    routes.map(
      ({ key, collapse }) =>
        key === routeName &&
        collapse.map(({ key: collapseKey, route, name, icon }) => (
          <MenuItem
            key={collapseKey}
            component={Link}
            to={route}
            onClick={mobileMenu ? undefined : close}
          >
            <SoftBox display="flex" alignItems="center" py={0.25}>
              {typeof icon === "string" ? (
                <Icon
                  sx={({ functions: { linearGradient }, palette: { gradients, transparent } }) => ({
                    backgroundImage: `${linearGradient(
                      gradients.info.main,
                      gradients.info.state
                    )} !important`,
                    WebkitBackgroundClip: "text !important",
                    WebkitTextFillColor: `${transparent.main} !important`,
                  })}
                  fontSize="small"
                >
                  {icon}
                </Icon>
              ) : (
                icon
              )}
              <SoftBox color="text" pl={2} lineHeight={0}>
                {name}
              </SoftBox>
            </SoftBox>
          </MenuItem>
        ))
    );

  return mobileMenu ? (
    <SoftBox px={1.5}>{renderApplicationsMenuRoute("applications")}</SoftBox>
  ) : (
    <DefaultNavbarMenu open={open} close={close}>
      {renderApplicationsMenuRoute("applications")}
    </DefaultNavbarMenu>
  );
}


// Typechecking props for the ApplicationsMenu
ApplicationsMenu.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  close: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  mobileMenu: PropTypes.bool,
};
export default ApplicationsMenu;
