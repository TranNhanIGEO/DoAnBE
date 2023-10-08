const UserSchema = require('../models/User')
const bcrypt = require('bcrypt')

const UserController = {
    async showAllUsers(req, res) {
        const getAllUsers = await UserSchema.findAll({where: {admin: true, super_admin: false}})
        if (!getAllUsers) return res.status(400).json('Users not found')
        res.status(200).json(getAllUsers)
    },
    async createUser(req, res) {
        const { username, password, email, role } = await req.body
        const duplicateUser = await UserSchema.findOne({where: { username: username }})
        if (duplicateUser) return res.status(400).json('User already exists')
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = { username: username, password: hashedPassword, email: email, role: role }
        const createUser = await UserSchema.create(newUser)
        res.status(200).json(createUser)
    },
    async updateUser(req, res) {
        const { username, password, email } = await req.body
        if (!req.params.id) return res.status(400).json('User not found')
        const getUser = await UserSchema.findOne({where: {id: req.params.id}})
        if (!getUser) return res.status(400).json('User not found')
        const duplicateUser = await UserSchema.findOne({where: {username: username}})
        if (getUser.username !== username && duplicateUser) return res.status(400).json('User already exists')     

        getUser.username = username
        getUser.email = email
        if (getUser.password !== password && password !== '') getUser.password = await bcrypt.hash(password, 10)
        const updateUser = await getUser.save()
        res.status(200).json(updateUser)
    },
    async deleteUser(req, res) {
        if (!req.params.id) return res.status(400).json('User not found')
        const getUser = await UserSchema.findOne({where: {id: req.params.id}})
        if (!getUser) return res.status(400).json('User not found')
        const deleteUser = await getUser.destroy()
        res.status(200).json(deleteUser)
    }
}

module.exports = UserController