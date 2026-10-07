const { s3Client, getSignedUrl, PutObjectCommand } = require("../config/s3Client");

const getPresignedUrl = async (key) => {

    const Uniquekey = `${Date.now()}-${key}`;

    const command = new PutObjectCommand({
        Bucket : process.env.S3_BUCKET,
        Key : Uniquekey,
        ContentType : "image/jpeg"
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn : 3600 });
    return url;
}

module.exports = { getPresignedUrl }