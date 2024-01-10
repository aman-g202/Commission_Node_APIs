const express = require("express");
const bodyparser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const userRoutes = require("./routes/users");
const settingsRoutes = require("./routes/settings");
const bankRoutes = require("./routes/banks");
const productRoutes = require("./routes/products");
const enquiryRoutes = require("./routes/enquiries");

const sequelize = require("./utils/database");

const User = require("./models/users/user");
const Vendor = require("./models/users/vendor");
const Operator = require("./models/users/operator");
const Agent = require("./models/users/agent");
const Bank = require("./models/bank/bank");
const Zone = require("./models/settings/zone");
const Region = require("./models/settings/region");
const District = require("./models/settings/destrict");
const Village = require("./models/settings/village");
const Branch = require("./models/settings/branch");
const BfCategory = require("./models/products/category");
const BfProduct = require("./models/products/bfproduct");
const Issues = require("./models/users/issues");
const Enquiry = require("./models/enquiries/enquiry");
const BfCommission = require("./models/products/bfcommission");
const BcCommission = require("./models/products/bccommision");
const BcCommissionReport = require("./models/products/bccommissionreport");
const BcCommissionRow = require("./models/products/bccommissionrow");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/excels");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Uploaded file should be excel only"), false);
  }
};

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("excel")
);

app.use(cors());

/* Deals with the CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/user", userRoutes);
app.use("/setting", settingsRoutes);
app.use("/bank", bankRoutes);
app.use("/product", productRoutes);
app.use("/enquiry", enquiryRoutes);

// error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "";
  let errorData = [];

  if (error.data) {
    errorData = error.data;
  }
  res.status(status).json({
    message: message,
    status: "failure",
    statusCode: status,
    error: errorData,
  });
});

User.hasOne(Vendor, {
  foreignKey: "userIdFK",
});

User.hasOne(Operator, {
  foreignKey: "userIdFK",
});

User.hasOne(Agent, {
  foreignKey: "userIdFK",
});

Vendor.belongsTo(User, {
  foreignKey: "userIdFK",
});

Operator.belongsTo(User, {
  foreignKey: "userIdFK",
});

Agent.belongsTo(User, {
  foreignKey: "userIdFK",
});

Agent.belongsTo(Bank, {
  foreignKey: "bankIdFK",
});

Agent.belongsTo(Village, {
  foreignKey: "villageIdFK",
});

BfProduct.belongsTo(BfCategory, {
  foreignKey: "bfCategoryIdFK",
});

Issues.belongsTo(User, {
  foreignKey: "createdBy",
});

Zone.belongsTo(Bank, {
  foreignKey: "bankIdFK",
});

Enquiry.belongsTo(User, {
  foreignKey: "agentIdFK",
  as: "AgentDetail",
});

Enquiry.belongsTo(Agent, {
  foreignKey: "agentIdFK",
  as: "Agent",
});

Enquiry.belongsTo(BfProduct, {
  foreignKey: "bfProductIdFK",
  as: "BfProduct",
});

BfCommission.belongsTo(Agent, {
  foreignKey: "agentIdFK",
});

BfCommission.belongsTo(BfProduct, {
  foreignKey: "productIdFK",
});

BfCommission.belongsTo(User, {
  foreignKey: "vendorIdFK",
});

BcCommission.hasMany(BcCommissionReport, {
  foreignKey: "bcCommissionIdFK",
});

BcCommissionReport.hasMany(BcCommissionRow, {
  foreignKey: "reportIdFK",
});

BcCommissionReport.belongsTo(Agent, {
  foreignKey: "agentIdFK",
});

sequelize
  .authenticate()
  .then((result) => {
    console.log("Connected To Database");
    // const server = app.listen('3000', 'localhost');
    const server = app.listen("3002", "localhost"); // test
    // const server = app.listen('3006', 'localhost'); // live
    if (server) {
      console.log("Server started!");
    }
  })
  .catch((err) => {
    console.log(err);
  });
