const fs = require('fs');
const path = require('path');
const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createMovie = catchAsync(async (req,res,next) => {
    const movie = await Movie.create(req.body);

    res.status(201).json({
        "status" : "Success",
        "message" : "movie created successfully.",
        "data" : {
            "movies" : movie
        }
    });
});

exports.getMovies = catchAsync(async (req , res , next) => {
    const movies = await Movie.find();

    res.status(200).json({
        "status" : "Success",
        "results" :  movies.length,
        "data" : {
            "movies" : movies
        }
    });
}); 

exports.getMovie = catchAsync(async (req,res,next) => {
    const id = req.params.id;
   
    const movie = await Movie.findById({ _id : id});

    if (!movie) {
        return next(new AppError("No movie found with that ID", 404));
    }

    res.status(200).json({
        "status" : "Success",
        "data" : {
            "movie" : movie
        }
    });
});

exports.updateMovie = catchAsync( async (req, res, next)=>{
    const id = req.params.id;
   
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedMovie) {
        return next(new AppError("No movie found with that ID", 404));
    }

    res.status(200).json({
        "status" : "Success",
        "data" : {
            "updated movie" : updatedMovie
        }
    });
});

exports.deleteMovie = catchAsync( async (req, res, next)=>{
    const id = req.params.id;
   
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
        return next(new AppError("No movie found with that ID", 404));
    }

    res.status(200).json({
        "status" : "Success",
        "message" : "movie deleted successfully."
    });
});

exports.getImage = (req, res, next) => {

    const partialName = req.params.filename;
    const imagesPath = path.join(__dirname , '../images');

    fs.readdir(imagesPath , (err, files) => {
        if (err) {
            return next(new AppError('Unable to read images directory', 500))
        }

        const matchedFile = files.find(file => file.includes(partialName));

        if (matchedFile) {
            const imagePath = path.join(imagesPath, matchedFile);
            res.status(200).json({
                status: 'success',
                message: {
                    image: imagePath
                }
            });
        } else {
            return next(new AppError('Image not found', 404));
        }
    });    
};