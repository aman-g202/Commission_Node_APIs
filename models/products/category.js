const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const BfCategory = sequelize.define('bfcategories', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = BfCategory;