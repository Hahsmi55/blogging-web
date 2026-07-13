const connectRabbitMQ = require('../config/rabbitMQ')

const addMessageToQueue = async ( event, payload) => {
  try {
    const { channel , postsQueue} = await connectRabbitMQ();
    await channel.assertQueue(postsQueue, { durable: true });
    channel.sendToQueue(postsQueue, Buffer.from(JSON.stringify({event, payload})), { persistent: true } );
    console.log(`Message sent to queue: ${postsQueue}`);
  } catch (error) {
    console.error("Error sending message to queue:", error);
  }
};

module.exports = { addMessageToQueue };