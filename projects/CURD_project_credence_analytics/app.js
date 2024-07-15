const express = require('express');
const movieRouter = require('./routes/movieRoutes');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/movies' , movieRouter);

app.use("*" , (req, res, next) => {
    next(new AppError(`the given route ${req.originalUrl} is not found.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
