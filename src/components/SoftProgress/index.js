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

import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// AI EBOOK DASHBOARD React components
import SoftTypography from "components/SoftTypography";

// Custom styles for SoftProgress
import SoftProgressRoot from "components/SoftProgress/SoftProgressRoot";

const SoftProgress = forwardRef(({ variant = "contained", color = "info", value = 0, label = false, ...rest }, ref) => (
  <>
    {label && (
      <SoftTypography variant="button" fontWeight="medium" color="text">
        {value}%
      </SoftTypography>
    )}
    <SoftProgressRoot
      {...rest}
      ref={ref}
      variant="determinate"
      value={value}
      ownerState={{ color, value, variant }}
    />
  </>
));


// Typechecking props for the SoftProgress
SoftProgress.propTypes = {
  variant: PropTypes.oneOf(["contained", "gradient"]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  value: PropTypes.number,
  label: PropTypes.bool,
};

export default SoftProgress;
