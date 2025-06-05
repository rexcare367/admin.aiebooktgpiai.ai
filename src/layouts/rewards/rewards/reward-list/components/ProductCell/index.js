import PropTypes from "prop-types";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

function ProductCell({ image, name }) {
  return (
    <SoftBox display="flex" alignItems="center">
      <SoftBox mr={2}>
        <SoftAvatar 
          src={image} 
          alt={name}
          variant="rounded"
          size="sm"
          sx={{
            width: 48,
            height: 48,
            background: image ? 'transparent' : '#f0f2f5',
            border: '1px solid #eee'
          }}
        />
      </SoftBox>
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="button" fontWeight="medium">
          {name}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

ProductCell.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default ProductCell;