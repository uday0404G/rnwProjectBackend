const { auth } = require('./auth');
const { authorizeTeacher } = require('./teacherAuth');

const protectTeacherRoutes = [auth, authorizeTeacher];

module.exports = { protectTeacherRoutes }; 