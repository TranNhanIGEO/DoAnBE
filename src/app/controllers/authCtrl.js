const UserSchema = require('../models/User')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const AuthController = {
    async registerUser(req, res) {
        try {
            const {username, password, email} = await req.body
            const duplicateUser = await UserSchema.findOne({where: {username: username}})
            if (duplicateUser) return res.status(400).json({type: 'username', msg: 'Tài khoản đã tồn tại!'})
            const duplicateEmail = await UserSchema.findOne({where: {email: email}})
            if (duplicateEmail) return res.status(400).json({type: 'email', msg: 'Email đã được dùng để đăng ký!'})
            const hashedPassword = await bcrypt.hash(password, 10)
            
            const newUser = { username: username, password: hashedPassword, email: email, admin: false }
            const createUser = await UserSchema.create(newUser)
            res.status(200).json(createUser)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    async loginUser(req, res) {
        try {
            const formData = await req.body
            const getUser = await UserSchema.findOne({where: {username: formData.username}})
            if (!getUser) return res.status(404).json({type: 'username', msg: 'Tài khoản không tồn tại!'})
            const validPassword = await bcrypt.compare(formData.password, getUser.password)
            if (!validPassword) return res.status(404).json({type: 'password', msg: 'Mật khẩu không chính xác!'})

            const accessToken = AuthController.generateAccessToken(getUser)
            const refreshToken = AuthController.generateRefreshToken(getUser)
            getUser.refresh_token.push(refreshToken)
            getUser.changed('refresh_token', true)
            await getUser.save()
            const {password, email, refresh_token, ...orthersDetailUser} = getUser.dataValues
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 
            })
            res.status(200).json({...orthersDetailUser, accessToken})
        } catch (error) {
            res.status(500).json(error)
        }
    },
    async requestRefreshToken(req, res) {
        try {
            const refreshToken = req.cookies?.refresh_token
            if (!refreshToken) return res.status(401).json('You are not authenticated!')
            const getUser = await UserSchema.findOne({where: {refresh_token: {[Op.contains]: [refreshToken]}}})
            if (!getUser.refresh_token.includes(refreshToken)) return res.status(403).json('Refresh token not found!')
            
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
                if (err) return res.status(500).json(err)
                getUser.refresh_token = getUser.refresh_token.filter(token => token !== refreshToken)
                const newAccessToken = AuthController.generateAccessToken(user)
                const newRefreshToken = AuthController.generateRefreshToken(user)
                getUser.refresh_token.push(newRefreshToken)
                getUser.changed('refresh_token', true)
                await getUser.save()
                res.cookie('refresh_token', newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 
                })
                res.status(200).json({accessToken: newAccessToken})
            })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    generateAccessToken(getUser) {
        return jwt.sign({
            id: getUser.id,
            admin: getUser.admin
        },  process.env.JWT_ACCESS_KEY, {
            expiresIn: '30s'
        })
    },
    generateRefreshToken(getUser) {
        return jwt.sign({
            id: getUser.id,
            admin: getUser.admin
        },  process.env.JWT_REFRESH_KEY, {
            expiresIn: '1d'
        })
    },
    async logoutUser(req, res) {
        try {
            const refreshToken = req.cookies?.refresh_token
            if (!refreshToken) return res.status(401).json('You are not authenticated!')
            const getUser = await UserSchema.findOne({where: {refresh_token: {[Op.contains]: [refreshToken]}}})
            if (!getUser) return res.status(403).json('Refresh token not found!')
    
            getUser.refresh_token = getUser.refresh_token.filter(token => token !== refreshToken)
            getUser.changed('refresh_token', true)
            await getUser.save()
            res.clearCookie('refresh_token', {httpOnly: true, secure: false})
            res.status(200).json('Logged out')
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = AuthController