const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Agent = sequelize.define('agents', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    agentId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    userIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    fullName: {
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
    aadharNumber: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    panNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dob: {
        type: Sequelize.STRING,
        allowNull: true
    },
    education: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bloodgroup: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bankIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    villageIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Agent;