// middleware/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

  const ext = path.extname(file.originalname).toLowerCase();
  
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
