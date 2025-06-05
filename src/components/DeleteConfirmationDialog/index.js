import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function DeleteConfirmationDialog({ open, onClose, onConfirm, title, content, loading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <SoftBox display="flex" alignItems="center" justifyContent="space-between">
          <SoftTypography variant="h6">{title}</SoftTypography>
          <IconButton onClick={onClose} size="small">
            <Icon>close</Icon>
          </IconButton>
        </SoftBox>
      </DialogTitle>
      <DialogContent>
        <SoftTypography variant="body2" color="text">
          {content}
        </SoftTypography>
      </DialogContent>
      <DialogActions>
        <SoftButton 
          variant="text" 
          color="dark" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </SoftButton>
        <SoftButton 
          variant="gradient" 
          color="error" 
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </SoftButton>
      </DialogActions>
    </Dialog>
  );
}

DeleteConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  loading: PropTypes.bool,
};

DeleteConfirmationDialog.defaultProps = {
  title: "Confirm Delete",
  content: "Are you sure you want to delete this item?",
  loading: false,
};

export default DeleteConfirmationDialog;