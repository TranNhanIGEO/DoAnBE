const Sequelize = require('sequelize');
const db = require('../../dbSequelize');

const ChatSchema = db.define('dulieu_tinnhan',{
    message: {
        type: Sequelize.STRING,
        required: true
    },
    users: Sequelize.ARRAY(Sequelize.STRING),
    sender: {
        type: Sequelize.UUID,
        references: { model: 'dulieu_nguoisudung', key: 'id' },
        required: true
    }
}, {
    timestamps: true,
    paranoid: false,
    freezeTableName: true,
    tableName: "dulieu_tinnhan"
});

(async () => {
    try {
        await ChatSchema.sync({ force: false });
    } catch (error) {
        console.error(error);
    }
})()

module.exports = ChatSchema;