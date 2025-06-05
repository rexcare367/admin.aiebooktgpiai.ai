import React from "react";
import PropTypes from "prop-types";

function UserAvatar({ rank, color }) {
  return (
    <div
      className={`h-12 w-12 rounded-full border-solid border border-1 ${color} flex items-center justify-center font-bold`}
    >
      {rank}
    </div>
  );
}

UserAvatar.propTypes = {
  rank: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default UserAvatar;
