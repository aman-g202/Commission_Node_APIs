const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const BfCommission = sequelize.define('bfcommissions', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    productIdFK: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    agentIdFK: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    productPrice: {
        type: Sequelize.STRING,
        allowNull: false
    },
    companyCommission: {
        type: Sequelize.STRING,
        allowNull: false
    },
    agentCommission: {
        type: Sequelize.STRING,
        allowNull: false
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    month: {
        type: Sequelize.STRING,
        allowNull: false
    },
    vendorIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
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

module.exports = BfCommission;