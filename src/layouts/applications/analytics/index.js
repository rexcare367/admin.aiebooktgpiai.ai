/**
=========================================================
* AI EBOOK DASHBOARD React - v4.0.3
=========================================================
*/

import { useState, useEffect } from "react";
import AWS from 'aws-sdk';
import { dynamoDb } from '../../../config/aws-config';
import jsPDF from 'jspdf';

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftBadgeDot from "components/SoftBadgeDot";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexReportsDoughnutChart from "examples/Charts/DoughnutCharts/ComplexReportsDoughnutChart";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import HorizontalBarChart from "examples/Charts/BarCharts/HorizontalBarChart";
import PieChart from "examples/Charts/PieChart";
import RadarChart from "examples/Charts/RadarChart";
import PolarChart from "examples/Charts/PolarChart";

function Analytics() {
  // Existing states
  const [userCount, setUserCount] = useState(0);
  const [icCount, setIcCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [ebookCount, setEbookCount] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');

  // New states for additional analytics
  const [schoolDistribution, setSchoolDistribution] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [readingStats, setReadingStats] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [quizPerformance, setQuizPerformance] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [popularBooks, setPopularBooks] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [readingMetrics, setReadingMetrics] = useState({
    avgTime: 0,
    totalHours: 0,
    activeReaders: 0,
    quizCompletion: 0
  });

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const handleMenuClick = (days) => {
    setSelectedTimeRange(days);
    closeMenu();
  };

  const renderMenu = (
    <Menu
      anchorEl={menu}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem onClick={() => handleMenuClick('1')}>Yesterday</MenuItem>
      <MenuItem onClick={() => handleMenuClick('7')}>Last 7 days</MenuItem>
      <MenuItem onClick={() => handleMenuClick('30')}>Last 30 days</MenuItem>
    </Menu>
  );

  const getDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - parseInt(days));
    return { start, end };
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  // New helper functions for analytics
  const processSchoolDistribution = (icData) => {
    const schoolCounts = {};
    icData.forEach(item => {
      const school = item.school || 'Other';
      schoolCounts[school] = (schoolCounts[school] || 0) + 1;
    });

    // Get top schools
    const sortedSchools = Object.entries(schoolCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4);

    return {
      labels: sortedSchools.map(([school]) => school),
      datasets: [{
        label: "Students",
        data: sortedSchools.map(([, count]) => count),
        backgroundColor: ["#1A73E8", "#4CAF50", "#FB8C00", "#344767"]
      }]
    };
  };

  const processReadingStats = (readingHistory) => {
    const hourlyData = Array(24).fill(0);
    readingHistory.forEach(record => {
      const hour = new Date(record.started_time).getHours();
      hourlyData[hour] += record.duration || 0;
    });

    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        label: "Reading Duration (minutes)",
        data: hourlyData,
        backgroundColor: "#1A73E8",
        borderColor: "#1A73E8",
        fill: true
      }]
    };
  };

  // Updated processUserReadingMetrics function
  const processUserReadingMetrics = (readingStats) => {
    if (!readingStats?.length) {
      return {
        labels: ['No reading data'],
        datasets: [{
          label: "Reading Duration",
          data: [0],
          backgroundColor: ["#1A73E8"]
        }]
      };
    }

    // Process and sort users by reading time
    const userData = readingStats
      .map(stat => ({
        userId: stat.user_ic,
        readingTime: parseInt(stat.total_read_period) || 0  // Convert to number and handle NaN
      }))
      .filter(user => user.readingTime > 0)  // Filter out users with 0 reading time
      .sort((a, b) => b.readingTime - a.readingTime);  // Sort by reading time

    // Return default state if no valid data
    if (userData.length === 0) {
      return {
        labels: ['No reading data'],
        datasets: [{
          label: "Reading Duration",
          data: [0],
          backgroundColor: ["#1A73E8"]
        }]
      };
    }

    // Create chart data
    return {
      labels: userData.map(user => `User ${user.userId.slice(-4)}`),
      datasets: [{
        label: "Total Reading Minutes",
        data: userData.map(user => user.readingTime),
        backgroundColor: [
          "#1A73E8",  // Primary blue
          "#4CAF50",  // Success green
          "#FB8C00",  // Warning orange
          "#E91E63",  // Pink
          "#9C27B0",  // Purple
          "#00BCD4",  // Cyan
          "#78909C",  // Grey
          "#FF5722",  // Deep Orange
          "#607D8B"   // Blue Grey
        ]
      }]
    };
  };

  // Helper function to format book titles
  const formatBookTitle = (fileKey) => {
    if (!fileKey) return 'Unknown Book';

    // Remove file extension
    const nameWithoutExt = fileKey.replace(/\.[^/.]+$/, '');

    // Remove special characters and split
    const parts = nameWithoutExt
      .replace(/[_-]/g, ' ')
      .split(' ')
      .filter(part => part.trim());

    // Take first 4 parts and format
    return parts
      .slice(0, 4)
      .map(word => word.toLowerCase())
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Replace the existing calculateReadingMetrics function with this updated version
const calculateReadingMetrics = (readingHistory, readingStats, quizzes) => {
  // Calculate total duration from reading_history
  const totalDuration = readingHistory.reduce((acc, record) => acc + (record.duration || 0), 0);
  
  // Calculate unique active users
  const activeUsers = new Set(readingHistory.map(record => record.user_ic)).size;
  const totalUsers = new Set(readingStats.map(stat => stat.user_ic)).size || 1; // prevent division by zero
  
  // Calculate users who have taken quizzes
  const usersWithQuizzes = new Set(quizzes.map(quiz => quiz.user_ic)).size;
  
  // Calculate metrics
  const avgTimePerUser = Math.round(totalDuration / totalUsers); // average minutes per user
  const totalReadingHours = Math.round(totalDuration / 60); // convert minutes to hours
  const quizCompletionRate = Math.round((usersWithQuizzes / totalUsers) * 100); // percentage of users who have taken quizzes
  
  // console.log('Active Users:', activeUsers);
  // console.log('Total Users:', totalUsers);
  // console.log('Users with Quizzes:', usersWithQuizzes);
  // console.log('Avg. Reading Time:', avgTimePerUser);
  // console.log('Total Reading Hours:', totalReadingHours);
  // console.log('Quiz Completion Rate:', quizCompletionRate);

  return {
    avgTime: avgTimePerUser,
    totalHours: totalReadingHours,
    activeReaders: Math.round((activeUsers / totalUsers) * 100),
    quizCompletion: quizCompletionRate
  };
};

  // Modified useEffect for data fetching
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      const timeRange = getDateRange(selectedTimeRange);
  
      try {
  
        // Configure AWS
        AWS.config.update({
          region: process.env.REACT_APP_AWS_REGION,
          credentials: new AWS.Credentials(
            process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
          )
        });

        // Fetch Users data
        const cognitoProvider = new AWS.CognitoIdentityServiceProvider();
        
        // Fetch all the data in parallel
        const [
          usersResponse,
          icResponse,
          quizResponse,
          ebookResponse,
          readingHistoryResponse,
          readingStatsResponse
        ] = await Promise.all([
          cognitoProvider.listUsers({
            UserPoolId: process.env.REACT_APP_USER_POOL_ID
          }).promise(),
          dynamoDb.scan({
            TableName: 'IC_Numbers'
          }).promise(),
          dynamoDb.scan({
            TableName: 'quizzes'
          }).promise(),
          dynamoDb.scan({
            TableName: 'ebook-store'
          }).promise(),
          dynamoDb.scan({
            TableName: 'reading_history'
          }).promise(),
          dynamoDb.scan({
            TableName: 'reading_statistics'
          }).promise()
        ]);

        const userDates = usersResponse.Users.map(user => formatDate(user.UserCreateDate));
        setUserCount(usersResponse.Users.length);

        // Fetch IC data
        const icDates = icResponse.Items.map(item => formatDate(item.createdAt));
        setIcCount(icResponse.Items.length);
        
        // Process school distribution
        setSchoolDistribution(processSchoolDistribution(icResponse.Items));

        // Fetch Quiz data
        const quizDates = quizResponse.Items.map(item => formatDate(item.created_time));
        setQuizCount(quizResponse.Items.length);

        // Fetch Ebook data
        const ebookDates = ebookResponse.Items.map(item => formatDate(item.upload_time));
        setEbookCount(ebookResponse.Items.length);
        
        // Process reading related data
        // console.log('Reading Stats Response:', readingStatsResponse.Items);
        // console.log('Ebook Response:', ebookResponse.Items);
        setReadingStats(processReadingStats(readingHistoryResponse.Items));
        
        // Updated data fetching section
        // console.log('Raw Reading Stats:', readingStatsResponse.Items);
        const readingData = processUserReadingMetrics(readingStatsResponse.Items);
        // console.log('Processed Reading Data:', readingData);
        setPopularBooks(readingData);

        setReadingMetrics(calculateReadingMetrics(
          readingHistoryResponse.Items,
          readingStatsResponse.Items,
          quizResponse.Items // Pass quiz data to the calculation function
        ));

        // Generate dates array for the selected time range
        const dates = [];
        for (let d = new Date(timeRange.start); d <= timeRange.end; d.setDate(d.getDate() + 1)) {
          dates.push(formatDate(d));
        }

        // Process data for each date
        const processDataForDates = (allDates, dates) => {
          return dates.map(date => 
            allDates.filter(d => d === date).length
          );
        };

        // Create chart data for main activity chart
        const chartData = {
          labels: dates,
          datasets: [
            {
              label: "Users",
              data: processDataForDates(userDates, dates),
              borderColor: "#1A73E8",
              tension: 0.4,
              fill: false
            },
            {
              label: "Registered ICs",
              data: processDataForDates(icDates, dates),
              borderColor: "#344767",
              tension: 0.4,
              fill: false
            },
            {
              label: "Quizzes",
              data: processDataForDates(quizDates, dates),
              borderColor: "#4CAF50",
              tension: 0.4,
              fill: false
            },
            {
              label: "Ebooks",
              data: processDataForDates(ebookDates, dates),
              borderColor: "#FB8C00",
              tension: 0.4,
              fill: false
            }
          ]
        };

        setChartData(chartData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [selectedTimeRange]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Analytics Report", 20, 20);
    doc.text(`Users: ${userCount}`, 20, 30);
    doc.text(`Registered ICs: ${icCount}`, 20, 40);
    doc.text(`Quizzes: ${quizCount}`, 20, 50);
    doc.text(`Ebooks: ${ebookCount}`, 20, 60);
    doc.text(`Avg. Reading Time: ${readingMetrics.avgTime} mins`, 20, 70);
    doc.text(`Total Reading Hours: ${readingMetrics.totalHours}h`, 20, 80);
    doc.text(`Active Readers: ${readingMetrics.activeReaders}%`, 20, 90);
    doc.text(`Quiz Completion: ${readingMetrics.quizCompletion}%`, 20, 100);
    doc.save('analytics-report.pdf');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {/* Top Control Bar */}
        <SoftBox display="flex" justifyContent="flex-end" mb={3} ml={2}>
          <SoftBox mr={3}>
            <SoftButton variant="outlined" color="secondary" onClick={exportToPDF}>
              export&nbsp;&nbsp;
              <Icon>folder</Icon>
            </SoftButton>
          </SoftBox>
          <SoftButton variant="gradient" color="dark" onClick={openMenu}>
            {selectedTimeRange === '1' ? 'Yesterday' : selectedTimeRange === '7' ? 'Last 7 days' : 'Last 30 days'}
            &nbsp;
            <Icon>expand_more</Icon>
          </SoftButton>
          {renderMenu}
        </SoftBox>

        {/* Main Statistics Cards */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "users", fontWeight: "medium" }}
                count={userCount.toString()}
                // percentage={{ color: "success", text: "+55%" }}
                icon={{ color: "dark", component: "account_circle" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "registered ICs", fontWeight: "medium" }}
                count={icCount.toString()}
                // percentage={{ color: "success", text: "+3%" }}
                icon={{ color: "dark", component: "public" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "quizzes", fontWeight: "medium" }}
                count={quizCount.toString()}
                // percentage={{ color: "success", text: "-2%" }}
                icon={{ color: "dark", component: "watch" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "ebooks", fontWeight: "medium" }}
                count={ebookCount.toString()}
                // percentage={{ color: "success", text: "+5%" }}
                icon={{ color: "dark", component: "image" }}
              />
            </Grid>
          </Grid>
        </SoftBox>

        {/* Reading Metrics Cards */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Avg. Reading Time", fontWeight: "medium" }}
                count={`${readingMetrics.avgTime} mins`}
                // percentage={{ color: "success", text: "+12%" }}
                icon={{ color: "info", component: "timer" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Total Reading Hours", fontWeight: "medium" }}
                count={`${readingMetrics.totalHours}h`}
                // percentage={{ color: "success", text: "+8%" }}
                icon={{ color: "info", component: "menu_book" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Active Readers", fontWeight: "medium" }}
                count={`${readingMetrics.activeReaders}%`}
                // percentage={{ color: "error", text: "-2%" }}
                icon={{ color: "info", component: "groups" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Quiz Completion", fontWeight: "medium" }}
                count={`${readingMetrics.quizCompletion}%`}
                // percentage={{ color: "success", text: "+5%" }}
                icon={{ color: "info", component: "quiz" }}
              />
            </Grid>
          </Grid>
        </SoftBox>

        {/* Charts Section 1 */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            {/* Activity Timeline Chart */}
            <Grid item xs={12} lg={7}>
              {isLoading ? (
                <SoftBox display="flex" justifyContent="center" alignItems="center" p={6}>
                  Loading...
                </SoftBox>
              ) : error ? (
                <SoftBox display="flex" justifyContent="center" alignItems="center" p={6}>
                  Error: {error}
                </SoftBox>
              ) : (
                <DefaultLineChart
                  title="Activity Over Time"
                  description={
                    <SoftBox display="flex" ml={-1}>
                      <SoftBadgeDot color="info" size="sm" badgeContent="Users" />
                      <SoftBadgeDot color="dark" size="sm" badgeContent="Registered ICs" />
                      <SoftBadgeDot color="success" size="sm" badgeContent="Quizzes" />
                      <SoftBadgeDot color="warning" size="sm" badgeContent="Ebooks" />
                    </SoftBox>
                  }
                  chart={chartData}
                />
              )}
            </Grid>

            {/* Removed Book Categories Chart */}
            {/* <Grid item xs={12} lg={5}>
              <ComplexReportsDoughnutChart
                title="Book Categories"
                description={
                  <SoftBox display="flex" ml={-1}>
                    <SoftBadgeDot color="info" size="sm" badgeContent="Distribution" />
                  </SoftBox>
                }
                chart={bookCategories}
                tooltip="Distribution of books across categories"
              />
            </Grid> */}
          </Grid>
        </SoftBox>

        {/* Charts Section 2 */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            {/* Reading Stats Chart */}
            <Grid item xs={12} lg={6}>
              <VerticalBarChart
                title="Reading Time Distribution"
                description={
                  <SoftBox display="flex" ml={-1}>
                    <SoftBadgeDot color="info" size="sm" badgeContent="Reading Minutes" />
                  </SoftBox>
                }
                chart={readingStats}
              />
            </Grid>

            {/* School Distribution Chart */}
            <Grid item xs={12} lg={6}>
              <HorizontalBarChart
                title="Top Schools"
                description={
                  <SoftBox display="flex" ml={-1}>
                    <SoftBadgeDot color="info" size="sm" badgeContent="Student Count" />
                  </SoftBox>
                }
                chart={schoolDistribution}
              />
            </Grid>
          </Grid>
        </SoftBox>

        {/* Charts Section 3 */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            {/* User Reading Time Distribution Chart */}
            {/* <Grid item xs={12} lg={6}>
              <PieChart
                title="User Reading Time Distribution"
                description={
                  <SoftBox display="flex" ml={-1}>
                    <SoftBadgeDot color="info" size="sm" badgeContent="Total Reading Minutes" />
                  </SoftBox>
                }
                chart={popularBooks}
              />
            </Grid> */}
          </Grid>
        </SoftBox>

      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;