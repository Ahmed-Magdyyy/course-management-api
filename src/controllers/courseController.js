const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');
const path = require('path');


// function to delete files
const deleteFile = (filename) => {
  if (!filename) return;

  try {
    const filePath = path.join(
      __dirname, 
      '../uploads/courses', 
      path.basename(filename)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Successfully deleted:', filename);
    } else {
      console.log('File not found:', filename);
    }
  } catch (err) {
    console.error('Deletion error:', err.message);
  }
};

// function to parse dates assuming it is written in this format (dd/mm/yyyy)
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(Date.UTC(year, month - 1, day));
};

// Create new course
exports.createCourse = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      startDate: parseDate(req.body.startDate),
      endDate: parseDate(req.body.endDate),
      price: Number(req.body.price),
      image: req.file?.filename
    };

    const course = await Course.create(data);
    
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    // delete uploaded file in case of error
    if (req.file?.filename) deleteFile(req.file.filename);
    next(error);
  }
};

// Update course by ID
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      if (req.file?.filename) deleteFile(req.file.filename);
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    const updateData = { ...req.body };
    let oldImage = null;

    // Handle image update
    if (req.file) {
      oldImage = course.image;
      updateData.image = req.file.filename;
    }

    // Parse dates
    if (req.body.startDate) updateData.startDate = parseDate(req.body.startDate);
    if (req.body.endDate) updateData.endDate = parseDate(req.body.endDate);
    if (req.body.price) updateData.price = Number(req.body.price);

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Delete old image after successful update
    if (req.file && oldImage) deleteFile(oldImage);

    res.status(200).json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    if (req.file?.filename) deleteFile(req.file.filename);
    next(error);
  }
};

// Get all courses
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().select("-id");
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(new ErrorResponse('Error fetching courses', 500));
  }
};

// Get single course by ID
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Delete course by ID
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};








