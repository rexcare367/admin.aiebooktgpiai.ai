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
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// @mui icons
import BookIcon from "@mui/icons-material/Book";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Analytics application components
import SocialItem from "layouts/applications/analytics/components/SocialItem";

function Social({data=[]}) {
  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <SoftTypography variant="h6">Share Progress to Social Media</SoftTypography>
        <Tooltip title="See how much traffic do you get from social media" placement="bottom">
          <SoftButton variant="outlined" color="secondary" size="small" circular iconOnly>
            <Icon>priority_high</Icon>
          </SoftButton>
        </Tooltip>
      </SoftBox>
      <SoftBox p={2}>
        
        {
          data.map((item, i)=>{
            const title = item.book_file_key.replace(/^\d+_/, '').replace(/_/g, ' ');
            return (<SocialItem
            key={i}
              icon={{ color: "twitter", component: <BookIcon /> }}
              title={title}
              percentage={parseInt(item.percent * 100)}
            />)
          })
        }
        
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the SoftDropzone
Social.propTypes = {
  data: PropTypes.array
};

export default Social;
