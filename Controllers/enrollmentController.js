const Enrollment = require('../models/EnrollmentModel');
const Course = require('../models/CourseModel');
const User = require('../models/usermodel');

const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.userId;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        // Create new enrollment
        const enrollment = new Enrollment({
            student: studentId,
            course: courseId
        });

        await enrollment.save();

        // Update course enrollments
        await Course.findByIdAndUpdate(courseId, {
            $push: { enrolledStudents: { student: studentId } }
        });

        // Update user enrolled courses
        await User.findByIdAndUpdate(studentId, {
            $push: { enrolledCourses: courseId }
        });

        res.status(201).json({ 
            message: "Successfully enrolled in course",
            enrollment
        });

    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getEnrolledCourses = async (req, res) => {
    try {
        const studentId = req.user.userId;

        const enrollments = await Enrollment.find({ student: studentId })
            .populate({
                path: 'course',
                populate: {
                    path: 'instructor',
                    select: 'name email'
                }
            });

        res.json(enrollments);
    } catch (error) {
        console.error('Get enrolled courses error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { progress } = req.body;
        const studentId = req.user.userId;

        const enrollment = await Enrollment.findOneAndUpdate(
            { student: studentId, course: courseId },
            { progress },
            { new: true }
        );

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.json(enrollment);
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    enrollInCourse,
    getEnrolledCourses,
    updateProgress
}; 