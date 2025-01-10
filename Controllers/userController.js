const User = require('../models/usermodel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SecretKey = "Teacher@123"

const getallusers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}
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


module.exports = {getallusers,register,login}