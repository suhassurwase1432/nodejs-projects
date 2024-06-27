const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
   name : {
    type : String,
    require : [true , 'Required name !']
   },
   email : {
    type : String,
    require : [true, 'required email !'],
    unique : true,
    lowercase : true,
    validate : [validator.isEmail , 'Please, provide valid email']
   } ,
   photo : String,
   password : {
    type : String,
    required : [true , 'Please provide password']
   },
   passwordConfirm : {
    type : String,
    required : [true , 'Please provide confirm password'],
    validate : {
      validator : function(el){
         return el === this.password;
      },
      message : 'Passwords are not same' 
    }
   },
   role : {
      type : String,
      enum : ['user','guide','lead-guide','admin'],
      default : 'user'
   },
   active : {
      type : Boolean,
      default : true,
      select : false
   },
   forgotPasswordToken : String,
   forgotPasswordTokenExpire : Date
});

userSchema.pre('save' , async function(next){
this.password = await bcrypt.hash(this.password , 12);
this.passwordConfirm = undefined;
next();
});

userSchema.pre(/^find/ , function(next){
   this.find({active : {$ne : false}});
   next();
})

//this is a instance (non-static) method
userSchema.methods.checkPassword = async function(passwordFromBody , passwordStoredinDB){
return bcrypt.compare(passwordFromBody , passwordStoredinDB);
}

userSchema.methods.createForgotPasswordToken = function() {
   const token = crypto.randomBytes(32).toString('hex');

   const hashToken = crypto.createHash('sha256').update(token).digest('hex');
   this.forgotPasswordToken = hashToken;
   this.forgotPasswordTokenExpire = Date.now() + (1000 * 60 *10);

   return token;
}
const User = mongoose.model('User' , userSchema);

module.exports = User;

