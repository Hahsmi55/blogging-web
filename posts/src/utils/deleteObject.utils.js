const { s3Client , DeleteObjectCommand } = require("../config/s3Client");

const deleteObject = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket : process.env.S3_BUCKET,
        Key : key
    });
    await s3Client.send(command);
}

module.exports = { deleteObject }