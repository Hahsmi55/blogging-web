const putObject = async (bucketName, key,body) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key:  key, 
      Body: body.image.buffer,
    });
    const result = await s3Client.send(command);
    console.log(`Object ${key} uploaded successfully to bucket ${bucketName}`);  
    return result;       
    } catch (error) {           
    console.error('Error uploading object:', error);
    throw error;
  }
};

module.exports = putObject;