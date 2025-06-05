import PropTypes from "prop-types";
import { useState } from "react";
import { Icon } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { s3Service } from "services/s3Service";

function ImageUpload({ onImageUpload, currentImage }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [error, setError] = useState("");

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError("");

      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to S3
      const imageUrl = await s3Service.uploadImage(file);
      onImageUpload(imageUrl);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SoftBox>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="image-upload-input"
      />
      
      <SoftBox 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        p={3}
        border="1px dashed #ccc"
        borderRadius="lg"
      >
        {previewUrl ? (
          <SoftBox position="relative" width="100%" maxWidth="300px">
            <img
              src={previewUrl}
              alt="Preview"
              style={{ 
                width: '100%', 
                height: 'auto',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            />
            <label htmlFor="image-upload-input">
              <SoftButton
                variant="gradient"
                color="info"
                size="small"
                component="span"
                disabled={uploading}
              >
                Change Image
              </SoftButton>
            </label>
          </SoftBox>
        ) : (
          <label htmlFor="image-upload-input">
            <SoftBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ cursor: 'pointer' }}
            >
              <Icon fontSize="large" color="action">cloud_upload</Icon>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </SoftTypography>
            </SoftBox>
          </label>
        )}

        {error && (
          <SoftTypography variant="caption" color="error" mt={1}>
            {error}
          </SoftTypography>
        )}
      </SoftBox>
    </SoftBox>
  );
}

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
  currentImage: PropTypes.string,
};

export default ImageUpload;