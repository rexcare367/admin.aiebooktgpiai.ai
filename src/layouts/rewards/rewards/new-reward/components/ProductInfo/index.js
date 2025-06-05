import { useState } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Custom components
import ImageUpload from "components/ImageUpload";

// Context
import { useRewards } from "context/RewardsContext";
import axios from "axios";

function ProductInfo({ onSubmitSuccess, onSubmitManual }) {
  // Add fallback for when context is not available
  const rewardsContext = useRewards();
  const createReward = rewardsContext?.createReward || onSubmitManual;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    requirements: {
      longest_continuous_read_period: 0,
      longest_read_period_one_book: 0,
      longest_read_period_one_book_key: 0,
      max_read_times_one_book: 0,
      max_read_times_one_book_key: 0,
      total_read_books: 0,
      total_read_period: 0
    },
    status: "Active"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('requirements.')) {
      const requirement = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          [requirement]: Number(value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      imageUrl
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Reward name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.imageUrl) {
      setError("Please upload an image");
      return false;
    }
    // Validate requirements
    for (const [key, value] of Object.entries(formData.requirements)) {
      if (value < 0) {
        setError(`${key.replace(/_/g, ' ')} cannot be negative`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }
    console.log('formData', formData)

    try {
      setLoading(true);
      console.log('-----')
      if (createReward) {
       axios.post(`${process.env.REACT_APP_API_URL}ebooks/reward/add`, formData).then(onSubmitSuccess && onSubmitSuccess())
      } else {
        console.error('No create reward function available');
        setError('Configuration error. Please try again later.');
      }
    } catch (err) {
      setError(err.message || "Failed to create reward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={{ overflow: "visible" }}>
        <SoftBox p={3}>
          <SoftTypography variant="h5" fontWeight="bold">
            Reward Information
          </SoftTypography>
          <SoftBox mt={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  currentImage={formData.imageUrl}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <SoftBox mb={3}>
                  <SoftTypography variant="caption" fontWeight="bold">
                    Reward Name*
                  </SoftTypography>
                  <SoftInput
                    placeholder="Enter reward name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={12}>
                <SoftBox mb={3}>
                  <SoftTypography variant="caption" fontWeight="bold">
                    Description*
                  </SoftTypography>
                  <SoftInput
                    placeholder="Enter reward description"
                    multiline
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </SoftBox>
              </Grid>
              {/* Requirements Section */}
              <Grid item xs={12}>
                <SoftTypography variant="h6" fontWeight="bold">
                  Requirements
                </SoftTypography>
              </Grid>
              {Object.entries(formData.requirements).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <SoftBox mb={3}>
                    <SoftTypography variant="caption" fontWeight="bold" textTransform="capitalize">
                      {key.replace(/_/g, ' ')}
                    </SoftTypography>
                    <SoftInput
                      type="number"
                      placeholder="Enter value"
                      name={`requirements.${key}`}
                      value={value}
                      onChange={handleInputChange}
                    />
                  </SoftBox>
                </Grid>
              ))}
              
              {error && (
                <Grid item xs={12}>
                  <SoftTypography variant="caption" color="error">
                    {error}
                  </SoftTypography>
                </Grid>
              )}

              <Grid item xs={12}>
                <SoftBox display="flex" justifyContent="flex-end">
                  <SoftButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Reward"}
                  </SoftButton>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </SoftBox>
      </Card>
    </form>
  );
}

ProductInfo.propTypes = {
  onSubmitSuccess: PropTypes.func,
  onSubmitManual: PropTypes.func, // Add this prop type
};

export default ProductInfo;