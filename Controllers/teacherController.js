const Course = require("../models/Course");
const User = require("../models/User");
const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");

// Get all students enrolled in teacher's courses
const getTeacherStudents = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    
    // Find all courses by this teacher
    const courses = await Course.find({ instructor: teacherId });
    const courseIds = courses.map(course => course._id);
    
    // Find all enrollments for these courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds }
    }).populate('student').populate('course');
    
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get student progress in a specific course
const getStudentProgress = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    
    const progress = await Progress.findOne({
      student: studentId,
      course: courseId
    }).populate('completedLessons.lesson');
    
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTeacherStudents,
  getStudentProgress
}; 