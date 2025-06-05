import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Box, Typography } from "@mui/material";

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        gap: 2,
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
