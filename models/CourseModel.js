const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    duration: {
      type: String,
      required: false,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      required: false
    },
    enrolledStudents: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      enrollmentDate: {
        type: Date,
        default: Date.now
      },
      progress: {
        type: Number,
        default: 0
      }
    }],
    completions: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
