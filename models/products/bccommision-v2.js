const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const BcCommissionV2 = sequelize.define(
  "bccommissionsV2s",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    month: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = BcCommissionV2;
