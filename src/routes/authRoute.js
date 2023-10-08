const express = require('express');
const router = express.Router();

const authCtrl = require('../app/controllers/authCtrl')
const middlewareCtrl = require('../app/controllers/middlewareCtrl')

router.post('/register', authCtrl.registerUser)
router.post('/login', authCtrl.loginUser)
router.post('/refresh', authCtrl.requestRefreshToken)
router.post('/logout', middlewareCtrl.validToken, authCtrl.logoutUser)

module.exports = router;