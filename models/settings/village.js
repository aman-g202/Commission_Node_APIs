const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Village = sequelize.define('villages', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    branchIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Village;