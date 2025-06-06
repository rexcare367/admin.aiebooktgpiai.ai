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

// @mui material components
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftButton from "components/SoftButton";

// Image
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import team5 from "assets/images/team-5.jpg";

function Header() {
  const avatarStyles = {
    border: ({ borders: { borderWidth }, palette: { white } }) =>
      `${borderWidth[2]} solid ${white.main}`,
    cursor: "pointer",
    position: "relative",
    ml: -1.5,

    "&:hover, &:focus": {
      zIndex: "10",
    },
  };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftBox mt={0.5} pr={1}>
        <SoftBox mb={1} lineHeight={0}>
          <SoftTypography variant="caption" color="secondary" fontWeight="medium">
            Team members:
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex">
          <SoftAvatar src={team1} alt="team-1" size="sm" sx={avatarStyles} />
          <SoftAvatar src={team2} alt="team-1" size="sm" sx={avatarStyles} />
          <SoftAvatar src={team3} alt="team-1" size="sm" sx={avatarStyles} />
          <SoftAvatar src={team4} alt="team-1" size="sm" sx={avatarStyles} />
          <SoftAvatar src={team5} alt="team-1" size="sm" sx={avatarStyles} />
        </SoftBox>
      </SoftBox>
      <SoftBox height="75%" alignSelf="flex-end">
        <Divider orientation="vertical" />
      </SoftBox>
      <SoftBox pl={1}>
        <SoftButton variant="gradient" color="info" iconOnly>
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
        </SoftButton>
      </SoftBox>
    </SoftBox>
  );
}

export default Header;
