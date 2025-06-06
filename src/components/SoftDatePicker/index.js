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

// react-flatpickr components
import Flatpickr from "react-flatpickr";

// react-flatpickr styles
import "flatpickr/dist/flatpickr.css";

// AI EBOOK DASHBOARD React components
import SoftInput from "components/SoftInput";

function SoftDatePicker({ input = {}, ...rest }) {
  return (
    <Flatpickr
      {...rest}
      render={({ defaultValue }, ref) => (
        <SoftInput {...input} defaultValue={defaultValue} inputRef={ref} />
      )}
    />
  );
}


// Typechecking props for the SoftDatePicker
SoftDatePicker.propTypes = {
  input: PropTypes.objectOf(PropTypes.any),
};

export default SoftDatePicker;
