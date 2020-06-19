const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Enquiry = sequelize.define('enquiries', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    enquiryId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    priority: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bfProductIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    message: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    enquiryAssignToUserIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    createdByUserIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    customerName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    customerMobile: {
        type: Sequelize.STRING,
        allowNull: true
    },
    customerEmail: {
        type: Sequelize.STRING,
        allowNull: true
    },
    customerAddress: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    agentIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    enquiryStatus: {
        type: Sequelize.STRING,
        allowNull: true
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Enquiry;