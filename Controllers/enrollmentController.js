const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");

// Enroll a student in a course
const enrollStudentInCourse = async (req, res) => {
  const {studentId ,courseId} = req.body; 
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student is already enrolled
    const existingEnrollment = await Enrollment.findOne({ course: courseId, student: studentId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Student already enrolled in this course" });
    }

    const newEnrollment = new Enrollment({
      course: courseId,
      student: studentId,
    });

    await newEnrollment.save();

    res.status(201).json({ message: "Student enrolled successfully", enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all students enrolled in a course
const getEnrolledStudents = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate("enrolledStudents");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollments = await Enrollment.find({ course: courseId }).populate("student");
    const students = enrollments.map(e => e.student);

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  enrollStudentInCourse,
  getEnrolledStudents,
};
