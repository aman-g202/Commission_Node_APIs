const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Zone = sequelize.define('zones', {
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
    bankIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Zone;