const express = require('express');
const router = express.Router()

const chatCtrl = require('../app/controllers/chatCtrl')

router.get('/getcontact/:id', chatCtrl.getAllContact)
router.post('/addmessage', chatCtrl.addMessage)
router.post('/getmessage', chatCtrl.getAllMessage)

module.exports = router