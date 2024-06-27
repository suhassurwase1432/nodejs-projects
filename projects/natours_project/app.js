const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(express.json());

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(helmet());

app.use(express.static(`${__dirname}/public`));

app.use((req,res,next) =>{
    console.log(`Request passed through middleware.. \nRequestd on : ${new Date().toISOString()}`);
    next();
}); 

app.use('/api/v1/tours' , tourRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/reviews' , reviewRouter);

app.use('*' , (req,res,next)=>{
    next(new AppError(`route for ${req.originalUrl} this path is not found` , 404));
});
    
app.use(globalErrorHandler);


module.exports = app;