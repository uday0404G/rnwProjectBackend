const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to the Course model
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (students)
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
