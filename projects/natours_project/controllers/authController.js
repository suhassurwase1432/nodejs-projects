const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

const jwtToken = (id) => jwt.sign({id : id }, process.env.JWT_SECRET);

exports.signup = catchAsync( async(req,res,next)=>{
    
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm,
        role : req.body.role
    });

    const token = await jwtToken(newUser._id);
    
    res.cookie('jwt' , token , {
        // secure : true,
        httpOnly : true
    });

    res.status(201).json({
        "status" : "success",
        token,
        "data" : {
            "User" : newUser
        }
   }); 
});

exports.login = catchAsync(async(req,res,next)=>{
    const { email , password } = req.body;

    if(!email || !password){
        return next(new AppError('PLease, provide email and password !' , 400));
    }

    const user = await User.findOne({ email : email});

    // const correct = await user.checkPassword(password , user.password);

    if(!user || !(await user.checkPassword(password , user.password))){
        return next(new AppError('Please check, email or password is incorrect' , 400));
    }

    const token = await jwtToken(user._id);
    res.cookie('jwt' , token , {
        // secure : true,
        expires : new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        httpOnly : true
    });

    res.status(200).json({
        "status" : "success",
        token
    });
});

exports.validate = catchAsync(async (req, res, next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){

        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('Token is missing' , 401));
    }

    const verified = await promisify(jwt.verify)(token , process.env.JWT_SECRET);
    // const verified = await jwt.verify(token , process.env.JWT_SECRET); // this line is also working same linke line no.63
    const userExist = await User.findOne({_id : verified.id});

    if(!userExist){
        return next(new AppError('User along with this token is no more exists' , 400));
    }

    req.user = userExist;
    next();
});

exports.permitTo = (...roles) => {
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have authorities to perform this action.' , 400));
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req,res,next) =>{
    const email = req.body.email;
    const user = await User.findOne({ email : email});

    if(!user){
        return next(new AppError('Sorry, No user exist along with this email' , 404));
    }

    const token = user.createForgotPasswordToken();
    await user.save({validateBeforeSave : false});

    res.status(200).json({
        "status" : "success",
        "message" : "Password reset token is send to your registered E-mail!",
        "data" : {
            token
        }
    });
});

exports.resetPassword = catchAsync(async(req,res, next)=>{

    const hashToken = await crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ forgotPasswordToken : hashToken ,  forgotPasswordTokenExpire : { $gt : Date.now()}});

    if(!user){
        // user.forgotPasswordToken = undefined;
        // user.forgotPasswordTokenExpire = undefined;
        // user.save();
        return next(new AppError('Invalid token or token Expired ! please, try again later.'));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpire = undefined;

    await user.save();

    const token = await jwtToken(user._id);

    res.status(200).json({
        "status" : "success",
        "message" : "Password changed successfully !",
        "data" : {
            token
        }
    });
});

exports.updatePassword = catchAsync (async(req,res,next)=>{
   let token;
    if(req.headers.authorization && req.headers.authorization.startsWith){
        token = req.headers.authorization.split(' ')[1];
    }
    const verifyToken = await promisify(jwt.verify)(token , process.env.JWT_SECRET);

    const user = await User.findOne({ _id : verifyToken.id});

    // above 137 to 143 line of code can be covered in below line
    /*const user = await User.findById({ _id : req.user.id }); */

    if(!(await user.checkPassword(req.body.currentPassword , user.password))){
        return next(new AppError('Your current password is invalid' , 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    token = await jwtToken(user.id);

    res.status(200).json({
        "status" : "success",
        "message" : "Password changed successfully !",
        "data" : {
            token
        }
    });
});