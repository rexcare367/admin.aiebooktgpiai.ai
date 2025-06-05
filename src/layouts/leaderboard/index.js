import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Trophy, BookOpen, Clock, Award } from "lucide-react";

// @mui material components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Custom components
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";
import ActionCell from "layouts/rewards/rewards/reward-list/components/ActionCell";
import ProductCell from "layouts/rewards/rewards/reward-list/components/ProductCell";

// Hooks
import { useRewards } from "context/RewardsContext";
import { rewardsApi } from "api/rewardsApi";
import api from "api/axios";

// Define PropTypes for Cell components
const RewardCellWrapper = ({ value }) => <ProductCell image={value.image} name={value.name} />;

RewardCellWrapper.propTypes = {
  value: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const ActionCellWrapper = ({ value }) => <ActionCell {...value} />;

ActionCellWrapper.propTypes = {
  value: PropTypes.shape({
    edit: PropTypes.bool,
    remove: PropTypes.bool,
    rewardId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
  }).isRequired,
};

const StatusCell = ({ value }) => (
  <SoftBadge
    variant="contained"
    color={value === "Active" ? "success" : "secondary"}
    size="xs"
    badgeContent={value}
    container
  />
);

StatusCell.propTypes = {
  value: PropTypes.string.isRequired,
};

const TitleCell = ({ value }) => (
  <SoftTypography variant="button" color="text" fontWeight="medium">
    {value}
  </SoftTypography>
);

TitleCell.propTypes = {
  value: PropTypes.string.isRequired,
};

const DateCell = ({ value }) => (
  <SoftTypography variant="caption" color="secondary" fontWeight="medium">
    {new Date(value).toLocaleDateString()}
  </SoftTypography>
);

DateCell.propTypes = {
  value: PropTypes.string.isRequired,
};

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

const defaultLeaderboardData = {
  top_readers: [],
  top_reading_time: [],
  top_quiz_scores: [],
};

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(defaultLeaderboardData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRewards, setSelectedRewards] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, rewardId: null });
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [tableData, setTableData] = useState({
    columns: [
      {
        Header: "reward",
        accessor: "reward",
        width: "40%",
        Cell: RewardCellWrapper,
      },
      {
        Header: "title",
        accessor: "title",
        Cell: TitleCell,
      },
      {
        Header: "status",
        accessor: "status",
        Cell: StatusCell,
      },
      {
        Header: "createdAt",
        accessor: "createdAt",
        Cell: DateCell,
      },
      {
        Header: "action",
        accessor: "action",
        Cell: ActionCellWrapper,
      },
    ],
    rows: [],
  });

  const [activeTab, setActiveTab] = useState("readers");

  const tabs = [
    {
      id: "readers",
      label: "Top Readers",
      shortLabel: "Readers",
      icon: (
        <BookOpen
          className={`h-4 w-4 ${activeTab === "readers" ? "text-emerald-500" : "text-slate-500"}`}
        />
      ),
    },
    {
      id: "time",
      label: "Reading Time",
      shortLabel: "Time",
      icon: (
        <Clock className={`h-4 w-4 ${activeTab === "time" ? "text-blue-500" : "text-slate-500"}`} />
      ),
    },
    {
      id: "quiz",
      label: "Quiz Scores",
      shortLabel: "Quiz",
      icon: (
        <Award
          className={`h-4 w-4 ${activeTab === "quiz" ? "text-purple-500" : "text-slate-500"}`}
        />
      ),
    },
  ];

  const handleGetLeaderboard = async () => {
    try {
      setError(null);
      const response = await api.get(`/ebooks/leaderboard/get`);

      if (!response.data || !response.data.data) {
        console.error("Invalid API response structure:", response.data);
        throw new Error("Invalid data received from server");
      }

      const data = response.data.data;

      // Validate the data structure
      if (!data.top_readers || !data.top_reading_time || !data.top_quiz_scores) {
        console.error("Missing required data fields:", data);
        throw new Error("Incomplete data received from server");
      }

      setLeaderboard({
        top_readers: Array.isArray(data.top_readers) ? data.top_readers : [],
        top_reading_time: Array.isArray(data.top_reading_time) ? data.top_reading_time : [],
        top_quiz_scores: Array.isArray(data.top_quiz_scores) ? data.top_quiz_scores : [],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch leaderboard data";
      console.error("Leaderboard Error:", error);
      setError(errorMessage);
      // toast.error(errorMessage);
      setLeaderboard(defaultLeaderboardData);
    } finally {
      setIsLoading(false);
    }
  };

  // Add these new functions in your RewardsList component
  function searchRewards(rewards, searchTerm) {
    if (!searchTerm) return rewards;

    const searchLower = searchTerm.toLowerCase();

    return (
      rewards &&
      rewards.filter((reward) => {
        // Search in basic fields
        const basicMatch = [
          reward.name,
          reward.description,
          reward.status,
          reward.points.toString(),
          new Date(reward.createdAt).toLocaleDateString(),
        ].some((field) => field?.toLowerCase().includes(searchLower));

        if (basicMatch) return true;

        // Search in requirements
        const requirementsMatch = Object.entries(reward.requirements).some(([key, value]) => {
          const formattedKey = key.replace(/_/g, " ");
          return (
            formattedKey.toLowerCase().includes(searchLower) ||
            value.toString().toLowerCase().includes(searchLower)
          );
        });

        return requirementsMatch;
      })
    );
  }

  // Filter rewards based on status and search term
  // const filteredRewards = useMemo(() => {
  //   if (!rewards) return [];

  //   let filtered = rewards;

  //   // Apply status filter
  //   if (statusFilter !== "all") {
  //     filtered = filtered.filter((reward) => reward.status === statusFilter);
  //   }

  //   // Apply search if there's a search term
  //   if (searchTerm) {
  //     filtered = searchRewards(filtered, searchTerm);
  //   }

  //   return filtered;
  // }, [statusFilter, searchTerm]);

  // Sort rewards
  // const sortedRewards = useMemo(() => {
  //   if (!sortConfig.key) return filteredRewards;

  //   return [...filteredRewards].sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key]) {
  //       return sortConfig.direction === "asc" ? -1 : 1;
  //     }
  //     if (a[sortConfig.key] > b[sortConfig.key]) {
  //       return sortConfig.direction === "asc" ? 1 : -1;
  //     }
  //     return 0;
  //   });
  // }, [filteredRewards, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    switch (action) {
      case "delete":
        setDeleteDialog({
          open: true,
          rewardIds: selectedRewards,
        });
        break;
      case "export":
        exportToExcel(selectedRewards);
        break;
      default:
        break;
    }
    setBulkActionAnchor(null);
  };

  // Export to Excel
  const exportToExcel = (rewardIds) => {
    const rewardsToExport =
      rewardIds.length > 0 ? rewards.filter((r) => rewardIds.includes(r.rewardId)) : rewards;

    const worksheet = XLSX.utils.json_to_sheet(
      rewardsToExport.map((reward) => ({
        Title: reward.title,
        Description: reward.description,
        Status: reward.status,
        CreatedAt: new Date(reward.createdAt).toLocaleDateString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rewards");
    XLSX.writeFile(workbook, "rewards.xlsx");
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      if (deleteDialog.rewardIds) {
        // Bulk delete
        await rewardsApi.bulkDeleteRewards(deleteDialog.rewardIds);
      } else {
        // Single delete
        await rewardsApi.deleteReward(deleteDialog.rewardId);
      }

      await fetchRewards();
      setSelectedRewards([]);
      setDeleteDialog({ open: false, rewardId: null, rewardIds: null });
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    handleGetLeaderboard();
  }, []);

  const TopReadersSection = () => {
    return (
      <section className="leaderboard-section">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Top Readers</h2>
        </div>

        <div className="space-y-6">
          {leaderboard?.top_readers.map((reader, index) => (
            <div
              key={`${index}-${reader.name}`}
              className="grid grid-cols-4  items-center border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0"
            >
              <div className="items-center gap-4 col-span-1 hidden lg:flex">
                <UserAvatar rank={index + 1} color="border-emerald-500" />
                <p className="font-medium text-slate-800 dark:text-slate-100">{reader.user_ic}</p>
              </div>

              <div className="flex items-center gap-4 col-span-3 lg:col-span-2">
                <img src={reader.avatar_url} alt="avatar" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="block lg:hidden font-medium text-slate-800 dark:text-slate-100">
                    {reader.user_ic}
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-xs lg:text-lg">
                    {reader.name ?? "Test-User"}
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
                  {reader.total_read_books}
                </span>
                <span className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">
                  Books Read
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const TopReadingTimeSection = () => {
    return (
      <section className="leaderboard-section">
        <div className="section-header">
          <Clock size={24} className="text-blue-500" />
          <h2 className="section-title">Top Reading Time</h2>
        </div>
        <div className="space-y-6">
          {leaderboard?.top_reading_time.map((reader, index) => (
            <div
              key={`${index}-${reader.name}`}
              className="grid grid-cols-4  items-center border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0"
            >
              <div className="items-center gap-4 col-span-1 hidden lg:flex">
                <UserAvatar rank={index + 1} color="border-blue-500" />
                <p className="font-medium text-slate-800 dark:text-slate-100">{reader.user_ic}</p>
              </div>

              <div className="flex items-center gap-4 col-span-3 lg:col-span-2">
                <img src={reader.avatar_url} alt="avatar" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="block lg:hidden font-medium text-slate-800 dark:text-slate-100">
                    {reader.user_ic}
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-xs lg:text-lg">
                    {reader.name ?? "Test-User"}
                  </p>
                  {reader.school && (
                    <p className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">
                      {reader.school ?? "Test-School"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-1">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  {reader.total_read_period}
                </span>
                <span className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">
                  Reading Time
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const TopQuizScoresSection = () => {
    return (
      <section className="leaderboard-section">
        <div className="section-header">
          <Trophy size={24} className="text-purple-500" />
          <h2 className="section-title">Top Quiz Scores</h2>
        </div>
        <div className="space-y-6">
          {leaderboard?.top_quiz_scores.map((reader, index) => (
            <div
              key={`${index}-${reader.name}`}
              className="grid grid-cols-4  items-center border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0"
            >
              <div className="items-center gap-4 col-span-1 hidden lg:flex">
                <UserAvatar rank={index + 1} color="border-purple-500" />
                <p className="font-medium text-slate-800 dark:text-slate-100">{reader.user_ic}</p>
              </div>

              <div className="flex items-center gap-4 col-span-3 lg:col-span-2">
                <img src={reader.avatar_url} alt="avatar" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="block lg:hidden font-medium text-slate-800 dark:text-slate-100">
                    {reader.user_ic}
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-xs lg:text-lg">
                    {reader.name ?? "Test-User"}
                  </p>
                  {reader.school && (
                    <p className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">
                      {reader.school ?? "Test-School"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-1">
                <Trophy className="h-5 w-5 text-purple-500" />
                <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  {reader.score}
                </span>
                <span className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">
                  pts
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
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
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

            <div className="mt-6">
              {isLoading ? (
                "loading"
              ) : (
                <React.Fragment>
                  {activeTab === "readers" && <TopReadersSection />}
                  {activeTab === "time" && <TopReadingTimeSection />}
                  {activeTab === "quiz" && <TopQuizScoresSection />}
                </React.Fragment>
              )}
            </div>
          </SoftBox>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SoftBox>
              <SoftTypography variant="h5" fontWeight="medium">
                All Rewards ({tableData.rows.length})
              </SoftTypography>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                Manage your reward catalog and point system
              </SoftTypography>
            </SoftBox>

            <Stack direction="row" spacing={2} alignItems="center">
              {/* Status Filter */}
              <SoftBox className="min-w-[150px]">
                <FormControl size="small" fullWidth>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </SoftBox>

              {/* Bulk Actions */}
              {/* {selectedRewards.length > 0 && (
                <SoftButton
                  variant="outlined"
                  color="dark"
                  size="small"
                  onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                >
                  Bulk Actions ({selectedRewards.length})
                </SoftButton>
              )} */}

              {/* Export Button */}
              <SoftButton
                variant="outlined"
                color="info"
                size="small"
                onClick={() => exportToExcel([])}
              >
                <Icon>file_download</Icon>&nbsp; export all
              </SoftButton>

              {/* New Reward Button */}
              <Link to="/rewards/rewards/new-reward">
                <SoftButton variant="gradient" color="info" size="small">
                  <Icon>add</Icon>&nbsp; new reward
                </SoftButton>
              </Link>
            </Stack>
          </SoftBox>

          {/* {error ? (
            <SoftBox p={3}>
              <SoftTypography variant="button" color="error" fontWeight="regular">
                Error loading rewards: {error}
              </SoftTypography>
            </SoftBox>
          ) : (
            <DataTable
              table={tableData}
              entriesPerPage={{
                defaultValue: 7,
                entries: [5, 7, 10, 15, 20, 25],
              }}
              canSearch
              searching={searchTerm}
              onSearchChange={(value) => setSearchTerm(value)}
              loading={loading}
              noEndBorder
              onSort={requestSort}
              sorted={sortConfig}
              selectedRows={selectedRewards}
              onSelectRow={setSelectedRewards}
            />
          )} */}
        </Card>
      </SoftBox>

      {/* Bulk Actions Menu */}
      {/* <Menu
        anchorEl={bulkActionAnchor}
        open={Boolean(bulkActionAnchor)}
        onClose={() => setBulkActionAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction("delete")}>
          <Icon color="error">delete</Icon>
          <SoftTypography variant="button" color="error" sx={{ ml: 1 }}>
            Delete Selected
          </SoftTypography>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction("export")}>
          <Icon>file_download</Icon>
          <SoftTypography variant="button" sx={{ ml: 1 }}>
            Export Selected
          </SoftTypography>
        </MenuItem>
      </Menu> */}

      <Footer />
    </DashboardLayout>
  );
}

export default Leaderboard;
