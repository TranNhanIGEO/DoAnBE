const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const dataRoute = require('./dataRoute')
const mapRoute = require('./mapRoute')
const chatRoute = require('./chatRoute')

function routes(app) {
    app.use('/v1/auth', authRoute)
    app.use('/v1/users', userRoute)
    app.use('/v1/data', dataRoute)
    app.use('/v1/maps', mapRoute)
    app.use('/v1/chat', chatRoute)
}

module.exports = routes