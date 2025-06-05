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
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import axios from 'axios';

function ActionCell({ebookId, fetchBooks}) {
  const deleteEbook = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}ebooks/${ebookId}`).then(res=>res.data);
      console.log('Ebook deleted successfully:', response.data);
      if(response.success)
      fetchBooks(); // Refetch books after successful deletion
    } catch (error) {
      console.error('Error deleting ebook:', error);
    }
  };

  return (
    <SoftBox display="flex" alignItems="center">
      {/* <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
        <Tooltip title="Preview product" placement="top">
          <Icon>visibility</Icon>
        </Tooltip>
      </SoftTypography>
      <SoftBox mx={2}>
        <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
          <Tooltip title="Edit product" placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </SoftTypography>
      </SoftBox> */}
      <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }} onClick={deleteEbook}>
        <Tooltip title="Delete product" placement="left">
          <Icon>delete</Icon>
        </Tooltip>
      </SoftTypography>
    </SoftBox>
  );
}

// Typechecking props for the SoftDropzone
ActionCell.propTypes = {
  ebookId: PropTypes.string,
  fetchBooks: PropTypes.func.isRequired
};

export default ActionCell;
