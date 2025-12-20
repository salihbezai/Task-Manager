import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // specify the file name
    }
});

// file filter
const fileFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback)=>{
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
if(allowedFileTypes.includes(file.mimetype)){
    cb(null, true);
}else{
    cb(new Error('only image files are allowed jpeg png jpg'));
}
}

// Initialize upload middleware
 const upload = multer({
    storage, fileFilter
})

export default upload;

