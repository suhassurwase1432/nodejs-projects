const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'Please mention name of the movie.'],
        unique : true
    },
    img : {
        type : String,
    },
    summary : {
        type : String,
        required : [true , 'Please add summary for movie.']
    }
});

const Movie = mongoose.model('Movie' , moviesSchema);

module.exports = Movie;