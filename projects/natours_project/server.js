const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path : './config.env'});

const app = require('./app');

// const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);
// const DB = process.env.NEW_DATABASE.replace('<PASSWORD>' , process.env.NEW_DATABASE_PASSWORD);
const DB = process.env.LOCAL_DATABASE;

mongoose.connect(DB , {
   useNewUrlParser: true, 
   useUnifiedTopology: true ,
   useCreateIndex : true
})
.then(()=> console.log("DB connection successful..!"))
.catch(err=> console.log(`error : ${err}.`));


const port = 8000;
app.listen(port , (req,res)=>{
   console.log(`Listing to the port ${port}..`);
});