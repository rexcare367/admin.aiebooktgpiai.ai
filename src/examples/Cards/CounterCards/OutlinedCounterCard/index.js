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

// react-countup components
import CountUp from "react-countup";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// AI EBOOK DASHBOARD React base styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

function OutlinedCounterCard({ color = "info", count, title, prefix = "", suffix = "" }) {
  const { secondary } = colors;
  const { borderWidth } = borders;

  return (
    <SoftBox
      borderRadius="md"
      border={`${borderWidth[1]} dashed ${secondary.main}`}
      textAlign="center"
      py={2}
    >
      <SoftTypography variant="h6" color={color} fontWeight="medium" textTransform="capitalize">
        {title}
      </SoftTypography>
      <SoftTypography variant="h4" fontWeight="bold">
        {prefix && (
          <SoftTypography component="span" variant="h5" fontWeight="bold">
            {prefix}
          </SoftTypography>
        )}
        <SoftBox display="inline-block" mx={0.5}>
          <CountUp end={count} duration={1} separator="," />
        </SoftBox>
        {suffix && (
          <SoftTypography component="span" variant="h5" fontWeight="bold">
            {suffix}
          </SoftTypography>
        )}
      </SoftTypography>
    </SoftBox>
  );
}


// Typechecking props for the BlogCard
OutlinedCounterCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default OutlinedCounterCard;
