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

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftBadgeDot from "components/SoftBadgeDot";
import SoftAlert from "components/SoftAlert";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexReportsDoughnutChart from "examples/Charts/DoughnutCharts/ComplexReportsDoughnutChart";

// Analytics application components
import Social from "./components/Social";
import Pages from "./components/Pages";

// Data
import defaultLineChartData from "layouts/applications/analytics/data/defaultLineChartData";
import complexReportsDoughnutChartData from "layouts/applications/analytics/data/complexReportsDoughnutChartData";

import axios from "axios"

function Analytics() {
  const [menu, setMenu] = useState(null);

  const [readingProgressData, setReadingProgressData] = useState({
    "total_duration":0 ,
      "session_count": 0,
      "completed_books": [
      ],
      "partially_read_books": [
      ],
      "preferred_reading_times": [
          "23:00",
          "0:00"
      ],
      "books_with_percent": [
        {
          "book_file_key": "",
          "percent": 0
        },
      ],
      "books_with_durations": []
  });

  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userIc = queryParams.get('user_ic');

    if (userIc) {
      axios.get(`${process.env.REACT_APP_API_URL}users/reading_progress/${userIc}`)
        .then(response => {
          console.log('Reading progress data:', response.data);
          setReadingProgressData(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching reading progress data:', error);
          // Handle the error as needed
        });
    }
    else
      setShowAlert(true);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {showAlert && <SoftAlert color="error">No user is selected.</SoftAlert>}
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Total Read Count", fontWeight: "medium" }}
                count={readingProgressData.session_count ?? 0}
                // percentage={{ color: "success", text: "+55%" }}
                icon={{ color: "dark", component: "account_circle" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Total Books", fontWeight: "medium" }}
                count={readingProgressData.session_count ?? 0}
                // percentage={{ color: "success", text: "+3%" }}
                icon={{ color: "dark", component: "public" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Completed Books", fontWeight: "medium" }}
                count={readingProgressData.completed_books.length ?? 0}
                // percentage={{ color: "success", text: "-2%" }}
                icon={{ color: "dark", component: "watch" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Total Read Duration", fontWeight: "medium" }}
                count={readingProgressData.total_duration.length ?? 0}
                // percentage={{ color: "success", text: "+5%" }}
                icon={{ color: "dark", component: "image" }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Social data={readingProgressData.books_with_percent} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Pages data={readingProgressData.books_with_durations} />
          </Grid>
        </Grid>
        <SoftBox my={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <DefaultLineChart
                title="Active user"
                description={
                  <SoftBox display="flex" ml={-1}>
                    <SoftBadgeDot color="info" size="sm" badgeContent="New book" />
                    <SoftBadgeDot color="dark" size="sm" badgeContent="Old book" />
                    <SoftBadgeDot color="primary" size="sm" badgeContent="Unactive user" />
                  </SoftBox>
                }
                chart={defaultLineChartData}
              />
            </Grid>
            <Grid item xs={12} lg={5}>
              <ComplexReportsDoughnutChart
                title="Subjects"
                chart={complexReportsDoughnutChartData}
                tooltip="See which websites are sending traffic to your website"
                action={{
                  type: "internal",
                  route: "/",
                  color: "secondary",
                  label: "see all referrals",
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
