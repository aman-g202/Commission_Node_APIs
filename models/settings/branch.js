const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const Branch = sequelize.define('branchs', {
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
    districtIdFK: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    branchCode: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Branch;