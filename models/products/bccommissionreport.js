const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const BcCommissionReport = sequelize.define('bccommissionreports', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    villageIdFK: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    bcCommissionIdFK: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    agentIdFK: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    totalTransactionCount: {
        type: Sequelize.STRING,
        allowNull: false
    },
    totalTransactionAmount: {
        type: Sequelize.STRING,
        allowNull: false
    },
    subTotalBCCommission: {
        type: Sequelize.STRING,
        allowNull: false
    },
    falseTransactionCommissionDeduced: {
        type: Sequelize.STRING,
        allowNull: false
    },
    totalEligibleBCCommission: {
        type: Sequelize.STRING,
        allowNull: false
    },
    eligibleCommissionOfBC: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = BcCommissionReport;