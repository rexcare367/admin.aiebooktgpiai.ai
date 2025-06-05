import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";

function FormField({ 
  label, 
  type, 
  multiline, 
  rows, 
  value, 
  onChange, 
  name, 
  placeholder,
  options 
}) {
  return (
    <FormControl fullWidth>
      <SoftBox mb={1}>
        <SoftTypography
          component="label"
          variant="caption"
          fontWeight="bold"
          textTransform="capitalize"
        >
          {label}
        </SoftTypography>
      </SoftBox>
      {type === 'select' ? (
        <Select
          value={value}
          onChange={onChange}
          name={name}
          displayEmpty
          fullWidth
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <SoftInput
          type={type}
          value={value}
          onChange={onChange}
          multiline={multiline}
          rows={rows}
          name={name}
          placeholder={placeholder}
          fullWidth
        />
      )}
    </FormControl>
  );
}

FormField.defaultProps = {
  type: "text",
  multiline: false,
  rows: 1,
  placeholder: "",
  options: [],
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })),
};

export default FormField;