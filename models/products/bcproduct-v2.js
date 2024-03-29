const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const BcProductV2 = sequelize.define(
  "bcproductsV2",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    companyComission: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    agentComission: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    productDetail: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = BcProductV2;
