import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Tooltip, Icon } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";

function ActionCell({ edit = true, remove = true, rewardId, onDelete }) {
  console.log('ActionCell rewardId:', rewardId); // Debug log

  if (!rewardId) {
    console.warn('No rewardId provided to ActionCell');
    return null;
  }

  const viewPath = `/rewards/rewards/reward-page/${rewardId}`;
  const editPath = `/rewards/rewards/edit-reward/${rewardId}`;

  console.log('ActionCell paths:', { viewPath, editPath }); // Debug log

  return (
    <SoftBox display="flex" gap={1}>
      <Link to={viewPath}>
        <Tooltip title="View Details" placement="top">
          <SoftButton variant="text" color="info" size="small" iconOnly>
            <Icon>visibility</Icon>
          </SoftButton>
        </Tooltip>
      </Link>

      {edit && (
        <Link to={editPath}>
          <Tooltip title="Edit Reward" placement="top">
            <SoftButton variant="text" color="warning" size="small" iconOnly>
              <Icon>edit</Icon>
            </SoftButton>
          </Tooltip>
        </Link>
      )}

      {remove && (
        <Tooltip title="Delete Reward" placement="top">
          <SoftButton 
            variant="text" 
            color="error" 
            size="small" 
            iconOnly
            onClick={() => onDelete(rewardId)}
          >
            <Icon>delete</Icon>
          </SoftButton>
        </Tooltip>
      )}
    </SoftBox>
  );
}

ActionCell.propTypes = {
  edit: PropTypes.bool,
  remove: PropTypes.bool,
  rewardId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ActionCell;