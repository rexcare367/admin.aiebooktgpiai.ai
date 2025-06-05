// aws-config.js
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import AWS from 'aws-sdk';

// Get all regions from environment variables
const mainRegion = process.env.REACT_APP_AWS_REGION;
const s3Region = process.env.REACT_APP_AWS_S3_REGION;
const cognitoRegion = process.env.REACT_APP_USER_POOL_ID?.split('_')[0]; // Extract region from pool ID

if (!mainRegion || !cognitoRegion) {
  throw new Error('Required AWS regions not found in environment variables');
}

// Validate credentials more thoroughly
const credentials = {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  // Add session token if using temporary credentials
  sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN // optional
};

if (!credentials.accessKeyId || !credentials.secretAccessKey) {
  console.error('AWS credentials not found in environment variables');
  throw new Error('AWS credentials not found in environment variables');
}


// Configure AWS SDK v3 clients with their specific regions
export const dynamoDbClient = new DynamoDBClient({
  region: mainRegion,
  credentials
});

export const s3Client = new S3Client({
  region: s3Region || mainRegion, // Use S3-specific region if available
  credentials
});

export const cognitoClient = new CognitoIdentityClient({
  region: cognitoRegion,
  credentials
});

// Configure AWS SDK v2 for Cognito Service Provider
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  region: cognitoRegion, // Use Cognito-specific region
  credentials: {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey
  }
});

// Configure AWS SDK v2 for DynamoDB with explicit credentials
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: mainRegion,
  credentials: credentials,
  maxRetries: 3, // Add retry logic
  httpOptions: { timeout: 5000 } // Add timeout
});

// Export AWS SDK v2 services
export { dynamoDb, cognitoIdentityServiceProvider };

// Export config for reuse
export const awsConfig = {
  mainRegion,
  s3Region,
  cognitoRegion,
  credentials
};