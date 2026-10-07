const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region : process.env.REGION,
    credentials : {
        accessKeyId : process.env.S3_ACCESS_KEY,
        secretAccessKey : process.env.S3_SECRET_KEY
    }
})

module.exports = {
    s3Client,
    getSignedUrl,
    PutObjectCommand, 
    GetObjectCommand,
    DeleteObjectCommand
}