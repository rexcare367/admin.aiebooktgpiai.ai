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

import { forwardRef, createContext, useContext, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";

// Custom styles for SoftPagination
import SoftPaginationItemRoot from "components/SoftPagination/SoftPaginationItemRoot";

// The Pagination main context
const Context = createContext();

const SoftPagination = forwardRef(
  ({ item = false, variant = "gradient", color = "info", size = "medium", active = false, children, ...rest }, ref) => {
    const context = useContext(Context);
    const paginationSize = context ? context.size : null;
    const value = useMemo(() => ({ variant, color, size }), [variant, color, size]);

    return (
      <Context.Provider value={value}>
        {item ? (
          <SoftPaginationItemRoot
            {...rest}
            ref={ref}
            variant={active ? context.variant : "outlined"}
            color={active ? context.color : "secondary"}
            iconOnly
            circular
            ownerState={{ variant, active, paginationSize }}
          >
            {children}
          </SoftPaginationItemRoot>
        ) : (
          <SoftBox
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ listStyle: "none" }}
          >
            {children}
          </SoftBox>
        )}
      </Context.Provider>
    );
  }
);


// Typechecking props for the SoftPagination
SoftPagination.propTypes = {
  item: PropTypes.bool,
  variant: PropTypes.oneOf(["gradient", "contained"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default SoftPagination;
