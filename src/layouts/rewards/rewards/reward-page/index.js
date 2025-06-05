import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";
import SoftAvatar from "components/SoftAvatar";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Hooks and API
import { rewardsApi } from "api/rewardsApi";

function RewardPage() {
  const { rewardId } = useParams();
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReward = async () => {
      try {
        console.log("Fetching reward with ID:", rewardId); // Debug log
        const data = await rewardsApi.getReward(rewardId);
        console.log("Fetched reward data:", data); // Debug log
        setReward(data);
      } catch (err) {
        console.error("Error fetching reward:", err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (rewardId) {
      fetchReward();
    }
  }, [rewardId]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 200px)"
        >
          <SoftTypography variant="h4" fontWeight="medium">
            Loading...
          </SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 200px)"
        >
          <SoftTypography variant="h4" fontWeight="medium" color="error">
            Error: {error}
          </SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  if (!reward) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 200px)"
        >
          <SoftTypography variant="h4" fontWeight="medium">
            Reward not found
          </SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Card>
          <SoftBox p={3}>
            {/* Header with Navigation */}
            <SoftBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <SoftBox>
                <Link to="/rewards/rewards/reward-list">
                  <SoftButton variant="text" color="info" sx={{ p: 0 }}>
                    <Icon>arrow_back</Icon>&nbsp;Back to List
                  </SoftButton>
                </Link>
                <SoftTypography variant="h5" fontWeight="medium" mt={1}>
                  Reward Details
                </SoftTypography>
              </SoftBox>
              <Link to={`/rewards/rewards/edit-reward/${rewardId}`}>
                <SoftButton variant="gradient" color="info">
                  <Icon>edit</Icon>&nbsp;Edit Reward
                </SoftButton>
              </Link>
            </SoftBox>

            <Grid container spacing={3}>
              {/* Left Column - Image and Basic Info */}
              <Grid item xs={12} md={4}>
                <SoftBox mb={3}>
                  <SoftAvatar
                    src={`http://localhost:8000/static/${reward.badge}`}
                    alt={reward.title}
                    variant="rounded"
                    size="xxl"
                    sx={{ width: '100%', height: 'auto', maxHeight: '300px' }}
                  />
                </SoftBox>
                <SoftBox mb={2}>
                  <SoftBadge
                    variant="contained"
                    color={reward.status === "Active" ? "success" : "secondary"}
                    size="lg"
                    badgeContent={reward.status}
                    container
                  />
                </SoftBox>
                {/* <SoftBox mb={2}>
                  <SoftTypography variant="h6" fontWeight="medium">
                    Points Required
                  </SoftTypography>
                  <SoftTypography variant="h4" color="info">
                    {reward.points}
                  </SoftTypography>
                </SoftBox> */}
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    CreatedAt: {new Date(reward.createdAt).toLocaleDateString()}
                  </SoftTypography>
                </SoftBox>
              </Grid>

              {/* Right Column - Requirements and Details */}
              <Grid item xs={12} md={8}>
                <SoftBox mb={3}>
                  <SoftTypography variant="h3" fontWeight="medium">
                    {reward.title}
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text" mt={1}>
                    {reward.description}
                  </SoftTypography>
                </SoftBox>

                <SoftBox mb={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Achievement Requirements
                  </SoftTypography>
                  <Grid container spacing={2}>
                    {reward.condition.map((item, index) => {
                      const field = item.M.field.S;
                      const value = item.M.limit.N;
                      return (
                      <Grid item xs={12} md={6} key={index}>
                        <Card>
                          <SoftBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                            <SoftTypography variant="button" color="text" fontWeight="medium">
                              {field.replace(/_/g, ' ').toUpperCase()}
                            </SoftTypography>
                            <SoftTypography variant="h6" color="dark">
                              {value}
                            </SoftTypography>
                          </SoftBox>
                        </Card>
                      </Grid>
                    )})}
                  </Grid>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default RewardPage;