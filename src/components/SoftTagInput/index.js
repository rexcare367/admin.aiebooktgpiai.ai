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

// react-tag-input components
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

// Custom styles for SoftTagInput
import SoftTagInputRoot from "components/SoftTagInput/SoftTagInputRoot";

const SoftTagInput = forwardRef(({ size = "medium", error = false, success = false, ...rest }, ref) => (
  <SoftTagInputRoot ownerState={{ size, error, success }}>
    <ReactTagInput {...rest} ref={ref} />
  </SoftTagInputRoot>
));

// Typechecking props for the SoftTagInput
SoftTagInput.propTypes = {
  size: PropTypes.oneOf(["medium", "large"]),
  error: PropTypes.bool,
  success: PropTypes.bool,
};

export default SoftTagInput;
