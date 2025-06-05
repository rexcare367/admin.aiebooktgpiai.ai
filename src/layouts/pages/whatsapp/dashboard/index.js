import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Alert,
  Typography,
  Box,
  Grid,
  CircularProgress
} from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Search } from "lucide-react";
import { Input } from "@mui/material";

const WHATSAPP_ERRORS = {
  60242: "WhatsApp template not found",
  60224: "Missing substitutions for selected template", 
  63049: "Meta chose not to deliver this WhatsApp marketing message",
  63051: "WhatsApp Business Account is Locked",
  60223: "Delivery channel disabled",
  48030: "Proxy address is not WhatsApp-enabled sender",
  302: "The recipient is not registered on WhatsApp",
  470: "Outside messaging window - template message required",
  63003: "Invalid recipient number",
  default: "Failed to send message. Please try again later."
};

const WHATSAPP_TEMPLATES = [
  {
    id: 'update_notification',
    name: 'Update Notification',
    description: 'Send an update notification to users',
    preview: 'Hello {{1}}, we have an update for you!',
    contentSid: process.env.REACT_APP_TWILIO_CONTENT_SID,
    messagingServiceSid: process.env.REACT_APP_TWILIO_MESSAGING_SERVICE_SID
  }
];

const MESSAGE_STATUS = {
  accepted: 'Message accepted by Twilio',
  queued: 'Message queued for delivery',
  sending: 'Message is being sent',
  sent: 'Message sent to carrier',
  delivered: 'Message delivered to recipient',
  undelivered: 'Message failed to deliver',
  failed: 'Message failed to send'
};

const WhatsAppDashboard = () => {
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRecipients();
    fetchMessageHistory();
  }, []);

  const fetchMessageHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_GATEWAY_URL}/whatsapp/messages/history`
      );
      
      if (!response.ok) throw new Error('Failed to fetch message history');
      
      const data = await response.json();
      // Extract messages from the body property
      const messages = JSON.parse(data.body).messages;
      setMessageHistory(messages || []);
    } catch (err) {
      console.error('Error fetching message history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const checkMessageStatus = async (messageSid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_GATEWAY_URL}/whatsapp/messages/${messageSid}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch message status');
      
      const data = await response.json();
      // Extract status from the body property
      return JSON.parse(data.body).status;
    } catch (err) {
      console.error('Error checking message status:', err);
      return null;
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_GATEWAY_URL}/whatsapp/users`);
      if (!response.ok) throw new Error('Failed to fetch recipients');
      const data = await response.json();
      setRecipients(data.users || []);
    } catch (err) {
      setError('Failed to load recipients');
      console.error('Error:', err);
    }
  };

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipients(prev => 
      prev.some(r => r.id === recipient.id)
        ? prev.filter(r => r.id !== recipient.id)
        : [...prev, recipient]
    );
  };

  const formatErrorMessage = (error) => {
    if (error.includes('The requested resource')) return 'Twilio configuration error. Please check your account settings.';
    if (error.includes('not found')) return 'Invalid phone number or WhatsApp account not found';
    if (error.includes('60242')) return 'WhatsApp template not found. Please verify your template configuration.';
    if (error.includes('60224')) return 'Missing required template variables. Please check your template configuration.';
    if (error.includes('63051')) return 'WhatsApp Business Account is locked. Please contact support.';
    return error;
  };

  const sendWhatsAppMessage = async () => {
    if (!selectedRecipients.length || !selectedTemplate) {
      setError(selectedRecipients.length ? 'Please select a message template' : 'Please select recipients');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formattedRecipients = selectedRecipients.map(recipient => ({
        phone: recipient.phone.startsWith('+') 
          ? recipient.phone.replace(/[^\d+]/g, '')
          : `+${recipient.phone.replace(/[^\d]/g, '')}`,
        name: recipient.name
      }));

      const response = await fetch(`${process.env.REACT_APP_API_GATEWAY_URL}/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: formattedRecipients,
          template_sid: selectedTemplate.messagingServiceSid,
          contentSid: selectedTemplate.contentSid,
          contentVariables: formattedRecipients.map(recipient => ({ "1": recipient.name }))
        })
      });

      const data = await response.json();

      if (!response.ok && !data.results) {
        throw new Error(data.message || 'Failed to send messages');
      }

      await fetchMessageHistory();

      const failedMessages = data.results?.filter(result => !result.success) || [];
      const successfulMessages = data.results?.filter(result => result.success) || [];
      
      if (successfulMessages.length > 0) {
        setSuccess(`Successfully sent messages to ${successfulMessages.length} recipient(s)`);
        
        successfulMessages.forEach(async (msg) => {
          if (msg.messageSid) {
            setTimeout(async () => {
              const status = await checkMessageStatus(msg.messageSid);
              if (status) {
                console.log(`Message ${msg.messageSid} status: ${status}`);
                fetchMessageHistory();
              }
            }, 5000);
          }
        });

        setSelectedRecipients(prev => 
          prev.filter(recipient => 
            !successfulMessages.some(msg => 
              msg.recipient.replace(/[^\d+]/g, '').includes(recipient.phone.replace(/[^\d+]/g, ''))
            )
          )
        );
      }
      
      if (failedMessages.length > 0) {
        setError(
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {successfulMessages.length > 0 
                ? 'Some messages failed to send:'
                : 'Failed to send messages to:'}
            </Typography>
            <ul>
              {failedMessages.map((msg, idx) => {
                const recipient = selectedRecipients.find(r => 
                  r.phone.replace(/[^\d+]/g, '').includes(msg.recipient.replace(/[^\d+]/g, ''))
                );
                const errorCode = msg.error.match(/\d+/)?.[0];
                const errorMessage = WHATSAPP_ERRORS[errorCode] || WHATSAPP_ERRORS.default;
                
                return (
                  <li key={idx}>
                    {recipient?.name || msg.recipient} ({errorMessage})
                  </li>
                );
              })}
            </ul>
            <Typography variant="caption" color="textSecondary">
              Please verify the recipient phone numbers and try again.
            </Typography>
          </Box>
        );
      }

      if (failedMessages.length === 0) {
        setSelectedTemplate(null);
      }
    } catch (err) {
      setError(
        <Box>
          <Typography variant="subtitle2">Error sending messages:</Typography>
          <Typography>
            {err.message === 'Failed to fetch' 
              ? 'Connection error. Please check your internet connection.'
              : formatErrorMessage(err.message)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Please verify your configuration and try again.
          </Typography>
        </Box>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === recipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients([...recipients]);
    }
  };

  const filteredRecipients = recipients.filter(recipient => 
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.phone.includes(searchQuery)
  );

  const MessageHistory = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <SoftTypography variant="h5">Message History</SoftTypography>
          <Button
            size="small"
            onClick={fetchMessageHistory}
            startIcon={<Search />}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>

        {loadingHistory ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : messageHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SoftTypography variant="body2" color="text">
              No message history available
            </SoftTypography>
          </Box>
        ) : (
          <Box>
            {messageHistory.map((message) => (
              <Box
                key={message.sid}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'grey.50'
                  }
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <SoftTypography variant="subtitle2">
                      To: {message.to}
                    </SoftTypography>
                    <SoftTypography variant="caption" color="text">
                      From: {message.from || 'System'}
                    </SoftTypography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <SoftTypography variant="subtitle2">
                      Status: {MESSAGE_STATUS[message.status] || message.status}
                    </SoftTypography>
                    <SoftTypography variant="caption" color="text">
                      {new Date(message.dateCreated).toLocaleString()}
                    </SoftTypography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'flex-end',
                      gap: 1 
                    }}>
                      <Chip
                        label={message.status}
                        color={
                          message.status === 'delivered' ? 'success' :
                          message.status === 'failed' || message.status === 'undelivered' ? 'error' :
                          message.status === 'sent' ? 'info' :
                          'default'
                        }
                        size="small"
                      />
                      {message.errorMessage && (
                        <Chip
                          label="Error"
                          color="error"
                          size="small"
                          title={message.errorMessage}
                        />
                      )}
                    </Box>
                    {message.price && (
                      <SoftTypography 
                        variant="caption" 
                        color="text"
                        sx={{ 
                          display: 'block', 
                          textAlign: 'right',
                          mt: 1 
                        }}
                      >
                        Cost: ${Number(message.price).toFixed(4)}
                      </SoftTypography>
                    )}
                  </Grid>

                  {message.errorMessage && (
                    <Grid item xs={12}>
                      <Alert severity="error" sx={{ mt: 1 }}>
                        <SoftTypography variant="caption">
                          {message.errorMessage}
                        </SoftTypography>
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        {messageHistory.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'grey.300'
          }}>
            <SoftTypography variant="caption" color="text">
              Showing {messageHistory.length} message{messageHistory.length !== 1 ? 's' : ''}
            </SoftTypography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip size="small" label="Delivered" color="success" />
              <Chip size="small" label="Sent" color="info" />
              <Chip size="small" label="Failed" color="error" />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <SoftTypography variant="h5" mb={2}>Recipients</SoftTypography>
                  
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Input
                      fullWidth
                      placeholder="Search recipients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      endAdornment={
                        <Search 
                          size={20}
                          style={{ color: 'gray' }}
                        />
                      }
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSelectAll}
                    sx={{ mb: 2 }}
                  >
                    {selectedRecipients.length === recipients.length 
                      ? 'Deselect All' 
                      : 'Select All'}
                  </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '4px',
                      '&:hover': {
                        background: '#555',
                      },
                    },
                  }}
                >
                  {filteredRecipients.map(recipient => (
                    <Box
                      key={recipient.id}
                      onClick={() => handleRecipientSelect(recipient)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: selectedRecipients.some(r => r.id === recipient.id) 
                          ? 'primary.lighter' 
                          : 'background.paper',
                        '&:hover': {
                          bgcolor: 'primary.lighter',
                        },
                        minWidth: 0,
                      }}
                    >
                      <Avatar 
                        sx={{ mr: 2 }}
                        alt={recipient.name}
                        src={recipient.avatar}
                      />
                      <Box sx={{ 
                        minWidth: 0,
                        flex: 1 
                      }}>
                        <SoftTypography 
                          variant="subtitle2"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {recipient.name}
                        </SoftTypography>
                        <SoftTypography 
                          variant="caption" 
                          color="text"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {recipient.phone}
                        </SoftTypography>
                      </Box>
                    </Box>
                  ))}
                  
                  {filteredRecipients.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <SoftTypography variant="body2" color="text">
                        No recipients found
                      </SoftTypography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <SoftTypography variant="h5" mb={3}>Select Message Template</SoftTypography>
                <Box sx={{ mb: 3 }}>
                  {WHATSAPP_TEMPLATES.map(template => (
                    <Box
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid',
                        borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'grey.300',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'grey.50'
                        }
                      }}
                    >
                      <SoftTypography variant="subtitle2">{template.name}</SoftTypography>
                      <SoftTypography variant="body2" color="text" mt={1}>
                        {template.description}
                      </SoftTypography>
                      <SoftTypography 
                        variant="caption"
                        mt={2}
                        p={1}
                        sx={{ 
                          display: 'block',
                          bgcolor: 'grey.100',
                          borderRadius: 1
                        }}
                      >
                        Preview: {template.preview}
                      </SoftTypography>
                    </Box>
                  ))}
                </Box>

                {selectedRecipients.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {selectedRecipients.map(recipient => (
                      <Chip
                        key={recipient.id}
                        label={`${recipient.name} (${recipient.phone})`}
                        onDelete={() => handleRecipientSelect(recipient)}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                )}

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <SoftTypography variant="caption" color="text">
                    {selectedRecipients.length} recipient{selectedRecipients.length !== 1 ? 's' : ''} selected
                  </SoftTypography>
                  <SoftButton
                    color="info"
                    onClick={sendWhatsAppMessage}
                    disabled={loading || !selectedRecipients.length || !selectedTemplate}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Sending...
                      </Box>
                    ) : 'Send Template'}
                  </SoftButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <MessageHistory />
      </SoftBox>
    </DashboardLayout>
  );
};

export default WhatsAppDashboard;