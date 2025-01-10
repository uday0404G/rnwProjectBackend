const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// Route to create a new course
router.post("/", createCourse);

// Route to get all courses
router.get("/", getCourses);

// Route to get a specific course by ID
router.get("/:id", getCourseById);

// Route to update a course
router.put("/:id", updateCourse);

// Route to delete a course
router.delete("/:id", deleteCourse);

module.exports = router;
