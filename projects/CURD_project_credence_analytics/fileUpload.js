const multer = require('multer');
const path = require('path');
const AppError = require('./utils/appError');


const storage = multer.diskStorage({
    destination : function (req, file ,cb){
        console.log(path.join(__dirname));
        const uploadPath = path.join(__dirname, '/images');
        return cb(null , uploadPath);
    },
    filename : function (req, file , cb) {
        return cb(null , `${Date.now()}-${file.originalname}`)
    }
    
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg') return cb(new AppError('Only .jpeg files are allowed!', 400));
    cb(null , true);
};

const upload = multer({
    storage : storage,
    fileFilter : fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 }
});

module.exports = upload;