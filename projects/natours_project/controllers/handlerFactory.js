const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


exports.deleteOne = Model => catchAsync(async (req,res,next)=>{
    const deleteDoc = await Model.findByIdAndDelete(req.params.id);

    if(!deleteDoc){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        "status" : "sucesss",
        "message" : "Document deleted successfully.."
    });
});

exports.updateOne = Model => catchAsync(async (req,res,next)=>{
    const updateDoc = await Model.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true});  

    if(!updateDoc){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(201).json({
        "status" : "sucesss",
        "data" : {
            "data" : updateDoc
        }
    });
});

exports.createOne = Model => catchAsync(async (req,res,next)=>{
    const newDoc = await Model.create(req.body);
    
    res.status(201).json({
        "status" : "sucesss",
        "data" : {
            "data" : newDoc
        }
    });
});

exports.getOne = (Model , populateOption)=> catchAsync(async (req,res,next)=>{
    let query = Model.findById(req.params.id);
    if(populateOption) query = query.populate(populateOption);

    const doc = await query;
    
    res.status(200).json({
    "status" : "success",
    "data" : {
        "data" : doc
    }
    }); 
});

exports.getAll = Model => catchAsync(async (req,res,next)=>{
    // const tours = await Tour.find().sort({_id : -1});   // sort result in decending order
    const features = new APIFeatures(Model.find() , req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
    
    const doc = await features.query;
    
    res.status(200).json({
        "status" : "success",
        "result" : doc.length,
        "data" : {
            "data" : doc
        }
    }); 
});
