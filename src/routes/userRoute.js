const express = require('express');
const router = express.Router()

const userCtrl = require('../app/controllers/userCtrl')
const middlewareCtrl = require('../app/controllers/middlewareCtrl')

router.post('/create', middlewareCtrl.validTokenForAdmin, userCtrl.createUser)
router.put('/:id/update', middlewareCtrl.validTokenForAdmin, userCtrl.updateUser)
router.delete('/:id', middlewareCtrl.validTokenForAdmin, userCtrl.deleteUser)
router.get('/', middlewareCtrl.validTokenForAdmin, userCtrl.showAllUsers)

module.exports = router