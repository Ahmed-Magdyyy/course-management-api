const multer = require('multer');
const path = require('path');
const errorResponse = require('../utils/errorResponse');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/courses');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `course-${fileName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new errorResponse('Only image files are allowed!', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const uploadCourseImage = (req, res, next) => {
  const uploadSingle = upload.single('image');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new errorResponse('File size exceeds 5MB limit', 400));
        }
        return next(new errorResponse(err.message, 400));
      }
      if (err instanceof errorResponse) {
        return next(err);
      }
      return next(new errorResponse('File upload failed', 500));
    }
    
    next();
  });
};

module.exports = uploadCourseImage;