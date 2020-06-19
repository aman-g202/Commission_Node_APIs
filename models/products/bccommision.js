const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const BcCommission = sequelize.define('bccommissions', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    month: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = BcCommission;