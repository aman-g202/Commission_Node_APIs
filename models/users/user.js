const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userLoginId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    userType: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'ACTIVE'
    }
}, {
    timestamps: false
});

module.exports = User;