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

const miniGradientLineChartData = {
  visitorsChart: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Visitors",
        color: "info",
        data: [50, 45, 60, 60, 80, 65, 90, 80, 100],
      },
    ],
  },
  incomeChart: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Income",
        color: "info",
        data: [60, 80, 75, 90, 67, 100, 90, 110, 120],
      },
    ],
    customTick: "$",
  },
};

export default miniGradientLineChartData;
