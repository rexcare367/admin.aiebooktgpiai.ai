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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

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
  const fil_key = value.split('/').pop();
  return <a href={value} target="_blank" rel="noreferrer">{fil_key}</a>
};

CustomFileURLComponent.propTypes = {
  value: PropTypes.string.isRequired,
};

// Define prop types for the Cell component
const CustomStatusComponent = ({ value }) => {
  return <SoftBadge variant="contained" color="success" size="xs" badgeContent={value} container />
}
CustomStatusComponent.propTypes = {
  value: PropTypes.string.isRequired,
};

function DataTables() {
  const columns = [
    { Header: "Id", accessor:"id" },
    { Header: "Title", accessor: "title" },
    { Header: "Status", accessor: "status", Cell: CustomStatusComponent },
    { Header: "Upload Time", accessor: "upload_time", Cell: ({value}) => moment(value).format('DD/MM/YYYY HH:mm:ss') },
    // { Header: "action", accessor: "action" },
]
  const [ebooks, setEbooks] = useState([]);
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}ebooks/list?limit=1000`);
      // console.log('res.data.data', res.data.data)
      let _ebooks = addActionToRow(res.data.data)
      setEbooks(_ebooks);
    } catch (err) {
      console.error(err); // Use console.error for errors
    }
  };

  const addActionToRow = (data)=> {
    // let _ebooks = data.map((ebook) => ({...ebook, action: <ActionCell ebookId={ebook.file_key} fetchBooks={fetchBooks} />}))
    let _ebooks = data.map((ebook, index) => ({...ebook, id: index+1}))
    return _ebooks
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={6} pb={3}>
        <SoftBox mb={3}>
        </SoftBox>
        <Card>
          <SoftBox p={3} lineHeight={1}>
            <SoftTypography variant="h5" fontWeight="medium">
              EBooks Database
            </SoftTypography>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              All books are indexed on pinecone
            </SoftTypography>
          </SoftBox>
          <DataTable table={{columns, rows: ebooks}} canSearch />
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DataTables;
