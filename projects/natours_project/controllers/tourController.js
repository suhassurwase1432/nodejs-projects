const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.bestTour = (req,res,next) =>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,ratingsAverage,price,summary,duration';
    next();
}

exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOne(Tour , { path : 'reviews' });
exports.getAllTours = factory.getAll(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req,res,next) =>{
    const stats = await Tour.aggregate([
        {
         $match : { ratingsAverage : { $gte : 4.5}}
        } ,
        {
         $group : {
                _id : '$difficulty',
                tourNumbers : { $sum : 1},
                avgRatings : { $avg : '$ratingsAverage'},
                avgPrice : { $avg : '$price'},
                minPrice : { $min : '$price'},
                maxPrice : { $max : '$price'}
            }
        }
     ]);
     
     res.status(201).json({
         "status" : "sucesss",
         "data" : {
             "stats" : stats
         }
    });
});


exports.getMonthlyPlan = catchAsync(async (req,res,next) =>{
    const year = req.params.year * 1;
        
    const plan = await Tour.aggregate([
        {
            $unwind : '$startDates'
        },
        {
            $match : {startDates : {
            $gte : new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-31`)
            }}
        } ,
        {   
            $group : {
                _id : { $month : '$startDates'},
                tourNumbers : { $sum : 1},
                tour : {$push : '$name'}
            }
        },
        {
            $addFields : {month : '$_id'}
        },
        {
            $sort : {tourNumbers : -1}
        },
        {
            $project : { _id : 0}
        }
        
    ]);
    
    res.status(200).json({
        "status" : "sucesss",
        "data" : {
            "monthlyPlan" : plan
        }
    });
});




















































// exports.checkId = ((req,res,next,val)=>{
//     if(req.params.id * 1 > tours.length){
//         return res.status(404).json({
//             "status": "fail",
//             "message" : "Given id is invalid"
//         })
//     }
//     next();
// });

// exports.checkBody = ((req,res,next)=>{
//    if(!req.body.name || !req.body.price){
//         return res.status(404).json({
//             "status": "fail",
//             "message" : "name or price is missing"
//         })
//    }
//     next(); 
// });