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
import Card from "@mui/material/Card";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Timeline context
import { TimelineProvider } from "examples/Timeline/context";

function TimelineList({ title, dark = false, children }) {
  return (
    <TimelineProvider value={dark}>
      <Card>
        <SoftBox bgColor={dark ? "dark" : "white"} variant="gradient">
          <SoftBox pt={3} px={3}>
            <SoftTypography variant="h6" fontWeight="medium" color={dark ? "white" : "dark"}>
              {title}
            </SoftTypography>
          </SoftBox>
          <SoftBox p={2}>{children}</SoftBox>
        </SoftBox>
      </Card>
    </TimelineProvider>
  );
}


// Typechecking props for the TimelineList
TimelineList.propTypes = {
  title: PropTypes.string.isRequired,
  dark: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default TimelineList;
