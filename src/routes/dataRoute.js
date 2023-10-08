const express = require('express')
const router = express.Router()

const dataCtrl = require('../app/controllers/dataCtrl')
const middlewareCtrl = require('../app/controllers/middlewareCtrl')

router.put('/statistic/:id/update', middlewareCtrl.validTokenForAdmin, dataCtrl.updateStatistic)
router.post('/statistic/create', middlewareCtrl.validTokenForAdmin, dataCtrl.createStatistic)
router.get('/statistic', middlewareCtrl.validTokenForAdmin, dataCtrl.showStatistic)

router.post('/create', middlewareCtrl.validTokenForAdmin, dataCtrl.insertData)
router.put('/:id/update', middlewareCtrl.validTokenForAdmin, dataCtrl.updateData)
router.delete('/:id/delete', middlewareCtrl.validTokenForAdmin, dataCtrl.deleteData)
router.get('/', middlewareCtrl.validTokenForAdmin, dataCtrl.showData)

router.get('/score', middlewareCtrl.validTokenForAdmin, dataCtrl.showScore)
router.put('/score/:id/update', middlewareCtrl.validTokenForAdmin, dataCtrl.updateScore)

module.exports = router