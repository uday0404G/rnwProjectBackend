const User = require('../models/usermodel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SecretKey = "Teacher@123"
const mongoose = require('mongoose')
const Course = require('../models/CourseModel')

const getallusers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const students = users.filter(user => user.role === 'student');
        const teachers = users.filter(user => user.role === 'teacher');
        
        res.json({
            students: students.map(student => ({
                ...student.toObject(),
                enrolledCourses: student.enrolledCourses || [],
                status: student.status || 'active'
            })),
            teachers: teachers.map(teacher => ({
                ...teacher.toObject(),
                status: teacher.status || 'active'
            }))
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const register = async (req, res) => {
    try {
        const { name, email, password, role,secretKey } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // If registering as Teacher, verify secret key
        if (role === 'teacher' && req.body.secretKey !== SecretKey) {
            return res.status(403).json({ message: 'Invalid admin secret key' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        await user.save();
        res.status(201).json({
            status: "success",
            message: 'Registration successful',
            user: { name: user.name, email: user.email, role: user.role },
            token
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

       

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response with token and user details
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const student = await User.findById(studentId)
      .select('-password')
      .populate({
        path: 'enrolledCourses',
        select: 'title description image progress instructor',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify that the found user is actually a student
    if (student.role !== 'student') {
      return res.status(400).json({ message: 'User is not a student' });
    }

    res.json({
      ...student.toObject(),
      enrolledCourses: student.enrolledCourses || [],
      status: student.status || 'active',
      avatar: student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`
    });
  } catch (error) {
    console.error('Get student details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTeacherDetails = async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log('Getting teacher details for ID:', teacherId); // Debug log
    
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      console.log('Invalid teacher ID format'); // Debug log
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    const teacher = await User.findById(teacherId)
      .select('-password');

    console.log('Found teacher:', teacher); // Debug log

    if (!teacher) {
      console.log('No teacher found with this ID'); // Debug log
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (teacher.role !== 'teacher') {
      console.log('User found but not a teacher. Role:', teacher.role); // Debug log
      return res.status(400).json({ message: 'User is not a teacher' });
    }

    const response = {
      ...teacher.toObject(),
      status: teacher.status || 'active',
      avatar: teacher.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}`
    };

    console.log('Sending response:', response); // Debug log
    res.json(response);
  } catch (error) {
    console.error('Get teacher details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate({
        path: 'enrolledCourses',
        select: 'title description enrolledStudents'
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all courses created by this teacher
    const courses = await Course.find({ instructor: req.user.userId })
      .populate('enrolledStudents', 'name email');

    const totalStudents = courses.reduce((total, course) => 
      total + (course.enrolledStudents?.length || 0), 0
    );

    res.json({
      ...user.toObject(),
      totalCourses: courses.length,
      totalStudents,
      courses
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, bio, phone, avatar },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {getallusers,register,login,getStudentDetails,getTeacherDetails,getProfile,updateProfile,changePassword}