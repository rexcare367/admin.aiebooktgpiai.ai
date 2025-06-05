import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';

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

// Define PropTypes for Cell components
const RewardCellWrapper = ({ value }) => (
  <ProductCell image={value.image} name={value.name} />
);

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

function RewardsList() {
  const { rewards, fetchRewards, loading, error, deleteReward } = useRewards();
  const [selectedRewards, setSelectedRewards] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, rewardId: null });
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [tableData, setTableData] = useState({
    columns: [
      { 
        Header: "reward", 
        accessor: "reward", 
        width: "40%", 
        Cell: RewardCellWrapper
      },
      { 
        Header: "title", 
        accessor: "title",
        Cell: TitleCell
      },
      { 
        Header: "status", 
        accessor: "status",
        Cell: StatusCell
      },
      { 
        Header: "createdAt", 
        accessor: "createdAt",
        Cell: DateCell
      },
      { 
        Header: "action", 
        accessor: "action", 
        Cell: ActionCellWrapper
      }
    ],
    rows: []
  });

  // Add these new functions in your RewardsList component
  function searchRewards(rewards, searchTerm) {
    if (!searchTerm) return rewards;

    const searchLower = searchTerm.toLowerCase();

    return rewards.filter(reward => {
      // Search in basic fields
      const basicMatch = [
        reward.name,
        reward.description,
        reward.status,
        reward.points.toString(),
        new Date(reward.createdAt).toLocaleDateString()
      ].some(field => 
        field?.toLowerCase().includes(searchLower)
      );

      if (basicMatch) return true;

      // Search in requirements
      const requirementsMatch = Object.entries(reward.requirements).some(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ');
        return (
          formattedKey.toLowerCase().includes(searchLower) ||
          value.toString().toLowerCase().includes(searchLower)
        );
      });

      return requirementsMatch;
    });
  }

  // Filter rewards based on status and search term
  const filteredRewards = useMemo(() => {
    if (!rewards) return [];

    let filtered = rewards;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(reward => reward.status === statusFilter);
    }

    // Apply search if there's a search term
    if (searchTerm) {
      filtered = searchRewards(filtered, searchTerm);
    }

    return filtered;
  }, [rewards, statusFilter, searchTerm]);

  // Sort rewards
  const sortedRewards = useMemo(() => {
    if (!sortConfig.key) return filteredRewards;

    return [...filteredRewards].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredRewards, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        setDeleteDialog({ 
          open: true, 
          rewardIds: selectedRewards 
        });
        break;
      case 'export':
        exportToExcel(selectedRewards);
        break;
      default:
        break;
    }
    setBulkActionAnchor(null);
  };

  // Export to Excel
  const exportToExcel = (rewardIds) => {
    const rewardsToExport = rewardIds.length > 0 
      ? rewards.filter(r => rewardIds.includes(r.rewardId))
      : rewards;

    const worksheet = XLSX.utils.json_to_sheet(
      rewardsToExport.map(reward => ({
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
      console.error('Delete error:', err);
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  useEffect(() => {
    if (sortedRewards) {
      console.log('sortedRewards:', sortedRewards); // Debug log
      
      const formattedRows = sortedRewards.map(reward => {
        console.log('Processing reward:', reward); // Debug log for each reward
        
        return {
          id: reward.rewardId,
          reward: { 
            image: reward.badge, 
            name: reward.title 
          },
          title: reward.title,
          status: reward.status,
          createdAt: reward.createdAt,
          action: { 
            edit: true, 
            remove: true,
            rewardId: reward.rewardId,
            onDelete: () => setDeleteDialog({ open: true, rewardId: reward.rewardId })
          }
        };
      });

      console.log('Formatted rows:', formattedRows); // Debug log formatted data

      setTableData(prev => ({
        ...prev,
        rows: formattedRows
      }));
    }
  }, [sortedRewards]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
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
              {selectedRewards.length > 0 && (
                <SoftButton
                  variant="outlined"
                  color="dark"
                  size="small"
                  onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                >
                  Bulk Actions ({selectedRewards.length})
                </SoftButton>
              )}

              {/* Export Button */}
              <SoftButton 
                variant="outlined" 
                color="info" 
                size="small"
                onClick={() => exportToExcel([])}
              >
                <Icon>file_download</Icon>&nbsp;
                export all
              </SoftButton>

              {/* New Reward Button */}
              <Link to="/rewards/rewards/new-reward">
                <SoftButton variant="gradient" color="info" size="small">
                  <Icon>add</Icon>&nbsp;
                  new reward
                </SoftButton>
              </Link>
            </Stack>
          </SoftBox>

          {error ? (
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
          )}
        </Card>
      </SoftBox>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionAnchor}
        open={Boolean(bulkActionAnchor)}
        onClose={() => setBulkActionAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction('delete')}>
          <Icon color="error">delete</Icon>
          <SoftTypography variant="button" color="error" sx={{ ml: 1 }}>
            Delete Selected
          </SoftTypography>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('export')}>
          <Icon>file_download</Icon>
          <SoftTypography variant="button" sx={{ ml: 1 }}>
            Export Selected
          </SoftTypography>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={() => {
          setDeleteDialog({ open: false, rewardId: null, rewardIds: null });
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title={deleteDialog.rewardIds ? "Delete Multiple Rewards" : "Delete Reward"}
        content={
          <>
            {deleteDialog.rewardIds 
              ? `Are you sure you want to delete ${deleteDialog.rewardIds.length} rewards?`
              : "Are you sure you want to delete this reward?"}
            {deleteError && (
              <SoftTypography 
                variant="caption" 
                color="error" 
                fontWeight="medium"
                sx={{ display: 'block', mt: 1 }}
              >
                Error: {deleteError}
              </SoftTypography>
            )}
          </>
        }
      />

      <Footer />
    </DashboardLayout>
  );
}

export default RewardsList;

