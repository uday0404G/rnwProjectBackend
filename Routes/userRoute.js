const {Router} = require('express')
const { getallusers, register, login, getStudentDetails, getTeacherDetails, getProfile, updateProfile, changePassword } = require('../Controllers/userController')
const { auth } = require('../Middleware/auth')
const { authorizeTeacher } = require('../Middleware/teacherAuth')

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getallusers', auth, getallusers)
router.get('/student/:studentId', auth, authorizeTeacher, getStudentDetails)
router.get('/teacher/:teacherId', auth, authorizeTeacher, getTeacherDetails)
router.get('/profile', auth, getProfile)
router.put('/profile', auth, updateProfile)
router.put('/change-password', auth, changePassword)

module.exports = router