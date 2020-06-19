const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Issues = sequelize.define('issues', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    createdAt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true
    },
    message: {
        type: Sequelize.TEXT,
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
    status: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Issues;