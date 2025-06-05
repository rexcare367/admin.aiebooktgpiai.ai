import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftAlert from "components/SoftAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useState, useEffect, useRef } from "react";
import { dynamoDb, cognitoIdentityServiceProvider } from '../../../config/aws-config';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Prop Types
const TableCellProps = {
  row: PropTypes.shape({
    original: PropTypes.object.isRequired
  }).isRequired
};

// Cell Components
const StatusCell = ({ value }) => {
  let color;
  const status = value?.toUpperCase() || 'UNKNOWN';

  switch (status) {
    case 'CONFIRMED':
      color = 'success';
      break;
    case 'PENDING':
      color = 'warning';
      break;
    default:
      color = 'secondary';
  }

  return (
    <SoftTypography variant="caption" color={color} fontWeight="medium">
      {status}
    </SoftTypography>
  );
};

StatusCell.propTypes = {
  value: PropTypes.string
};

const DateCell = ({ value }) => (
  <SoftTypography variant="caption">
    {value ? new Date(value).toLocaleDateString() : '-'}
  </SoftTypography>
);

DateCell.propTypes = {
  value: PropTypes.string
};

function DataTables() {
  // State management
  const [icNumbers, setIcNumbers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const fileInputRef = useRef(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    itemToDelete: null,
    type: null
  });

  // Handle delete actions
  const handleDeleteClick = (item, type) => {
    setDeleteDialog({
      open: true,
      itemToDelete: item,
      type: type
    });
  };

  // Action cell component
  const ActionCell = ({ row, type }) => (
    <SoftBox>
      <SoftButton
        variant="text"
        color="error"
        onClick={() => handleDeleteClick(row, type)}
        size="small"
      >
        Delete
      </SoftButton>
    </SoftBox>
  );

  ActionCell.propTypes = {
    row: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
  };

  // Table cell components
  const StudentActionCell = ({ row }) => <ActionCell row={row.original} type="student" />;
  StudentActionCell.propTypes = TableCellProps;

  const IcActionCell = ({ row }) => <ActionCell row={row.original} type="ic" />;
  IcActionCell.propTypes = TableCellProps;

  // Column definitions
  const studentColumns = [
    { 
      Header: "Username",
      accessor: "username",
    },
    { 
      Header: "Name",
      accessor: "name",
    },
    { 
      Header: "Guardian Name",
      accessor: "guardianName",
    },
    { 
      Header: "Email",
      accessor: "email",
    },
    { 
      Header: "Phone Number",
      accessor: "phone_number",
    },
    { 
      Header: "Status",
      accessor: "userStatus",
      Cell: StatusCell
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: StudentActionCell
    }
  ];

  const icColumns = [
    {
      Header: "IC Number",
      accessor: "icNumber",
    },
    {
      Header: "Registration Status",
      accessor: "registrationStatus",
      Cell: StatusCell
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      Cell: DateCell
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: IcActionCell
    }
  ];

  // Dialog handlers
  const handleCloseDialog = () => {
    setDeleteDialog({
      open: false,
      itemToDelete: null,
      type: null
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const { itemToDelete, type } = deleteDialog;
      
      if (type === 'student') {
        await deleteStudent(itemToDelete.username);
      } else if (type === 'ic') {
        await deleteIcNumber(itemToDelete.icNumber);
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error in deletion:', error);
      handleCloseDialog();
    }
  };

  // Delete operations
  const deleteStudent = async (username) => {
    try {
      const params = {
        UserPoolId: process.env.REACT_APP_USER_POOL_ID,
        Username: username
      };

      await cognitoIdentityServiceProvider.adminDeleteUser(params).promise();
      
      setStudents(prevStudents => 
        prevStudents.filter(student => student.username !== username)
      );

      setUploadStatus({
        type: 'success',
        message: 'Student deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      setUploadStatus({
        type: 'error',
        message: `Failed to delete student: ${error.message}`
      });
      throw error;
    }
  };

  const deleteIcNumber = async (icNumber) => {
    try {
      const params = {
        TableName: 'IC_Numbers',
        Key: {
          icNumber: icNumber
        }
      };

      await dynamoDb.delete(params).promise();
      
      setIcNumbers(prevIcNumbers => 
        prevIcNumbers.filter(ic => ic.icNumber !== icNumber)
      );

      setUploadStatus({
        type: 'success',
        message: 'IC Number deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting IC number:', error);
      setUploadStatus({
        type: 'error',
        message: `Failed to delete IC number: ${error.message}`
      });
      throw error;
    }
  };

  // Fetch operations
  const fetchIcNumbers = async () => {
    try {
      const params = {
        TableName: 'IC_Numbers'
      };

      const response = await dynamoDb.scan(params).promise();
      
      if (response.Items) {
        const sortedItems = response.Items.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setIcNumbers(sortedItems);
      } else {
        setIcNumbers([]);
      }
    } catch (error) {
      console.error('Error fetching IC numbers:', error);
      setUploadStatus({
        type: 'error',
        message: `Failed to fetch IC numbers: ${error.message}`
      });
    }
  };

  const fetchCognitoUsers = async () => {
    try {
      let paginationToken = null;
      let allUsers = [];

      do {
        const params = {
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          ...(paginationToken && { PaginationToken: paginationToken })
        };

        const response = await cognitoIdentityServiceProvider.listUsers(params).promise();
        
        if (response.Users?.length > 0) {
          allUsers = [...allUsers, ...response.Users];
        }

        paginationToken = response.PaginationToken;
      } while (paginationToken);

      const formattedUsers = allUsers.map(user => ({
        username: user.Username || '',
        name: user.Attributes?.find(a => a.Name === 'name')?.Value || '',
        email: user.Attributes?.find(a => a.Name === 'email')?.Value || '',
        phone_number: user.Attributes?.find(a => a.Name === 'phone_number')?.Value || '',
        guardianName: user.Attributes?.find(a => a.Name === 'custom:guardianName')?.Value || '',
        userStatus: user.UserStatus || ''
      }));

      setStudents(formattedUsers);
    } catch (error) {
      console.error('Error fetching Cognito users:', error);
      setUploadStatus({
        type: 'error',
        message: `Failed to fetch students: ${error.message}`
      });
    }
  };

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setUploadStatus({ type: 'info', message: 'Processing file...' });
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        const dataLines = lines[0].toLowerCase().includes('ic number') ? lines.slice(1) : lines;
        
        const icList = dataLines.map(line => {
          const columns = line.split(',');
          const icNumber = columns[0].replace(/\D/g, '');
          return icNumber;
        }).filter(ic => ic.length > 0);
  
        let successCount = 0;
        let failureCount = 0;
  
        for (const ic of icList) {
          try {
            const params = {
              TableName: 'IC_Numbers',
              Item: {
                icNumber: ic,
                createdAt: new Date().toISOString(),
                registrationStatus: 'PENDING'
              },
              ConditionExpression: 'attribute_not_exists(icNumber)'
            };
  
            await dynamoDb.put(params).promise();
            successCount++;
          } catch (error) {
            if (error.code === 'ConditionalCheckFailedException') {
              failureCount++;
            } else {
              throw error;
            }
          }
        }
  
        setUploadStatus({
          type: 'success',
          message: `Upload complete: ${successCount} successful, ${failureCount} duplicates`
        });
        await fetchIcNumbers();
      } catch (error) {
        console.error('Error processing file:', error);
        setUploadStatus({
          type: 'error',
          message: `Upload failed: ${error.message}`
        });
      }
    };
  
    reader.readAsText(file);
    event.target.value = null;
  };

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (activeTab === 'ic') {
        await fetchIcNumbers();
      } else {
        await fetchCognitoUsers();
      }
      setIsLoading(false);
    };

    fetchData();
  }, [activeTab]);

  // Render
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={6} pb={3}>
        <Card>
          <SoftBox p={3} lineHeight={1}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <div>
                <SoftTypography variant="h5" fontWeight="medium">
                  {activeTab === 'students' ? 'Student Database' : 'IC Numbers Management'}
                </SoftTypography>
                <SoftTypography variant="button" fontWeight="regular" color="text">
                  SK tanjung Piai student AI eBook Database
                </SoftTypography>
              </div>
              <SoftBox display="flex" gap={2}>
                <SoftButton
                  variant={activeTab === 'students' ? 'gradient' : 'outlined'}
                  color="info"
                  onClick={() => setActiveTab('students')}
                >
                  Students
                </SoftButton>
                <SoftButton
                  variant={activeTab === 'ic' ? 'gradient' : 'outlined'}
                  color="info"
                  onClick={() => setActiveTab('ic')}
                >
                  IC Numbers
                </SoftButton>
              </SoftBox>
            </SoftBox>

            {activeTab === 'ic' && (
              <SoftBox mb={2}>
                <input
                  type="file"
                  accept=".txt,.csv"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <SoftButton
                  variant="gradient"
                  color="primary"
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload IC Numbers
                </SoftButton>
              </SoftBox>
            )}

            {uploadStatus && (
              <SoftBox mb={2}>
                <SoftAlert
                  color={uploadStatus.type === 'error' ? 'error' : 
                         uploadStatus.type === 'success' ? 'success' : 'info'}
                  dismissible
                >
                  {uploadStatus.message}
                </SoftAlert>
              </SoftBox>
            )}
          </SoftBox>

          <DataTable 
            table={{
              columns: activeTab === 'students' ? studentColumns : icColumns,
              rows: activeTab === 'students' ? students : icNumbers
            }}
            canSearch
            isLoading={isLoading}
            entriesPerPage={{
              defaultValue: 10,
              entries: [5, 10, 15, 20, 25]
            }}
          />
        </Card>
      </SoftBox>

      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {deleteDialog.type === 'student' 
              ? `Are you sure you want to delete the student ${deleteDialog.itemToDelete?.name || deleteDialog.itemToDelete?.username}?`
              : `Are you sure you want to delete the IC Number ${deleteDialog.itemToDelete?.icNumber}?`
            }
            {deleteDialog.type === 'student' && 
              " This action cannot be undone and will permanently remove the student's account."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={handleCloseDialog} color="primary">
            Cancel
          </SoftButton>
          <SoftButton onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </SoftButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default DataTables;