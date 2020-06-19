const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const BcCommissionRow = sequelize.define('bccommissionrows', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    reportIdFK: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    productIdFK: {
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
        allowNull: true
    },
    totalSalesAmt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = BcCommissionRow;