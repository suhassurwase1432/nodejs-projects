const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path : './config.env'});

const app = require('./app');

const port = process.env.PORT;

const DB = process.env.DATABASE;

mongoose.connect(DB , {}).then(()=> console.log("DB connection successful..!"))
 .catch(err=> console.log(`error : ${err}.`));


app.listen(port , () => {
    console.log(`listing to port ${port}..`);
})
