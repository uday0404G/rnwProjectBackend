const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { authorizeTeacher } = require("../middleware/teacherAuth");
const { 
  getTeacherStudents,
  getStudentProgress
} = require("../controllers/teacherController");

// Protected teacher routes
router.use(auth);
router.use(authorizeTeacher);

// Get all students enrolled in teacher's courses
router.get("/students", getTeacherStudents);

// Get specific student's progress
router.get("/student-progress/:studentId/:courseId", getStudentProgress);

module.exports = router; 