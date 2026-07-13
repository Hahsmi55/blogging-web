const amqplib = require("amqplib"); 

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

async function connectRabbitMQ() {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const postsQueue = await channel.assertQueue("post_cruds");
    await channel.assertQueue("mediaQueue");  
    console.log("Connected to RabbitMQ");
    return {  channel, postsQueue };
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
}       

module.exports = { connectRabbitMQ };