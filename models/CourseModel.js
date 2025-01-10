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
      ref: "User", // Assuming you have a User model for the instructor
      required: true,
    },
    image: {
      type: String, // Base64 or image URL
      required: false,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson", // Assuming you have a Lesson model for lessons
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referencing the User model for enrolled students
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
