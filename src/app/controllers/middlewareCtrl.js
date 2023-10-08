const jwt = require('jsonwebtoken')

const MidderwareController = {
    validToken(req, res, next) {
        const authHeader = req.headers.authorization
        if(!authHeader) return res.status(401).json('You are not authenticated!')
        const [bearer, token] = authHeader.split(' ')
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
            if(err || !user) return res.status(403).json('Invalid token')
            req.getUser = user
            next()
        })
    },
    validTokenForAdmin(req, res, next) {
        MidderwareController.validToken(req, res, () => {
            req.getUser.admin ? next() : res.status(403).json('You are not an admin!')
        })
    }
}

module.exports = MidderwareController