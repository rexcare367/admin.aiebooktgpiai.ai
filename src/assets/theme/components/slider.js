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

// AI EBOOK DASHBOARD React base styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";

// AI EBOOK DASHBOARD React helper functions
import linearGradient from "assets/theme/functions/linearGradient";
import pxToRem from "assets/theme/functions/pxToRem";

const { light, white, sliderColors, black, gradients } = colors;
const { borderRadius, borderWidth } = borders;
const { sliderBoxShadow } = boxShadows;

const slider = {
  styleOverrides: {
    root: {
      width: "100%",

      "& .MuiSlider-active, & .Mui-focusVisible": {
        boxShadow: "none !important",
      },

      "& .MuiSlider-valueLabel": {
        color: black.main,
      },
    },

    rail: {
      height: pxToRem(3),
      backgroundColor: light.main,
      borderRadius: borderRadius.sm,
    },

    track: {
      backgroundImage: linearGradient(gradients.info.main, gradients.info.state),
      height: pxToRem(6),
      position: "relative",
      top: pxToRem(2),
      border: "none",
      borderRadius: borderRadius.lg,
      zIndex: 1,
    },

    thumb: {
      width: pxToRem(15),
      height: pxToRem(15),
      backgroundColor: white.main,
      zIndex: 10,
      boxShadow: sliderBoxShadow.thumb,
      border: `${borderWidth[1]} solid ${sliderColors.thumb.borderColor}`,

      "&:hover": {
        boxShadow: "none",
      },
    },
  },
};

export default slider;
