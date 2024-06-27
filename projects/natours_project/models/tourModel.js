const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const Review = require('./reviewModel');

const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'Must have tour name'],
        unique : true
    },
    slug : String,
    duration : {
        type : Number,
        required : [true , 'Must have tour duration']
    },
    difficulty : {
        type : String,
        required : [true , 'Tour must have an difficulty level']
    },
    maxGroupSize : {
        type : Number,
        required : [true , 'Must have group size']
    },
    ratingsAverage : {
        type : Number,
        default : 4.2
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    price : {
        type : Number,
        required : [true , 'Must have a price of tour']
    },
    summary : {
        type : String ,
        required : [true , 'A tour must have summary'],
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        required : [true , 'A tour must have cover image']
    },
    images : [String],
    startDates : [Date], 
    createdAt : {
        type : Date,
        default : Date.now(),
        select : false
    },
    secretTour : {
        type : Boolean,
        default : false
    },
    guides : [
        {   type : mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ],
    startLocation : {
        type : {
            type : String,
            default : 'Point',
            enum : ['Point']
        },
        coordinates : {
            type : [Number]
        },
        description : String,
        address : String,
        day : Number
    },
    locations : [
       {
        type : {
            type : String,
            default : 'Point',
            enum : ['Point']
        },
        coordinates : {
            type : [Number],
        },
        description : String,
        address : String,
        day : Number
       }
    ]
},
{   
    toJSON : { virtuals : true},
    toObject : { virtuals : true},
});

//virtual properties are those which can not be stored in DB but we can fetch them with request
tourSchema.virtual('noOfWeekDays').get(function(){ //used regular function instead of arrow function bcz we need this keyword
   return this.duration / 7;
});

tourSchema.virtual('reviews' , {
    ref : 'Review',
    foreignField : 'tour',
    localField : '_id'
}); 

tourSchema.index({ price : 1 }); // 1 means acending order

/****document middleware*****/ //only used for the .save() and .create() methods
tourSchema.pre('save' , function(next){
    this.slug = slugify(this.name , { lower : true } );
    next();
});

tourSchema.pre('save' , async function(next){
const guidePromises = this.guides.map(async (id) => await User.findById(id));
this.guides = await Promise.all(guidePromises);

next();
});

/****query middleware*****/
tourSchema.pre(/^find/ , function(next){
    this.find({secretTour : { $ne : true}});
    next();
});

tourSchema.pre(/^find/ , function(next){
this.populate({
    path : 'guides',
    select : '-__v'
});
next();
});

/****aggregate middleware*****/
tourSchema.pre('aggregate' , function(next){
   this.pipeline().unshift({ $match : {secretTour : {$ne : true}}});
   next(); 
});

 const Tour = mongoose.model('Tour' , tourSchema); // this is a mongoose model class
 
 
 module.exports = Tour;