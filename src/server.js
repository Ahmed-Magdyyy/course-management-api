const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ErrorResponse = require('./utils/errorResponse');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

const dbConnection = require("./config/database");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads/courses', express.static(path.join(__dirname, 'uploads', 'courses')));
app.use('/api/v1/courses', require('./routes/courseRoutes'));


// DB connection
dbConnection();

// Root route
app.get('/', (req, res) => {
  res.send('Course Management API is running.');
});

app.all("*", (req, res, next) => {
  next(new ErrorResponse(`can't find this route: ${req.originalUrl}`, 400));
});

app.use(errorHandler);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}!`)
);

process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});