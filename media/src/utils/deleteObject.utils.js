const s3Client = require('../config/s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');


const deleteObject = async (bucketName, objectKey) => {
    try {
        const deleteParams = {
            Bucket: bucketName,
            Key: objectKey,
        };
        
        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
        console.log(`Object ${objectKey} deleted successfully from bucket ${bucketName}`);
    } catch (error) {
        console.error(`Error deleting object ${objectKey} from bucket ${bucketName}:`, error);
        throw error;
    }
};  

module.exports = deleteObject      