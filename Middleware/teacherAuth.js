const authorizeTeacher = (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. Teachers only." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error in authorization", error });
  }
};

module.exports = { authorizeTeacher }; 