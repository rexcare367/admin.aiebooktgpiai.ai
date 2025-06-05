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

import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
  collapseArrow,
} from "examples/Sidenav/styles/sidenavCollapse";
import { useSoftUIController } from "context";

function SidenavCollapse({ 
  icon, 
  name, 
  children = false, 
  active = false, 
  noCollapse = false, 
  open = false,
  type = "collapse", // Added type prop to check if it's a main item
  ...rest 
}) {
  const [controller] = useSoftUIController();
  const { miniSidenav, transparentSidenav, sidenavColor } = controller;

  // Check if this is a main menu item
  const isMainItem = type === "item";

  return (
    <>
      <ListItem component="li">
        <SoftBox 
          {...rest} 
          sx={(theme) => ({
            ...collapseItem(theme, { active, transparentSidenav }),
            ...(isMainItem && {
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: transparentSidenav ? 'transparent' : theme.palette.grey[200],
              },
            }),
          })}
        >
          <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { active, transparentSidenav, sidenavColor })}
          >
            {typeof icon === "string" ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={(theme) => collapseText(theme, { miniSidenav, transparentSidenav, active })}
          />

          {children && !isMainItem && !noCollapse && (
            <Icon
              sx={(theme) =>
                collapseArrow(theme, { noCollapse, transparentSidenav, miniSidenav, open })
              }
            >
              expand_less
            </Icon>
          )}
        </SoftBox>
      </ListItem>
      {children && !isMainItem && !noCollapse && (
        <Collapse in={open} unmountOnExit>
          {children}
        </Collapse>
      )}
      {children && (isMainItem || noCollapse) && (
        <div>{children}</div>
      )}
    </>
  );
}

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool,
  open: PropTypes.bool,
  type: PropTypes.oneOf(["collapse", "item"]),
};

export default SidenavCollapse;