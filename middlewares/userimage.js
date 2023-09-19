const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/userprofiles'); // Store files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {
      // Accept only image files
      if (file.mimetype.startsWith('image')) {
          cb(null, true);
      } else {
          cb(new Error('Invalid file type'), false);
      }
  };
  
  
  // Create multer instance with storage options
  const upload = multer({ storage: storage , fileFilter: fileFilter});
  

module.exports= {upload};

