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

// Image
import history from "assets/images/icons/departments/history.png";
import language from "assets/images/icons/departments/language.png";
import mathematics from "assets/images/icons/departments/mathematics.png";
import science from "assets/images/icons/departments/science.png";

const complexReportsDoughnutChartData = {
  images: [history, language, mathematics, science],
  labels: ["History", "Language", "Mathematics", "Science"],
  datasets: {
    label: "Subjects",
    backgroundColors: ["primary", "info", "warning", "success", "dark"],
    data: [25, 3, 12, 7],
  },
};

export default complexReportsDoughnutChartData;
