const pool = require('../../dbConfig')
const query = require('../query/queryMap')

const MapController = {
    getAddress(req, res) {
        const address = req.query.address
        pool.query(query.getAddress(address), (erorr, result) => {
            if (erorr) throw erorr
            res.status(200).json(result.rows)
        })
    },
    getMinScore(req, res) {
        const layer = req.query.layer
        pool.query(query.getMinScore(layer), (erorr, result) => {
            if (erorr) throw erorr
            res.status(200).json(result.rows)
        })
    },
    getSchoolName(req, res) {
        const school = req.query.school
        pool.query(query.getSchoolName(school), (erorr, result) => {
            if (erorr) throw erorr
            res.status(200).json(result.rows)
        })
    },
    getLayerStatistic(req, res) {
        const layer = req.query.layer
        pool.query(query.getLayerStatistic(layer), (erorr, result) => {
            if (erorr) throw erorr
            res.status(200).json(result.rows)
        })
    },
    renderChart(req, res) {
        const {layer, school} = req.query
        pool.query(query.renderChart({layer, school}), (erorr, result) => {
            if (erorr) throw erorr
            if (result.rowCount === 0) return res.status(200).json({type: 'name', status: 'error', msg: 'Tên trường không đúng, vui lòng nhập lại!!'})
            const [resultRows] = result.rows
            res.status(200).json({layer: layer, status: 'success', msg: 'Hiển thị thống kê thành công', data: resultRows})
        })
    },
    advisingEnrollment(req, res) {
        const {layer, distance, score, longitude, latitude} = req.query
        pool.query(query.getMinScore(layer), (error, result) => {
            if (error) throw error
            const [getScore] = result.rows
            const minScore = getScore.min
            if (score !== '0' && score < minScore) return res.status(200).json({type:'score', status: 'error', msg: `Điểm của bạn phải lớn hơn hoặc bằng ${minScore}`,  data: minScore})
            
            pool.query(query.advisingEnrollment({layer, distance, score, longitude, latitude}), (error, result) => {
                if (error) throw error
                if (result.rowCount === 0) return res.status(200).json({type: 'distance', status: 'error', msg: 'Bán kính hiện tại không có trường đủ điều kiện xét tuyển', data: distance})
                res.status(200).json({layer: layer, status: 'success', msg: 'Tư vấn tuyển sinh thành công', data: result.rows})
            })
        })
    }
}

module.exports = MapController