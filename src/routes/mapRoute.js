const express = require('express')
const router = express.Router({mergeParams: true})

const mapCtrl = require('../app/controllers/mapCtrl')

router.get('/getaddress', mapCtrl.getAddress)
router.get('/getminscore', mapCtrl.getMinScore)
router.get('/getschoolname', mapCtrl.getSchoolName)
router.get('/getlayerstatistic', mapCtrl.getLayerStatistic)
router.get('/renderchart', mapCtrl.renderChart)
router.get('/advisingenrollment', mapCtrl.advisingEnrollment)

module.exports = router