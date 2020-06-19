const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Operator = sequelize.define('operators', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    mobile: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    address: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Operator;