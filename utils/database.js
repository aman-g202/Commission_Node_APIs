const Sequelize = require('sequelize');
// pass: Technomize@pma24
// const sequelize = new Sequelize('csd_db', 'root', '', {
const sequelize = new Sequelize('csd_db', 'root', 'Technomize@pma24', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 100
    },
});

module.exports = sequelize;