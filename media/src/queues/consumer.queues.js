const connectRabbitMQ = require('../config/rabbitMQ');
const putObjectInS3 = require('../utils/putObject.utils'); 
const deleteObjectFromS3 = require('../utils/deleteObject.utils');
const updateObjectInS3 = require('../utils/updateObject.utils');
const consumePostsQueue = async () => { 
    try {
        const { channel } = await connectRabbitMQ();
        await channel.assertQueue('post_cruds', { durable: true });
        console.log('Waiting for messages in post_cruds queue...');

        channel.consume('post_cruds', (msg, event) => {
            if (msg !== null) {
                const mediaData = JSON.parse(msg.content.toString());
                console.log('Received media data:', mediaData);
                if (event === 'post.created') {
                    putObjectInS3(process.env.BUCKET_NAME,mediaData);  
                    console.log(`Handling ${event} for media ID: ${mediaData.id}`);
                }else if (event === 'post.updated') {
                    updateObjectInS3(process.env.BUCKET_NAME,mediaData.image.key,mediaData);  
                    console.log(`Handling ${event} for media ID: ${mediaData.id}`);
                }  else if (event === 'post.deleted') {
                    deleteObjectFromS3(process.env.BUCKET_NAME,mediaData.key);
                    console.log(`Handling ${event} for media ID: ${mediaData.id}`);
                }   

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error consuming post_cruds queue:', error);
    }
}

module.exports = { consumePostsQueue };