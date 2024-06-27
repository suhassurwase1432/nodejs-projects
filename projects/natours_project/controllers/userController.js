const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (Obj , ...fields)=>{
   const newObj = {};
    Object.keys(Obj).forEach(el => {
        if(fields.includes(el)){
            newObj[el] = Obj[el];
        }
    });
}

exports.updateMe = catchAsync(async(req,res,next)=>{
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for update password, to update password use /updatePassword.' , 400));
    }
    const filterBody = filterObj(req.body , 'name' , 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id , filterBody , {new : true , runValidators : true});
    res.status(200).json({
        "status" : "success",
        "message" : "Data updated successfully.",
        "data" : {
            updatedUser
        }
    }); 
});

exports.deleteMe = catchAsync(async(req,res,next)=>{

    const deleteUser = await User.findByIdAndUpdate(req.user.id , {active : false});
    
    res.status(201).json({
        "status":"success",
        "message" : "deleted successfully.",
        "data" : null
    })
});

exports.getMyId = (req,res,next)=>{
    req.params.id = req.user.id;

    next();
}

exports.createUser = (req,res)=>{
    res.status(200).json({
        "status" : "success",
        "message" : "This route is not defined, instead of this use /signup route"
    });  
}

// exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);