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

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import Globe from "examples/Globe";

// AI EBOOK DASHBOARD React base styles
import typography from "assets/theme/base/typography";
import breakpoints from "assets/theme/base/breakpoints";

// Data
import salesTableData from "layouts/dashboards/default/data/salesTableData";
import reportsBarChartData from "layouts/dashboards/default/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboards/default/data/gradientLineChartData";

import { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { dynamoDb } from "config/aws-config";
import api from "api/axios";

function Default() {
  const { values } = breakpoints;
  const { size } = typography;
  const { chart, items } = reportsBarChartData;

  const [statistic, setStatistic] = useState({
    totalSchools: 0,
    totalUsers: 0,
    totalRegisteredUsers: 0,
    totalBooks: 0,
    totalIndexedBooks: 0,
    totalNonRegisteredUsers: 0,
    totalReadBooks: 0,
    topReadBook: "",
    topReadBookCount: 0,
    topReadLanguage: "",
    topReadLanguageCount: 0,
  });

  const [schoolStats, setSchoolStats] = useState([]);
  const [readingStats, setReadingStats] = useState({
    chart: {
      labels: [],
      datasets: { label: "Users", data: [] },
    },
    items: [],
    metrics: {
      totalActiveUsers: 0,
      avgReadTime: 0,
      mostEngagedReader: null,
      mostReadBook: null,
      multiBookReaders: 0,
      avgBooksPerUser: 0,
    },
  });

  const [readingTrends, setReadingTrends] = useState({
    labels: [],
    datasets: [
      {
        label: "Reading Time (mins)",
        data: [],
      },
    ],
  });

  const [readingEngagement, setReadingEngagement] = useState({
    avgReadingTime: 0,
    avgBooksPerUser: 0,
    topReaderTime: 0,
    multiBookReaders: 0,
  });

  const fetchTopSchools = async () => {
    try {
      const params = {
        TableName: "IC_Numbers",
        Select: "ALL_ATTRIBUTES",
      };

      const response = await dynamoDb.scan(params).promise();

      // Count students by school
      const schoolCounts = response.Items.reduce((acc, item) => {
        const school = item.school || "Unknown";
        acc[school] = (acc[school] || 0) + 1;
        return acc;
      }, {});

      // Convert to array and sort by count
      const sortedSchools = Object.entries(schoolCounts)
        .map(([school, count]) => ({
          school,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4); // Get top 4

      setSchoolStats(sortedSchools);
    } catch (error) {
      console.error("Error fetching school stats:", error);
      setSchoolStats([]);
    }
  };

  const fetchReadingStats = async () => {
    try {
      const params = {
        TableName: "quizzes",
        Select: "ALL_ATTRIBUTES",
      };

      const response = await dynamoDb.scan(params).promise();
      const items = response.Items || [];

      // Get current year
      const currentYear = new Date().getFullYear();

      // Group quizzes by month
      const monthlyQuizzes = _.groupBy(items, (item) => {
        const date = new Date(item.created_time);
        return date.getMonth();
      });

      // Get count for each month
      const monthlyData = Array(12)
        .fill(0)
        .map((_, index) => {
          return monthlyQuizzes[index]?.length || 0;
        });

      // Calculate month over month growth
      const lastMonthIndex = new Date().getMonth();
      const lastMonthCount = monthlyData[lastMonthIndex] || 0;
      const previousMonthCount = monthlyData[lastMonthIndex - 1] || 1; // Prevent division by zero
      const growthPercentage = (
        ((lastMonthCount - previousMonthCount) / previousMonthCount) *
        100
      ).toFixed(1);

      // Process data for bar chart
      const chartData = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: {
          label: "Quizzes Created",
          data: monthlyData,
        },
      };

      // Calculate metrics for the items below chart
      const metrics = {
        totalQuizzes: items.length,
        avgQuizzesPerMonth: Math.round(items.length / (lastMonthIndex + 1)),
        monthWithMostQuizzes: _.maxBy(Object.entries(monthlyQuizzes), "[1].length")?.[0],
      };

      // Format items for display
      const chartItems = [
        {
          icon: { color: "primary", component: "quiz" },
          label: "Monthly Average",
          progress: {
            content: `${metrics.avgQuizzesPerMonth} quizzes`,
            percentage: 70,
          },
        },
        {
          icon: { color: "info", component: "calendar_today" },
          label: "This Month",
          progress: {
            content: `${monthlyData[lastMonthIndex]} quizzes`,
            percentage: 80,
          },
        },
        {
          icon: { color: "success", component: "trending_up" },
          label: "Growth",
          progress: {
            content: `${growthPercentage}% vs last month`,
            percentage: 100,
          },
        },
      ];

      return {
        chart: chartData,
        items: chartItems,
        metrics,
      };
    } catch (error) {
      console.error("Error fetching quiz statistics:", error);
      return {
        chart: {
          labels: [],
          datasets: { label: "Quizzes", data: [] },
        },
        items: [],
        metrics: {
          totalQuizzes: 0,
          avgQuizzesPerMonth: 0,
          monthWithMostQuizzes: null,
        },
      };
    }
  };

  const fetchReadingTrends = async () => {
    try {
      const params = {
        TableName: "reading_statistics",
        Select: "ALL_ATTRIBUTES",
      };

      const response = await dynamoDb.scan(params).promise();
      const items = response.Items || [];

      // Sort users by reading time
      const sortedByReadingTime = _.sortBy(items, "total_read_period");

      // Create ranges for visualization (quartiles)
      const ranges = ["0-30 mins", "30-60 mins", "1-2 hours", "2-4 hours", ">4 hours"];

      // Count users in each range
      const userCounts = {
        "0-30 mins": sortedByReadingTime.filter(
          (item) => parseInt(item.total_read_period || 0) <= 30
        ).length,
        "30-60 mins": sortedByReadingTime.filter(
          (item) =>
            parseInt(item.total_read_period || 0) > 30 &&
            parseInt(item.total_read_period || 0) <= 60
        ).length,
        "1-2 hours": sortedByReadingTime.filter(
          (item) =>
            parseInt(item.total_read_period || 0) > 60 &&
            parseInt(item.total_read_period || 0) <= 120
        ).length,
        "2-4 hours": sortedByReadingTime.filter(
          (item) =>
            parseInt(item.total_read_period || 0) > 120 &&
            parseInt(item.total_read_period || 0) <= 240
        ).length,
        ">4 hours": sortedByReadingTime.filter(
          (item) => parseInt(item.total_read_period || 0) > 240
        ).length,
      };

      // Calculate percentage change
      const totalUsers = items.length;
      const usersAboveMedian = sortedByReadingTime.filter(
        (item) =>
          parseInt(item.total_read_period || 0) >
          parseInt(sortedByReadingTime[Math.floor(items.length / 2)].total_read_period || 0)
      ).length;
      const percentageHighEngagement = ((usersAboveMedian / totalUsers) * 100).toFixed(1);

      setReadingTrends({
        labels: ranges,
        datasets: [
          {
            label: "Number of Users",
            data: ranges.map((range) => userCounts[range]),
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 3,
            fill: true,
            maxBarThickness: 6,
          },
        ],
      });

      return percentageHighEngagement;
    } catch (error) {
      console.error("Error fetching reading trends:", error);
      return 0;
    }
  };

  const fetchReadingEngagement = async () => {
    try {
      const params = {
        TableName: "reading_statistics",
        Select: "ALL_ATTRIBUTES",
      };

      const response = await dynamoDb.scan(params).promise();
      const items = response.Items || [];

      // Calculate statistics
      const totalReadingTime = _.sumBy(items, (item) => parseInt(item.total_read_period || 0));
      const avgReadingTime = (totalReadingTime / items.length).toFixed(1);
      const avgBooksPerUser = _.meanBy(items, (item) => parseInt(item.books_read || 0)).toFixed(1);
      const topReaderTime = _.maxBy(items, (item) =>
        parseInt(item.total_read_period || 0)
      ).total_read_period;
      const multiBookReaders = items.filter((item) => parseInt(item.books_read || 0) > 1).length;

      setReadingEngagement({
        avgReadingTime,
        avgBooksPerUser,
        topReaderTime,
        multiBookReaders,
      });
    } catch (error) {
      console.error("Error fetching reading engagement:", error);
    }
  };

  const fetchStatistics = async () => {
    await api
      .get("/analysis/statistic")
      .then((res) => {
        setStatistic(res.data.data);
      })
      .catch((err) => console.log("err :>> ", err));
    await api
      .get("/analysis/school-statistic?limit=10")
      .then((res) => {
        setSchoolStats(res.data.data);
      })
      .catch((err) => console.log("err :>> ", err));
  };

  useEffect(() => {
    fetchStatistics();
    // fetchTopSchools();

    // const loadReadingStats = async () => {
    //   const stats = await fetchReadingStats();
    //   setReadingStats(stats);
    // };

    // loadReadingStats();

    // fetchReadingEngagement();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SoftBox mb={3} p={1}>
              <SoftTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
              >
                general statistics
              </SoftTypography>
            </SoftBox>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Total Books", fontWeight: "bold" }}
                  count={`${statistic.totalBooks}`}
                  percentage={{ color: "success", text: "" }}
                  icon={{ color: "info", component: "menu_book" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Total School", fontWeight: "bold" }}
                  count={`${statistic.totalSchools}`}
                  percentage={{ color: "info", text: "" }}
                  icon={{ color: "info", component: "emoji_events" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Total Read Times", fontWeight: "bold" }}
                  count={`${statistic.totalReadBooks}`}
                  percentage={{ color: "success", text: "" }}
                  icon={{ color: "info", component: "menu_book" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Total Students", fontWeight: "bold" }}
                  count={`${statistic.totalUsers}`}
                  percentage={{ color: "info", text: "" }}
                  icon={{ color: "info", component: "emoji_events" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Total Registered Students", fontWeight: "bold" }}
                  count={`${statistic.totalRegisteredUsers}`}
                  percentage={{
                    color: "success",
                    text: `${(
                      (statistic.totalRegisteredUsers / statistic.totalUsers) *
                      100
                    ).toFixed(1)}%`,
                  }}
                  icon={{ color: "info", component: "quiz" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Total Non-Registered Students", fontWeight: "bold" }}
                  count={`${statistic.totalNonRegisteredUsers}`}
                  percentage={{
                    color: "success",
                    text: `${(
                      (statistic.totalNonRegisteredUsers / statistic.totalUsers) *
                      100
                    ).toFixed(1)}%`,
                  }}
                  icon={{ color: "info", component: "quiz" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Total Read Book", fontWeight: "bold" }}
                  count={statistic.topReadBook}
                  percentage={{ color: "info", text: `${statistic.topReadBookCount}` }}
                  icon={{ color: "info", component: "emoji_events" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Top languags Read", fontWeight: "bold" }}
                  count={statistic.topReadLanguage}
                  percentage={{ color: "info", text: `${statistic.topReadLanguageCount}` }}
                  icon={{ color: "info", component: "emoji_events" }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <SalesTable
              title="Students by School"
              rows={schoolStats.map((stat, index) => ({
                school: stat.school ?? "Unnammed",
                students: stat.count,
                percentage: `${((stat.count / statistic.totalUsers) * 100).toFixed(1)}%`,
              }))}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <ReportsBarChart
              title="Quiz Creation Activity"
              description={
                <>
                  <strong>{readingStats.metrics.totalQuizzes}</strong> total quizzes created
                </>
              }
              chart={readingStats.chart}
              items={readingStats.items}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <GradientLineChart
              title="Reading Time Distribution"
              description={
                <SoftBox display="flex" alignItems="center">
                  <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                    <Icon sx={{ fontWeight: "bold" }}>menu_book</Icon>
                  </SoftBox>
                  <SoftTypography variant="button" color="text" fontWeight="medium">
                    User reading patterns
                    <SoftTypography variant="button" color="text" fontWeight="regular">
                      {" "}
                      distribution
                    </SoftTypography>
                  </SoftTypography>
                </SoftBox>
              }
              chart={readingTrends}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <SoftBox mb={3} p={1}>
              <SoftTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
              >
                User Reading Engagement
              </SoftTypography>
            </SoftBox>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Avg Reading Time", fontWeight: "bold" }}
                  count={`${readingEngagement.avgReadingTime} mins`}
                  icon={{ color: "info", component: "timer" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MiniStatisticsCard
                  title={{ text: "Top Reader", fontWeight: "bold" }}
                  count={`${readingEngagement.topReaderTime} mins`}
                  icon={{ color: "info", component: "person" }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Default;
