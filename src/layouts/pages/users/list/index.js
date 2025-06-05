// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import NewUser from "./new-user";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import ActionCell from "./ActionCell";

import axios from "axios";
import moment from "moment";

// Define prop types for the Cell component
const CustomFileURLComponent = ({ value }) => {
  const fil_key = value.split("/").pop();
  return (
    <a href={value} target="_blank" rel="noreferrer">
      {fil_key}
    </a>
  );
};

CustomFileURLComponent.propTypes = {
  value: PropTypes.string.isRequired,
};

// Define prop types for the Cell component
const CustomStatusComponent = ({ value }) => {
  if (value === "CONFIRMED" || value === "APPROVED")
    return (
      <SoftBadge variant="contained" color="success" size="xs" badgeContent={value} container />
    );
  if (value === "PENDING")
    return (
      <SoftBadge variant="contained" color="warning" size="xs" badgeContent={value} container />
    );
};

const CustomRewardsComponent = ({ value }) => {
  const rewards = value;
  return (
    rewards &&
    rewards.map((reward, i) => (
      <SoftBadge
        key={i}
        variant="contained"
        color="info"
        size="xs"
        badgeContent={reward}
        container
      />
    ))
  );
};

CustomStatusComponent.propTypes = {
  value: PropTypes.string.isRequired,
};

function DataTables() {
  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "IC Number", accessor: "icNumber", width: "20%" },
    { Header: "Status", accessor: "registrationStatus", width: "20%", Cell: CustomStatusComponent },
    {
      Header: "CreatedAt",
      accessor: "createdAt",
      width: "25%",
      Cell: ({ value }) => moment(value).format("DD/MM/YYYY HH:mm"),
    },
    { Header: "Rewards", accessor: "rewards", Cell: CustomRewardsComponent },
    { Header: "Full Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone Number", accessor: "phone_number" },
    {
      Header: "UserCreateDate",
      accessor: "UserCreateDate",
      Cell: ({ value }) => value && moment(value).format("DD/MM/YYYY HH:mm"),
    },
    { Header: "UserStatus", accessor: "UserStatus", width: "20%", Cell: CustomStatusComponent },
    { Header: "action", accessor: "action" },
  ];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const fetchUsers = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}users/list?limit=1000`);

      let _users = addActionToRow(res.data.data);
      setUsers(_users);
    } catch (err) {
      console.error(err); // Use console.error for errors
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  const addActionToRow = (data) => {
    let _users = data.map((user, index) => ({
      ...user,
      id: index + 1,
      action: <ActionCell id={user.icNumber} reload={fetchUsers} />,
    }));
    return _users;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={6} pb={3}>
        <SoftBox mb={3}>
          <NewUser fetchUsers={fetchUsers} />
        </SoftBox>
        <Card>
          <SoftBox p={3} lineHeight={1}>
            <SoftTypography variant="h5" fontWeight="medium">
              Users Database
            </SoftTypography>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              All books are indexed on pinecone
            </SoftTypography>
          </SoftBox>
          <DataTable table={{ columns, rows: users }} canSearch />
          {loading && (
            <SoftBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
              position="absolute"
              background="#ffffffaa"
            >
              Loading...
            </SoftBox>
          )}
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DataTables;
