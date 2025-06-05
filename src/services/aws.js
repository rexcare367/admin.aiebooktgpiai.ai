// src/services/aws.js
import { DynamoDB, S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDB.DocumentClient();
const s3 = new S3();
const BUCKET_NAME = 'your-reward-images-bucket';
const TABLE_NAME = 'Rewards';

export const rewardService = {
  // Create new reward
  async createReward(rewardData, imageFile) {
    try {
      // Upload image to S3
      let imageUrl = null;
      if (imageFile) {
        const key = `rewards/${uuidv4()}-${imageFile.name}`;
        await s3.putObject({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: imageFile,
          ContentType: imageFile.type
        }).promise();
        imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
      }

      // Create reward in DynamoDB
      const reward = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        name: rewardData.name,
        description: rewardData.description,
        image: imageUrl,
        type: rewardData.type,
        conditions: {
          books_read: rewardData.books_read || null,
          quiz_scores: rewardData.quiz_scores || null,
          quizzes_taken: rewardData.quizzes_taken || null,
          daily_reading_streak: rewardData.daily_reading_streak || null,
          reading_time_today: rewardData.reading_time_today || null
        },
        status: 'ACTIVE',
        points: rewardData.points
      };

      await dynamoDB.put({
        TableName: TABLE_NAME,
        Item: reward
      }).promise();

      return reward;
    } catch (error) {
      console.error('Error creating reward:', error);
      throw error;
    }
  },

  // Get all rewards
  async getAllRewards() {
    try {
      const result = await dynamoDB.scan({
        TableName: TABLE_NAME
      }).promise();
      return result.Items;
    } catch (error) {
      console.error('Error getting rewards:', error);
      throw error;
    }
  },

  // Update reward
  async updateReward(id, rewardData, imageFile) {
    try {
      let updateExpression = 'set ';
      const expressionAttributeValues = {};
      const expressionAttributeNames = {};

      Object.keys(rewardData).forEach(key => {
        if (key !== 'id' && rewardData[key] !== undefined) {
          updateExpression += `#${key} = :${key}, `;
          expressionAttributeValues[`:${key}`] = rewardData[key];
          expressionAttributeNames[`#${key}`] = key;
        }
      });

      // Handle image upload if new image
      if (imageFile) {
        const key = `rewards/${uuidv4()}-${imageFile.name}`;
        await s3.putObject({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: imageFile,
          ContentType: imageFile.type
        }).promise();
        const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
        updateExpression += '#image = :image, ';
        expressionAttributeValues[':image'] = imageUrl;
        expressionAttributeNames['#image'] = 'image';
      }

      updateExpression = updateExpression.slice(0, -2);

      await dynamoDB.update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames
      }).promise();
    } catch (error) {
      console.error('Error updating reward:', error);
      throw error;
    }
  },

  // Delete reward
  async deleteReward(id) {
    try {
      await dynamoDB.delete({
        TableName: TABLE_NAME,
        Key: { id }
      }).promise();
    } catch (error) {
      console.error('Error deleting reward:', error);
      throw error;
    }
  }
};