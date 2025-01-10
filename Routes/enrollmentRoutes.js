const express = require('express');
const enrollmentRoute = express.Router();
const { auth } = require('../Middleware/auth');
const {
    enrollInCourse,
    getEnrolledCourses,
    updateProgress
} = require('../Controllers/enrollmentController');

// All routes require authentication
enrollmentRoute.use(auth);

// Enroll in a course
enrollmentRoute.post('/enroll/:courseId', enrollInCourse);

// Get enrolled courses
enrollmentRoute.get('/my-courses', getEnrolledCourses);

// Update course progress
enrollmentRoute.put('/progress/:courseId', updateProgress);

module.exports = enrollmentRoute; 