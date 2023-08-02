//Essential
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
//More Security
const trimReqBody = require('trim-request-body');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');

//Documentation
const swagger = require('./helpers/documentation/swagger');

const cors = require('cors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const { audit } = require('./middleware/interceptors');

const { NODE_ENV, APP_PORT } = process.env;

//Import routes
const auth = require('./routes/auth');
const restaurants = require('./routes/restaurants');
const users = require('./routes/users');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));

app.use(trimReqBody);
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use(fileUpload());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10mins
    max: 5000,
});

app.use(limiter);

// if (NODE_ENV === 'development') {
app.use(morgan('dev'));
// }

// app.use(colors)

//interceptors
app.use((req, res, next) => {
    res.on('finish', async () => {
        await audit(req, res);
    });
    next();
});

//Documentation
swagger(app);

//Use routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/users', users);

app.use(errorHandler);



if (NODE_ENV !== 'production') {
    dotenv.config({ path: './config/config.env' });
}

connectDB();

const PORT = APP_PORT || 8080;

const index = app.listen(
  PORT,
  console.log(
    `Server running in ${
      NODE_ENV ? NODE_ENV : 'development'
    } mode on port ${PORT}` .yellow.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}` .red.bold);
    index.close(() => process.exit(1));
});

module.exports = { app, index };
