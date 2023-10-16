const express = require('express')
const router = express.Router()

const dataCtrl = require('../app/controllers/dataCtrl')
const middlewareCtrl = require('../app/controllers/middlewareCtrl')

router.get('/statistic', middlewareCtrl.validTokenForAdmin, dataCtrl.showStatistic)
router.post('/statistic/create', middlewareCtrl.validTokenForAdmin, dataCtrl.createStatistic)
router.put('/statistic/:id/update', middlewareCtrl.validTokenForAdmin, dataCtrl.updateStatistic)

router.get('/', middlewareCtrl.validTokenForAdmin, dataCtrl.showSchool)
router.post('/create', middlewareCtrl.validTokenForAdmin, dataCtrl.createSchool)
router.put('/:id/update', middlewareCtrl.validTokenForAdmin, dataCtrl.updateSchool)
router.delete('/:id/delete', middlewareCtrl.validTokenForAdmin, dataCtrl.deleteSchool)

router.get('/score', middlewareCtrl.validTokenForAdmin, dataCtrl.showScore)
router.post('/score/create', middlewareCtrl.validTokenForAdmin, dataCtrl.createScore)
router.put('/score/:id/update', middlewareCtrl.validTokenForAdmin, dataCtrl.updateScore)

module.exports = router