import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BookOpen, Clock } from "lucide-react";
import * as XLSX from "xlsx";

// @mui material components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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

const defaultLeaderboardData = [];

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(defaultLeaderboardData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("student");

  const tabs = [
    {
      id: "student",
      label: "Student",
      shortLabel: "Student",
      icon: (
        <BookOpen
          className={`h-4 w-4 ${activeTab === "student" ? "text-emerald-500" : "text-slate-500"}`}
        />
      ),
    },
    {
      id: "school",
      label: "School",
      shortLabel: "School",
      icon: (
        <Clock
          className={`h-4 w-4 ${activeTab === "school" ? "text-blue-500" : "text-slate-500"}`}
        />
      ),
    },
  ];

  const handleGetLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(
        `/ebooks/leaderboard/get?org=read_books&group=${activeTab}&limit=10`
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

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      leaderboard.map((reader) => ({
        "User IC": reader.user_ic,
        Name: reader.name,
        School: reader.school || "N/A",
        "Books Read": reader.value,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leaderboard");
    XLSX.writeFile(workbook, `leaderboard_${activeTab}.xlsx`);
  };

  const TopReadersSection = () => {
    return (
      <section className="leaderboard-section">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Read Books</h2>
        </div>

        <div className="space-y-6">
          {leaderboard?.map((reader, index) => (
            <div
              key={`${index}-${reader.name}`}
              className="grid grid-cols-4  items-center border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0"
            >
              <div className="items-center gap-4 col-span-1 hidden lg:flex">
                <UserAvatar rank={index + 1} color="border-emerald-500" />
                <p className="font-medium text-slate-800 dark:text-slate-100">{reader?.user_ic}</p>
              </div>

              <div className="flex items-center gap-4 col-span-3 lg:col-span-2">
                {reader?.avatar_url ? (
                  <img src={reader?.avatar_url} alt="avatar" className="w-12 h-12 rounded-full" />
                ) : (
                  <img src={`/${activeTab}.png`} alt="avatar" className="w-12 h-12 rounded-full" />
                )}
                <div>
                  <p className="block lg:hidden font-medium text-slate-800 dark:text-slate-100">
                    {reader?.user_ic}
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-xs lg:text-lg">
                    {reader.name ?? `Test-${activeTab}`}
                  </p>
                  {reader.school && (
                    <p className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">
                      {reader.school ?? "Test-School"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-1">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  {reader.value}
                </span>
                <span className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">
                  Books
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          <SoftBox>
            <div className="">
              <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 py-3 px-2 rounded-md transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-slate-800 shadow-sm"
                        : "hover:bg-white/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline font-medium text-sm">{tab.label}</span>
                    <span className="sm:hidden font-medium text-sm">{tab.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-end mb-4">
                <SoftButton variant="outlined" color="info" size="small" onClick={exportToExcel}>
                  <Icon>file_download</Icon>&nbsp; Export to Excel
                </SoftButton>
              </div>
              {isLoading ? (
                <LoadingSpinner message="Loading leaderboard data..." />
              ) : (
                <TopReadersSection />
              )}
            </div>
          </SoftBox>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Leaderboard;
