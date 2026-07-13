const amqplib = require("amqplib"); 

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

async function connectRabbitMQ() {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
    return { connection, channel };
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
}       

module.exports = { connectRabbitMQ };