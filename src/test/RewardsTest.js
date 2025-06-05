import { useState, useEffect } from 'react';
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { useRewards } from 'context/RewardsContext';
import { s3Service } from 'services/s3Service';

function RewardsTest() {
  const { createReward, fetchRewards, rewards } = useRewards();
  const [testStatus, setTestStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const runS3Test = async () => {
    setTestStatus(prev => ({ ...prev, s3: 'running' }));
    try {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const file = new File([blob], 'test.txt', { type: 'text/plain' });
      const url = await s3Service.uploadImage(file, 'test');
      setTestStatus(prev => ({ ...prev, s3: 'passed', s3Url: url }));
    } catch (error) {
      console.error('S3 Test Error:', error);
      setTestStatus(prev => ({ ...prev, s3: 'failed', s3Error: error.message }));
    }
  };

  const runDynamoTest = async () => {
    setTestStatus(prev => ({ ...prev, dynamo: 'running' }));
    try {
      const testReward = {
        name: "Test Reward",
        description: "Test Description",
        imageUrl: "https://test-url.com/image.jpg",
        requirements: {
          books_read: 1,
          quiz_scores: 70,
          quizzes_taken: 1,
          daily_reading_streak: 3,
          reading_time_today: 15
        },
        points: 500,
        status: "Active"
      };

      const result = await createReward(testReward);
      setTestStatus(prev => ({ ...prev, dynamo: 'passed', dynamoResult: result }));
    } catch (error) {
      console.error('DynamoDB Test Error:', error);
      setTestStatus(prev => ({ ...prev, dynamo: 'failed', dynamoError: error.message }));
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftBox mb={3}>
                  <SoftTypography variant="h5" fontWeight="medium">
                    Rewards System Test
                  </SoftTypography>
                </SoftBox>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <SoftBox mb={3}>
                      <SoftButton 
                        color="info" 
                        fullWidth
                        onClick={runS3Test}
                        disabled={loading || testStatus.s3 === 'running'}
                      >
                        <Icon>cloud_upload</Icon>&nbsp;
                        Test S3 Upload
                      </SoftButton>
                      {testStatus.s3 && (
                        <SoftBox mt={2}>
                          <SoftTypography 
                            variant="button" 
                            color={testStatus.s3 === 'passed' ? 'success' : 'error'}
                            fontWeight="medium"
                          >
                            {testStatus.s3 === 'passed' ? 'S3 Upload Successful' : 'S3 Upload Failed'}
                          </SoftTypography>
                          {testStatus.s3Url && (
                            <SoftTypography variant="caption" display="block">
                              URL: {testStatus.s3Url}
                            </SoftTypography>
                          )}
                        </SoftBox>
                      )}
                    </SoftBox>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <SoftBox mb={3}>
                      <SoftButton 
                        color="info" 
                        fullWidth
                        onClick={runDynamoTest}
                        disabled={loading || testStatus.dynamo === 'running'}
                      >
                        <Icon>storage</Icon>&nbsp;
                        Test DynamoDB
                      </SoftButton>
                      {testStatus.dynamo && (
                        <SoftBox mt={2}>
                          <SoftTypography 
                            variant="button" 
                            color={testStatus.dynamo === 'passed' ? 'success' : 'error'}
                            fontWeight="medium"
                          >
                            {testStatus.dynamo === 'passed' ? 'DynamoDB Test Successful' : 'DynamoDB Test Failed'}
                          </SoftTypography>
                        </SoftBox>
                      )}
                    </SoftBox>
                  </Grid>
                </Grid>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default RewardsTest;