const Course = require("../models/CourseModel");
const mongoose = require('mongoose');
const User = require("../models/usermodel");

const createCourse = async (req, res) => {
  try {
    const { title, description, duration, image, level = 'beginner' } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    // Get instructor ID from the authenticated user
    const instructorId = req.user.userId;

    const course = new Course({
      title,
      description,
      duration,
      image,
      level,
      instructor: instructorId,
      enrolledStudents: [],
      status: 'active'
    });

    const savedCourse = await course.save();
    
    // Populate the instructor details before sending response
    const populatedCourse = await Course.findById(savedCourse._id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email');

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findByIdAndUpdate(
      id, 
      { ...updates, instructor: req.user.userId },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    const courses = await Course.find({ instructor: teacherId })
      .populate('enrolledStudents', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Get teacher courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.userId;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if already enrolled
        const isEnrolled = course.enrolledStudents.some(
            enrollment => enrollment.student.toString() === userId
        );

        if (isEnrolled) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        // Add student to course
        course.enrolledStudents.push({
            student: userId,
            enrollmentDate: new Date(),
            progress: 0
        });

        await course.save();

        // Add course to user's enrolled courses
        await User.findByIdAndUpdate(userId, {
            $push: { enrolledCourses: courseId }
        });

        res.status(200).json({ message: "Successfully enrolled in course" });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const user = await User.findById(userId)
            .populate({
                path: 'enrolledCourses',
                populate: {
                    path: 'instructor',
                    select: 'name email'
                }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.enrolledCourses);
    } catch (error) {
        console.error('Get enrolled courses error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
  enrollInCourse,
  getEnrolledCourses
};

