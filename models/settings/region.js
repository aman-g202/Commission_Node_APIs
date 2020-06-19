const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Region = sequelize.define('regions', {
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
    zoneIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Region;