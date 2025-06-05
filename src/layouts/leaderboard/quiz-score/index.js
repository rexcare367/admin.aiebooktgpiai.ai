import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import LoadingSpinner from "components/LoadingSpinner";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API
import api from "api/axios";

// Components
import TabNavigation from "./components/TabNavigation";
import TopReadersSection from "./components/TopReadersSection";

const defaultLeaderboardData = [];

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(defaultLeaderboardData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("student");

  const handleGetLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(
        `/ebooks/leaderboard/get?org=quiz_scores&group=${activeTab}&limit=10`
      );

      if (!response.data || !response.data.data) {
        console.error("Invalid API response structure:", response.data);
        throw new Error("Invalid data received from server");
      }

      const data = response.data.data;
      setLeaderboard(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch leaderboard data";
      console.error("Leaderboard Error:", error);
      setError(errorMessage);
      setLeaderboard(defaultLeaderboardData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetLeaderboard();
  }, [activeTab]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      leaderboard.map((reader) => ({
        "User IC": reader.user_ic,
        Name: reader.name,
        School: reader.school || "N/A",
        "Quiz Score (%)": reader.value,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leaderboard");
    XLSX.writeFile(workbook, `quiz_score_leaderboard_${activeTab}.xlsx`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          <SoftBox>
            <div className="">
              <div className="p-4">
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              </div>

              <div className="p-4">
                {isLoading ? (
                  <LoadingSpinner message="Loading leaderboard data..." />
                ) : error ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Icon className="text-red-500 mb-4" fontSize="large">
                      error
                    </Icon>
                    <SoftTypography variant="h6" color="error" fontWeight="medium">
                      {error}
                    </SoftTypography>
                    <SoftButton
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={handleGetLeaderboard}
                      className="mt-4"
                    >
                      Try Again
                    </SoftButton>
                  </div>
                ) : (
                  <TopReadersSection
                    leaderboard={leaderboard}
                    activeTab={activeTab}
                    onExport={exportToExcel}
                  />
                )}
              </div>
            </div>
          </SoftBox>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Leaderboard;
