// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { useState } from "react";

// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import axios from "axios";

function ActionCell({ id, reload }) {
  const [isLoading, setIsLoading] = useState(false);

  const deleteItem = async () => {
    setIsLoading(true); // Start loading state
    try {
      const response = await axios
        .delete(`${process.env.REACT_APP_API_URL}users/user/${id}`)
        .then((res) => res.data);
      console.log("Data is deleted successfully:", response.data);
      if (response.success) reload(); // Refetch books after successful deletion
    } catch (error) {
      console.error("Error deleting row:", error);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <SoftBox display="flex" alignItems="center">
      {isLoading ? (
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <SoftTypography
          variant="body1"
          color="secondary"
          sx={{ cursor: "pointer", lineHeight: 0 }}
          onClick={deleteItem}
        >
          <Tooltip title="Delete product" placement="left">
            <Icon>delete</Icon>
          </Tooltip>
        </SoftTypography>
      )}
    </SoftBox>
  );
}

// Typechecking props for the SoftDropzone
ActionCell.propTypes = {
  id: PropTypes.string,
  reload: PropTypes.func.isRequired,
};

export default ActionCell;
