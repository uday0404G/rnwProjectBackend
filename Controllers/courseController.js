const Course = require("../models/Course");


const createCourse = async (req, res) => {
  const { title, description, instructor, image } = req.body;

  try {
    if (!title || !description || !instructor) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const course = new Course({
      title,
      description,
      instructor,
      image, 
    });

    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const course = await Course.findByIdAndUpdate(id, updates, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

 const getCourses=async (req, res) => {
    try {
      const courses = await Course.find().populate("instructor lessons");
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
 const getCourseById= async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate("instructor lessons");
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  const deleteCourse= async (req, res) => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }


  
module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,

};

