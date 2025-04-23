const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const {
  validateCourse,
  validateCourseUpdate,
} = require("../middleware/validation");

router.get("/", getAllCourses);

router.get("/:id", getCourseById);

router.post("/", upload, validateCourse, createCourse);

router.put("/:id", upload, validateCourseUpdate, updateCourse);

router.delete("/:id", deleteCourse);

module.exports = router;
