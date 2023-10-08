const { Op } = require('sequelize')
const UserSchema = require('../models/User')
const ChatSchema = require('../models/Chat')

const ChatController = {
    async getAllContact(req, res) {
        try {
            const getContact = await UserSchema.findAll({where: {id: {[Op.ne]: req.params.id}}, attributes: ["id", "email", "username", "avatar"]})
            res.status(200).json(getContact)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    async addMessage(req, res) {
        try {
            const {from, to, message} = req.body
            const newMessage = await ChatSchema.create({
                message: message,
                users: [from, to],
                sender: from,
            })
            res.status(200).json(newMessage)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    async getAllMessage(req, res) {
        try {
            const {from, to} = req.body
            const getMessage = await ChatSchema.findAll({where: {users: {[Op.contains]: [from, to]}}})
            const arrMessage = getMessage.map((msg) => ({
                fromSelf: msg.sender === from,
                message: msg.message
            }))
            res.status(200).json(arrMessage)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = ChatController