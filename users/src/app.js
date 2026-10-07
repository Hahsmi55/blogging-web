require('dotenv').config(); 
const express = require('express');
const cors = require('cors');   
const helmet = require('helmet');
const cookieParser = require('cookie-parser');  
const userRoutes = require('./routes/user.routes');
const { registerAdmin} = require('./utils/registeringAdmin')
const app = express();

// Registering first admin

registerAdmin().then(() => {  
    console.log('Admin registration process completed.');
}).catch((error) => { 
    console.error('Error during admin registration:', error); 
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  
app.use(cors());
app.use(helmet());

// Routes
app.use('/auth', userRoutes);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

module.exports = app;