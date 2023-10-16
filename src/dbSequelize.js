const Sequelize = require('sequelize')
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'})

// const sequelize = new Sequelize('postgres://postgres:12345@0.tcp.ap.ngrok.io:19785/DoAn')
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
)

module.exports = sequelize