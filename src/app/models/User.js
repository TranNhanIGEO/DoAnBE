const Sequelize = require('sequelize');
const db = require('../../dbSequelize');

const UserSchema = db.define('dulieu_nguoisudung',{
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.UUIDV4
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    refresh_token: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
    },
    super_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    role: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
    }
}, {
    timestamps: true,
    paranoid: false,
    freezeTableName: true,
    tableName: "dulieu_nguoisudung"
});

(async () => {
    try {
        await UserSchema.sync({ force: false });
    } catch (error) {
        console.error(error);
    }
})()

module.exports = UserSchema;