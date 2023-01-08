const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize'); //Security
const helmet = require('helmet'); //Security
const xss = require('xss-clean'); //Security
const rateLimit = require('express-rate-limit'); //Security
const hpp = require('hpp'); //Security
const cors = require('cors'); //Controls Cross-origin server requests
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//Load ENV Vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

//Route files - where all routes are predetermined
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

//Body parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

// Dev logging middleware that post to Console Method, folder location, response code and time it took in Dev mode only
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

//------SECURITY FEATURES BELOW------//
//Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

//Prevent Cross-site Attacks
app.use(xss());

//Limit Requests to protect from DDS
const limiter = rateLimit({
  windowMs: 10 * 60 * 100, //10 mins
  max: 100,
});
app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Enable CORS Allows different domain(front-end) to be able to access Back-end (if they are aon different domains, and the ability to limit if needed)
app.use(cors());

//------SECURITY FEATURES ABOVE------//

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers - populates url with default values. Change this to make global change to routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close Server and exit process
  server.close(() => process.exit(1));
});
