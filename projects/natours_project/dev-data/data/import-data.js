const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('../../models/reviewModel');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

dotenv.config({path : './config.env'});
// const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);
// const DB = process.env.NEW_DATABASE.replace('<PASSWORD>' , process.env.NEW_DATABASE_PASSWORD);
const DB = process.env.LOCAL_DATABASE;

mongoose.connect(DB , {
    useNewUrlParser: true, 
    useUnifiedTopology: true ,
    useCreateIndex : true
}).then(()=> console.log('connected to DB ..')).catch(err=> console.log(err));


const importData = async ()=>{
    try{
        await Tour.create(tours);
        await User.create(users , { validateBeforeSave : false});
        await Review.create(reviews);
        console.log('data imported successfully..')
    } catch(err){
        console.log(err);
    }
     process.exit();
}

const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('data deleted successfully..')
        
    }catch(err){
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}
