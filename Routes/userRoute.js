const {Router} = require('express')
const { getallusers, register, login } = require('../Controllers/userController')

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getallusers', getallusers)

module.exports = router