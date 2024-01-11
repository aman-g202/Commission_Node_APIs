const XLSX = require("xlsx");
const Sequelize = require("sequelize");
const sequelize = require("../../utils/database");
const async = require("async");

const Op = Sequelize.Op;

const Utils = require("../../utils/utils");
const config = require("../../config");

const BcProductV2 = require("../../models/products/bcproduct-v2");
const Agent = require("../../models/users/agent");
const BcCommissionV2 = require("../../models/products/bccommision-v2");
const BcCommissionRowV2 = require("../../models/products/bccommissionrow-v2");
const BcCommissionReportV2 = require("../../models/products/bccommissionreport-v2");

exports.createBcProduct = (req, res, next) => {
  Utils.checkInputError(req);

  const dataToCreate = req.body;
  let createdAt = Utils.getDateTime(
    new Date().toLocaleString(config.country, { timeZone: config.timeZone })
  );
  dataToCreate.createdAt = createdAt;

  BcProductV2.create(dataToCreate)
    .then((result) => {
      Utils.sendResponse(res, 201);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteBcProduct = (req, res, next) => {
  Utils.checkInputError(req);
  const id = req.params.bcProductId;

  BcProductV2.findByPk(id)
    .then((prod) => {
      if (!prod) {
        Utils.sendError("BcProduct does not exists", 404);
      }
      return BcProductV2.destroy({ where: { id: id } });
    })
    .then((result) => {
      Utils.sendResponse(res, 202);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.fetchAllBcProducts = (req, res, next) => {
  let page = req.query.page;
  let limit = req.query.limit;
  let searchQuery;
  let totalCounts;

  searchQuery = {
    where: {},
  };

  if (typeof page === "undefined" || typeof page === "") {
    page = 1;
  }

  BcProductV2.count({ where: searchQuery.where })
    .then((count) => {
      totalCounts = parseInt(count);
      if (typeof limit === "undefined" || typeof limit === "") {
        limit = totalCounts;
      }
      searchQuery.limit = parseInt(limit);
      searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
      return BcProductV2.findAll(searchQuery);
    })
    .then((bcproducts) => {
      Utils.sendResponse(res, 200, bcproducts, totalCounts);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.uploadExcel = (req, res, next) => {
  Utils.checkInputError(req);
  const month = req.body.month;
  const file = req.file ? req.file : null;
  let parsedData;
  let fetchedProductNamesFromExcel;
  let i;

  if (!file) {
    Utils.sendError("File is not provided", 406);
  }

  let createdAt = Utils.getDateTime(
    new Date().toLocaleString(config.country, { timeZone: config.timeZone })
  );

  /* Parsed excel file and stored in worksheet */
  const wb = XLSX.readFile(file.path);
  Utils.clearExcel(file.path);
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];

  const columnAgentId = [];

  /*  fetched all agentId of excel sheet */
  for (let z in ws) {
    if (z.toString()[0] === "D" && z !== "D1") {
      columnAgentId.push(ws[z].v);
    }
  }

  /* Find all agent id primary key corresponding to each agentId */
  Agent.findAll({
    where: { agentId: { [Op.in]: columnAgentId } },
    attributes: ["id", "agentId"],
  })
    .then((agents) => {
      /* Map each agentId to its primary key and update the array */
      for (i = 0; i < columnAgentId.length; i++) {
        for (let j = 0; j < agents.length; j++) {
          if (columnAgentId[i] == agents[j].agentId) {
            columnAgentId[i] = agents[j].id;
            break;
          }
        }
      }

      /* Update the col agentId of sheet by its mapped primary key */
      i = 0;
      for (let z in ws) {
        if (z.toString()[0] === "D" && z !== "D1") {
          ws[z].v = columnAgentId[i];
          i++;
        }
      }

      /* Find all range of sheet to determine the each product info and their id's */
      var range = XLSX.utils.decode_range(ws["!ref"]);
      fetchedProductNamesFromExcel = [];
      let productIds = [];
      let temp;

      /* fetched all products coloumn info of 0th row from sheet  */
      for (i = 5; i <= range.e.c - 5; i++) {
        cell = ws[XLSX.utils.encode_cell({ c: i, r: 0 })];
        fetchedProductNamesFromExcel.push(cell);
      }

      /* determined the id,s of each product seperated by @, as each product info take 3 cols */
      for (i = 0; i < fetchedProductNamesFromExcel.length; i += 3) {
        temp = fetchedProductNamesFromExcel[i].v.split("@");
        productIds.push(temp[temp.length - 1]);
      }

      /* Find all products info corresponding to id's */
      return BcProductV2.findAll({
        where: { id: { [Op.in]: productIds } },
        attributes: ["id", "price", "companyComission"],
      });
    })
    .then((prodsInfo) => {
      /* stored coloumn names as col1 col2 col3 in each products info */
      let count = 0;
      let t;
      for (i = 0; i < prodsInfo.length; i++) {
        t = 1;
        for (let j = i + count; j < i + count + 3; j++) {
          if (t === 1) {
            prodsInfo[i].dataValues.col1 = fetchedProductNamesFromExcel[j].v;
          } else if (t === 2) {
            prodsInfo[i].dataValues.col2 = fetchedProductNamesFromExcel[j].v;
          } else if (t === 3) {
            prodsInfo[i].dataValues.col3 = fetchedProductNamesFromExcel[j].v;
          }
          t++;
        }
        count += 2;
      }

      /* parsed the sheet to get data in json format */
      parsedData = XLSX.utils.sheet_to_json(ws);
      /* Setuped transactions */
      return sequelize.transaction((t) => {
        return BcCommissionV2.create(
          { month, createdAt, createdBy: req.userId },
          { transaction: t }
        ).then((result) => {
          /* Prepared async for loop for each row of sheet */
          return async.eachSeries(parsedData, (item, cb) => {
            /* prepared bcCommissionReport table data */
            let bcCommissionReportData = {
              villageIdFK: item["Village Name"],
              bcCommissionIdFK: result.id,
              agentIdFK: item["Agent Id"],
              totalTransactionCount: item["Total Txn Count"],
              totalTransactionAmount: item["Total Txn Amount"],
              totalTransactionAmount: item["Total Txn Amount"],
              subTotalBCCommission: item["Sub-Total BC-Commission"],
              // falseTransactionCommissionDeduced:
              //   item[
              //     "Commission Deducted for false Transactions (Round-Tripping)"
              //   ],
              // totalEligibleBCCommission: item["Total Eligible BC-Commission"],
              eligibleCommissionOfBC: item["eligibel Commission of BC"],
            };

            /* Inserted each row in to the bcCommissionReport table */
            BcCommissionReportV2.create(bcCommissionReportData, {
              transaction: t,
            })
              .then((result) => {
                /* For each row of bcCommissionReport table prepared BcCommissionRow table's products info */
                let rowData = [];
                for (i = 0; i < prodsInfo.length; i++) {
                  rowData.push({
                    reportIdFK: result.id,
                    productIdFK: prodsInfo[i].dataValues.id,
                    productPrice: prodsInfo[i].dataValues.price,
                    companyCommission: prodsInfo[i].dataValues.companyComission,
                    agentCommission: item[prodsInfo[i].dataValues.col3],
                    totalSalesAmt: item[prodsInfo[i].dataValues.col2],
                    qty: item[prodsInfo[i].dataValues.col1],
                  });
                }
                return BcCommissionRowV2.bulkCreate(rowData, {
                  transaction: t,
                });
              })
              .then((result) => {
                cb();
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                cb(err);
              });
          });
        });
      });
    })
    .then((result) => {
      Utils.sendResponse(res, 201);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.fetchBcCommisions = (req, res, next) => {
  Utils.checkInputError(req);
  const agentId = req.query.agentId;
  const currMonth =
    req.query.currentMonth === "" ||
    typeof req.query.currentMonth === "undefined"
      ? false
      : req.query.currentMonth;
  const startMonth =
    req.query.startMonth === "" || typeof req.query.startMonth === "undefined"
      ? false
      : req.query.startMonth;
  const endMonth =
    req.query.endMonth === "" || typeof req.query.endMonth === "undefined"
      ? false
      : req.query.endMonth;
  // let page = req.query.page;
  // let limit = req.query.limit;
  // let totalCounts;

  let searchQuery = {
    where: {},
    include: [
      {
        model: BcCommissionReportV2,
        required: true,
        where: {},
        include: [
          {
            model: BcCommissionRowV2,
            required: true,
          },
          {
            model: Agent,
            required: true,
          },
        ],
      },
    ],
  };

  // if (page === '' || typeof page === 'undefined') {
  //     page = 1;
  // }

  if (currMonth && startMonth && endMonth) {
    Utils.sendError("Pass either currentMonth or startMonth and endMonth", 406);
  }

  if (agentId) {
    searchQuery.include[0].where.agentIdFK = agentId;
  }

  if (currMonth) {
    searchQuery.where.month = currMonth;
  }

  if (startMonth && endMonth) {
    searchQuery.where.month = {
      [Op.between]: [startMonth, endMonth],
    };
  }

  BcCommissionV2.findAll(searchQuery)
    .then((result) => {
      Utils.sendResponse(res, 200, result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
