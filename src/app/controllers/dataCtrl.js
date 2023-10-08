const pool = require('../../dbConfig')
const query = require('../query/queryData')

const DataController = {
    showData(req, res) {
        const layer = req.query.layer
        pool.query(query.showData(layer), (error, result) => {
            if (error) throw error
            res.status(200).json(result.rows)
        })
    },
    insertData(req, res) {
        const {layer, type, id, name, address, web, long, lat} = req.body
        pool.query(query.insertData({layer, type, id, name, address, web, long, lat}), (error, result) => {
            if (error) throw error
            res.status(200).json(result)   
        })
    },
    updateData(req, res) {
        const {layer, name, address, web} = req.body
        const id = req.params.id
        pool.query(query.updateData({layer, id, name, address, web}), (error, result) => {
            if (error) throw error
            res.status(200).json(result)   
        })
    },
    deleteData(req, res) {
        const layer = req.query.layer
        const id = req.params.id
        pool.query(query.deleteData({layer, id}), (error, result) => {
            if (error) throw error
            res.status(200).json(result)
        })
    },
    showScore(req, res) {
        const layer = req.query.layer
        pool.query(query.showScore(layer), (error, result) => {
            if (error) throw error
            res.status(200).json(result.rows)   
        })
    },
    updateScore(req, res) {
        const id = req.params.id
        pool.query(query.updateScore(req.body, id), (error, result) => {
            if (error) throw error
            res.status(200).json(result)   
        })
    },
    showStatistic(req, res) {
        const {layer, year} = req.query
        pool.query(`SELECT namht FROM ${layer}`, (error, result) => {
            if (error) throw error
            const getYear = result.rows[0].namht
            pool.query(query.showStatistic({layer, year, getYear}), (error, result) => {
                if (error) throw error
                res.status(200).json(result.rows)
            })   
        })  
    },
    createStatistic(req, res) {
        const {layer, year} = req.body
        pool.query(query.createStatistic({layer, year}), (error, result) => {
            if (error) throw error
            res.status(200).json(result.rows)
        })
    },
    updateStatistic(req, res) {
        const {layer, year, target, registration} = req.body
        const id = req.params.id
        pool.query(`SELECT namht FROM ${layer}`, (error, result) => {
            if (error) throw error
            const getYear = result.rows[0].namht
            pool.query(query.updateStatistic({layer, id, year, getYear, target, registration}), (error, result) => {
                if (error) throw error
                res.status(200).json(result.rows)
            })     
        })     
    }
}

module.exports = DataController