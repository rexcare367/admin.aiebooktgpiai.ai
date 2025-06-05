import { 
    PutItemCommand, 
    DeleteItemCommand, 
    GetItemCommand, 
    ScanCommand
  } from "@aws-sdk/client-dynamodb";
  import { DeleteObjectCommand } from "@aws-sdk/client-s3";
  import { dynamoDbClient, s3Client } from "../config/aws-config";
  import { v4 as uuidv4 } from 'uuid';
  
  const TABLE_NAME = "Rewards";
  const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME;
  
  // Helper function to extract S3 key from URL
  const getS3KeyFromUrl = (url) => {
    if (!url) return null;
    try {
      const urlParts = url.split('.com/');
      return urlParts[1];
    } catch (error) {
      console.error('Error extracting S3 key:', error);
      return null;
    }
  };
  
  export const rewardsApi = {
    createReward: async (rewardData) => {
      const rewardId = uuidv4();
      const now = new Date().toISOString();
  
      try {
        const params = {
          TableName: TABLE_NAME,
          Item: {
            rewardId: { S: rewardId },
            name: { S: rewardData.name },
            description: { S: rewardData.description },
            imageUrl: { S: rewardData.imageUrl },
            requirements: { 
              M: {
                books_read: { N: rewardData.requirements.books_read.toString() },
                quiz_scores: { N: rewardData.requirements.quiz_scores.toString() },
                quizzes_taken: { N: rewardData.requirements.quizzes_taken.toString() },
                daily_reading_streak: { N: rewardData.requirements.daily_reading_streak.toString() },
                reading_time_today: { N: rewardData.requirements.reading_time_today.toString() }
              }
            },
            points: { N: rewardData.points.toString() },
            reward_status: { S: rewardData.status || 'Active' },
            created: { S: now },
            updated: { S: now }
          }
        };
  
        await dynamoDbClient.send(new PutItemCommand(params));
        return { success: true, rewardId };
      } catch (error) {
        console.error('Error creating reward:', error);
        throw error;
      }
    },
  
    getReward: async (rewardId) => {
        if (!rewardId) {
          throw new Error('RewardId is required');
        }
      
        try {
          const params = {
            TableName: TABLE_NAME,
            Key: {
              rewardId: { S: rewardId }
            }
          };
      
          const result = await dynamoDbClient.send(new GetItemCommand(params));
          
          if (!result.Item) {
            throw new Error('Reward not found');
          }
      
          // Convert DynamoDB format to JavaScript object with safe fallbacks
          return {
            rewardId: result.Item.rewardId?.S || '',
            name: result.Item.name?.S || '',
            description: result.Item.description?.S || '',
            badge: result.Item.badge?.S || '',
            title: result.Item.title?.S || '',
            status: result.Item.status?.S || 'Inactive',
            createdAt: result.Item.createdAt?.S || new Date().toISOString(),
            condition: result.Item.condition?.L || []
          };
        } catch (error) {
          console.error('Error getting reward:', error);
          throw error;
        }
      },
  
    updateReward: async (rewardId, rewardData) => {
      if (!rewardId) {
        throw new Error('RewardId is required');
      }
  
      const now = new Date().toISOString();
  
      try {
        const params = {
          TableName: TABLE_NAME,
          Item: {
            rewardId: { S: rewardId },
            name: { S: rewardData.name },
            description: { S: rewardData.description },
            imageUrl: { S: rewardData.imageUrl },
            requirements: { 
              M: {
                books_read: { N: rewardData.requirements.books_read.toString() },
                quiz_scores: { N: rewardData.requirements.quiz_scores.toString() },
                quizzes_taken: { N: rewardData.requirements.quizzes_taken.toString() },
                daily_reading_streak: { N: rewardData.requirements.daily_reading_streak.toString() },
                reading_time_today: { N: rewardData.requirements.reading_time_today.toString() }
              }
            },
            points: { N: rewardData.points.toString() },
            reward_status: { S: rewardData.status },
            created: { S: rewardData.created },
            updated: { S: now }
          }
        };
  
        await dynamoDbClient.send(new PutItemCommand(params));
        return { success: true };
      } catch (error) {
        console.error('Error updating reward:', error);
        throw error;
      }
    },
  
    deleteReward: async (rewardId) => {
      try {
        // Get the reward details
        const reward = await rewardsApi.getReward(rewardId);
        const imageUrl = reward?.imageUrl;
  
        // Delete from DynamoDB
        const dynamoParams = {
          TableName: TABLE_NAME,
          Key: {
            rewardId: { S: rewardId }
          }
        };
  
        await dynamoDbClient.send(new DeleteItemCommand(dynamoParams));
  
        // Delete from S3 if there's an image
        if (imageUrl) {
          const s3Key = getS3KeyFromUrl(imageUrl);
          if (s3Key) {
            const s3Params = {
              Bucket: BUCKET_NAME,
              Key: s3Key
            };
  
            await s3Client.send(new DeleteObjectCommand(s3Params));
          }
        }
  
        return { success: true };
      } catch (error) {
        console.error('Error deleting reward:', error);
        throw error;
      }
    },
  
    getAllRewards: async () => {
        try {
          const params = {
            TableName: TABLE_NAME
          };
      
          const response = await dynamoDbClient.send(new ScanCommand(params));
          console.log('===== response', response.Items);
          return response.Items.map(item => {
            try {
              // Safely get values with fallbacks
              return {
                rewardId: item.rewardId?.S || '',
                description: item.description?.S || '',
                badge: item.badge?.S || '',
                title: item.title?.S || '0',
                status: item.status?.S || 'Inactive',
                createdAt: item.createdAt?.S || new Date().toISOString(),
                condition: item.condition?.L || []
              };
            } catch (error) {
              console.error('Error processing item:', item, error);
              // Return a default object if there's an error processing this item
              return {
                rewardId: '',
                name: 'Error loading reward',
                description: '',
                badge: '',
                title: '',
                condition: [],
                status: 'Inactive',
                createdAt: new Date().toISOString(),
              };
            }
          }).filter(item => item.rewardId !== ''); // Filter out invalid items
        } catch (error) {
          console.error('Error fetching rewards:', error);
          throw error;
        }
      },
  
    bulkDeleteRewards: async (rewardIds) => {
      const results = await Promise.allSettled(
        rewardIds.map(async (rewardId) => {
          try {
            await rewardsApi.deleteReward(rewardId);
            return { rewardId, success: true };
          } catch (error) {
            return { rewardId, success: false, error: error.message };
          }
        })
      );
  
      const failures = results.filter(result => 
        result.status === 'rejected' || !result.value.success
      );
  
      if (failures.length > 0) {
        throw new Error(`Failed to delete ${failures.length} rewards`);
      }
  
      return { success: true };
    }
  };