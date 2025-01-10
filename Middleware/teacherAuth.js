const authorizeTeacher = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No user data found" });
    }

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. Teacher rights required" });
    }

    next();
  } catch (error) {
    res.status(403).json({ message: "Authorization failed", error: error.message });
  }
};

module.exports = { authorizeTeacher }; 