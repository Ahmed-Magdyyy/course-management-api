const { body, validationResult } = require("express-validator");

// Validation rules for course creation
exports.validateCourse = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),


  //check course creation for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validation rules for course update
exports.validateCourseUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),


  //check course update for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];
