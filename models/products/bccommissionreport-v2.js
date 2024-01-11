const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const BcCommissionReportV2 = sequelize.define(
  "bccommissionreportsV2s",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    villageIdFK: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    bcCommissionIdFK: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    agentIdFK: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalTransactionCount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    totalTransactionAmount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    subTotalBCCommission: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    eligibleCommissionOfBC: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = BcCommissionReportV2;
