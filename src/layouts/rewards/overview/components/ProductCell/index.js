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

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

function ProductCell({ image, name, orders }) {
  return (
    <SoftBox display="flex" alignItems="center" pr={2}>
      <SoftBox mr={2}>
        <SoftAvatar src={image} alt={name} variant="rounded" />
      </SoftBox>
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="button" fontWeight="medium">
          {name}
        </SoftTypography>
        <SoftTypography variant="button" fontWeight="medium" color="secondary">
          <SoftTypography component="span" variant="button" color="success">
            {orders}
          </SoftTypography>{" "}
          orders
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

// Typechecking props for the ProductCell
ProductCell.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  orders: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ProductCell;
