const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Bank = sequelize.define('banks', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    bankName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Bank;