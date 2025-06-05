import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// MUI imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

// Dashboard components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Styles
const styles = {
  recipientCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    margin: '8px 0',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#f8f9fa'
    },
    '&.selected': {
      backgroundColor: '#e3f2fd'
    }
  },
  messageBox: {
    width: '100%',
    minHeight: '120px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginTop: '16px',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  recipientAvatar: {
    backgroundColor: '#1a73e8',
    color: 'white',
    width: '40px',
    height: '40px',
    marginRight: '12px'
  },
  recipientInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  statusChip: {
    height: '24px',
    marginLeft: '8px'
  },
  noRecipients: {
    textAlign: 'center',
    padding: '32px',
    color: '#666'
  }
};

function NewWhatsapp() {
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_GATEWAY_URL}/whatsapp/users`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch recipients');

      const data = await response.json();
      
      if (data.users) {
        setRecipients(data.users);
        setError(null);
      } else {
        setRecipients([]);
        setError('No recipients available');
      }
    } catch (err) {
      setRecipients([]);
      setError('Failed to load recipients');
      console.error('Error fetching recipients:', err);
    }
  };

  const handleRecipientSelect = (recipient) => {
    const isSelected = selectedRecipients.some(r => r.id === recipient.id);
    if (isSelected) {
      setSelectedRecipients(selectedRecipients.filter(r => r.id !== recipient.id));
    } else {
      setSelectedRecipients([...selectedRecipients, recipient]);
    }
  };

  const handleSendMessage = async () => {
    if (selectedRecipients.length === 0) {
      setError('Please select recipients');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_GATEWAY_URL}/whatsapp/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            template_sid: "MG346e149857df2f84f7fb9d20bffadc72",  // Replace with your Messaging Service SID
            template_params: ["BlacX"],                  // Adjust this if needed to match your dynamic template parameters
            recipients: selectedRecipients
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setSelectedRecipients([]);
        setError(null);
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          {/* Recipients List */}
          <Grid item xs={12} lg={4}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="medium">
                  Recipients
                </SoftTypography>
                
                {error && (
                  <SoftBox mt={2} mb={2}>
                    <SoftTypography variant="caption" color="error">
                      {error}
                    </SoftTypography>
                  </SoftBox>
                )}

                <SoftBox mt={2}>
                  {recipients.length > 0 ? (
                    recipients.map((recipient) => (
                      <Box
                        key={recipient.id}
                        sx={{
                          ...styles.recipientCard,
                          ...(selectedRecipients.some(r => r.id === recipient.id) ? { backgroundColor: '#e3f2fd' } : {})
                        }}
                        onClick={() => handleRecipientSelect(recipient)}
                      >
                        <Avatar sx={styles.recipientAvatar}>
                          {recipient.name?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <Box sx={styles.recipientInfo}>
                          <SoftTypography variant="button" fontWeight="medium">
                            {recipient.name}
                            <Chip
                              label={recipient.status}
                              color={recipient.status === 'CONFIRMED' ? 'success' : 'default'}
                              size="small"
                              sx={styles.statusChip}
                            />
                          </SoftTypography>
                          <SoftTypography variant="caption" color="text">
                            {recipient.phone}
                          </SoftTypography>
                          {recipient.email && (
                            <SoftTypography variant="caption" color="text">
                              {recipient.email}
                            </SoftTypography>
                          )}
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box sx={styles.noRecipients}>
                      <SoftTypography variant="button" color="text">
                        No recipients available
                      </SoftTypography>
                    </Box>
                  )}
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>

          {/* Message Composition */}
          <Grid item xs={12} lg={8}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="medium">
                  New Message
                </SoftTypography>

                {/* Selected Recipients */}
                {selectedRecipients.length > 0 && (
                  <SoftBox mt={2} display="flex" flexWrap="wrap" gap={1}>
                    {selectedRecipients.map((recipient) => (
                      <Chip
                        key={recipient.id}
                        label={`${recipient.name} (${recipient.phone})`}
                        onDelete={() => handleRecipientSelect(recipient)}
                        color="info"
                      />
                    ))}
                  </SoftBox>
                )}

                {error && (
                  <SoftBox mt={2}>
                    <SoftTypography variant="caption" color="error">
                      {error}
                    </SoftTypography>
                  </SoftBox>
                )}

                {success && (
                  <SoftBox mt={2}>
                    <SoftTypography variant="caption" color="success">
                      {success}
                    </SoftTypography>
                  </SoftBox>
                )}

                <SoftBox display="flex" justifyContent="flex-end" mt={3}>
                  <SoftButton
                    variant="gradient"
                    color="info"
                    onClick={handleSendMessage}
                    disabled={loading || selectedRecipients.length === 0}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NewWhatsapp;