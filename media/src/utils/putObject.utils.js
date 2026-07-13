const s3Client = require('../config/s3');
const {PutObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');

const putObject = async (bucketName, body) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: body.image.key, 
      Body: body.image.buffer,
    });
    const result = await s3Client.send(command);
    console.log(`Object ${body.image.key} uploaded successfully to bucket ${bucketName}`);         
    return result;
    } catch (error) {           
    console.error('Error uploading object:', error);
    throw error;
  }
};

module.exports = putObject; 