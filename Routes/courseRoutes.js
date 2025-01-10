const express = require("express");
const CourseRoute = express.Router();
const { auth } = require("../Middleware/auth");
const { authorizeTeacher } = require("../Middleware/teacherAuth");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
} = require("../controllers/courseController");

// Apply auth middleware to all routes
CourseRoute.use(auth);

// Public routes
CourseRoute.get("/", getCourses);
CourseRoute.get("/:id", getCourseById);

// Teacher-only routes
CourseRoute.post("/", authorizeTeacher, createCourse);
CourseRoute.put("/:id", authorizeTeacher, updateCourse);
CourseRoute.delete("/:id", authorizeTeacher, deleteCourse);

// Add new route for teacher courses
CourseRoute.get('/teacher/:teacherId', getTeacherCourses);

module.exports = CourseRoute;
