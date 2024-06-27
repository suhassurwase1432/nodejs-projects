const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
review : {
    type : String,
    max : 1000,
    required : [true , 'Review can not be empty']
},
rating : {
    type : Number,
    default : 4.4,
    min : 1,
    max : 5
},
createdAt : {
    type : Date,
    default : Date.now()
},
tour : {
    type : mongoose.Schema.ObjectId,
    ref : 'Tour',
    required : [true , 'Review must belong to a tour']
},
user : {
    type : mongoose.Schema.ObjectId,
    ref : 'User',
    required : [true , 'Review must belong to a user']
}
},
{
toJSON : { virtuals : true},
toObject : { virtuals : true}
});

// reviewSchema.pre(/^find/ , function(next){
//     this.populate({
//         path : 'tour',
//         select : 'name'
//     }).populate({
//         path : 'user',
//         select : 'name'
//     });
    
//     next();
// });

reviewSchema.pre(/^find/ , function(next){
    this.populate({
        path : 'user',
        select : 'name'
    });
    
    next();
});

const Review = mongoose.model('Review' , reviewSchema);

module.exports = Review;