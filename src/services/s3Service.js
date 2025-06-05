import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws-config";

const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME;

export const s3Service = {
  uploadImage: async (file, folderName = 'rewards') => {
    if (!BUCKET_NAME) {
      throw new Error('S3 bucket name is not configured');
    }

    try {
      // Generate unique file name
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${folderName}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: uniqueFileName,
        Body: file,
        ContentType: file.type,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      // Return the URL of the uploaded image
      return `https://${BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
};