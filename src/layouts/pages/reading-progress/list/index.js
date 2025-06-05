import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import moment from "moment";
// Data
import ActionCell from "./ActionCell";

import axios from "axios";

const formatDuration = (duration) => {
  // return moment.duration(duration, "seconds").humanize(false);
  return `${duration}s`;
};

function DataTables() {
  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "User", accessor: "user_ic" },
    {
      Header: "Book",
      accessor: "book_file_key",
      Cell: ({ value }) => value.replace(/^\d+_/, "").replace(/_/g, " "),
    },
    {
      Header: "started_time",
      accessor: "started_time",
      Cell: ({ value }) => moment(value).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      Header: "Duration",
      accessor: "duration",
      Cell: ({ value }) => formatDuration(value),
    },
    {
      Header: "Completion Percent",
      accessor: "percent",
      Cell: ({ value }) => `${parseFloat(value * 100).toFixed(1)}%`,
    },
    // { Header: "Action", accessor: "action" },
  ];
  const [reading_progress_data, setReadingProgressData] = useState([]);
  const fetchReadingProgress = async () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}users/reading_progress`)
      .then((res) => {
        let reading_progress_data = addActionToRow(res.data.data);
        setReadingProgressData(reading_progress_data);
      })
      .catch((err) => console.log("err", err));
  };

  const addActionToRow = (data) => {
    let reading_progress_data = data.map((item, index) => ({
      ...item,
      // action: <ActionCell userIC={item.user_ic} refetch={fetchReadingProgress} />,
      id: index + 1,
    }));
    return reading_progress_data;
  };

  useEffect(() => {
    fetchReadingProgress();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={6} pb={3}>
        <SoftBox mb={3}></SoftBox>
        <Card>
          <SoftBox p={3} lineHeight={1}>
            <SoftTypography variant="h5" fontWeight="medium">
              Reading Progress
            </SoftTypography>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Analytics of users reading progress
            </SoftTypography>
          </SoftBox>
          <DataTable table={{ columns, rows: reading_progress_data }} canSearch />
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DataTables;
