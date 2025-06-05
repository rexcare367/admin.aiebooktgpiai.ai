import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Form components
import FormField from "./components/FormField";
import ImageUpload from "components/ImageUpload";

// Hooks and API
import { useRewards } from "context/RewardsContext";
import { rewardsApi } from "api/rewardsApi";

function EditReward() {
  const { rewardId } = useParams();
  const navigate = useNavigate();
  const { fetchRewards } = useRewards();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge: "",
    status: "Active",
    condition: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    color: "info"
  });

  useEffect(() => {
    const fetchReward = async () => {
      try {
        const data = await rewardsApi.getReward(rewardId);
        setFormData({
          title: data.title,
          description: data.description,
          badge: data.badge,
          status: data.status,
          condition: data.condition,
          createdAt: data.createdAt
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (rewardId) {
      fetchReward();
    }
  }, [rewardId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('condition.')) {
      const requirementField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        condition: {
          ...prev.condition,
          [requirementField]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await rewardsApi.updateReward(rewardId, formData);
      await fetchRewards();
      
      setAlert({
        open: true,
        message: "Reward updated successfully!",
        color: "success"
      });

      setTimeout(() => {
        navigate("/rewards/rewards/reward-list");
      }, 2000);
    } catch (err) {
      setAlert({
        open: true,
        message: "Failed to update reward: " + err.message,
        color: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 200px)">
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
        <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 200px)">
          <SoftTypography variant="h4" fontWeight="medium" color="error">
            Error: {error}
          </SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <form onSubmit={handleSubmit}>
          <Card>
            <SoftBox p={3}>
              {/* Header */}
{/* Header */}
<SoftBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                  <Link to="/rewards/rewards/reward-list">
                    <SoftButton variant="text" color="info" sx={{ p: 0 }}>
                      <Icon>arrow_back</Icon>&nbsp;Back to List
                    </SoftButton>
                  </Link>
                  <SoftTypography variant="h5" fontWeight="medium" mt={1}>
                    Edit Reward
                  </SoftTypography>
                </SoftBox>
                <SoftBox display="flex" gap={2}>
                  <SoftButton 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </SoftButton>
                  <SoftButton 
                    variant="gradient" 
                    color="info" 
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </SoftButton>
                </SoftBox>
              </SoftBox>

              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={8}>
                  <Card>
                    <SoftBox p={3}>
                      <SoftTypography variant="h6" fontWeight="medium" mb={3}>
                        Basic Information
                      </SoftTypography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <FormField
                            label="Reward Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter reward name"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormField
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter reward description"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormField
                            label="Points Required"
                            type="number"
                            name="points"
                            value={formData.points}
                            onChange={handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormField
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            type="select"
                            options={[
                              { value: 'Active', label: 'Active' },
                              { value: 'Inactive', label: 'Inactive' }
                            ]}
                          />
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </Card>
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <SoftBox p={3}>
                      <SoftTypography variant="h6" fontWeight="medium" mb={3}>
                        Reward Image
                      </SoftTypography>
                      <ImageUpload
                        value={formData.imageUrl}
                        onChange={(newUrl) => setFormData(prev => ({ ...prev, imageUrl: newUrl }))}
                      />
                    </SoftBox>
                  </Card>
                </Grid>

                {/* Requirements */}
                <Grid item xs={12}>
                  <Card>
                    <SoftBox p={3}>
                      <SoftTypography variant="h6" fontWeight="medium" mb={3}>
                        Achievement Requirements
                      </SoftTypography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormField
                            label="Books Read"
                            type="number"
                            name="condition.books_read"
                            value={formData.condition.books_read}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </Card>
                </Grid>
              </Grid>
            </SoftBox>
          </Card>
        </form>
      </SoftBox>

      <SoftSnackbar
        color={alert.color}
        icon={alert.color === "success" ? "check" : "warning"}
        title="Reward System"
        content={alert.message}
        open={alert.open}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
        close={() => setAlert(prev => ({ ...prev, open: false }))}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default EditReward;