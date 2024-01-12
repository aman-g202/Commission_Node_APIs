const express = require("express");
const { body, query, param } = require("express-validator");

const router = express.Router();

const isAuth = require("../utils/auth");
const bcProductController = require("../controllers/products/bcproduct");
const bcProductV2Controller = require("../controllers/products/bcproduct-v2");
const bfProductController = require("../controllers/products/bfproduct");

router.post(
  "/bcproduct",
  isAuth,
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage("name is not provided")
      .isString()
      .withMessage("name must be string only"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("price is not provided")
      .isFloat()
      .withMessage("price must be number only"),
    body("companyComission")
      .not()
      .isEmpty()
      .withMessage("companyComission is not provided")
      .isFloat()
      .withMessage("companyComission must be number only"),
    body("agentComission")
      .not()
      .isEmpty()
      .withMessage("agentComission is not provided")
      .isFloat()
      .withMessage("agentComission must be number only"),
    body("productDetail")
      .not()
      .isEmpty()
      .withMessage("productDetail is not provided"),
  ],
  bcProductController.createBcProduct
);

router.post(
  "/v2/bcproduct",
  isAuth,
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage("name is not provided")
      .isString()
      .withMessage("name must be string only"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("price is not provided")
      .isFloat()
      .withMessage("price must be number only"),
    body("companyComission")
      .not()
      .isEmpty()
      .withMessage("companyComission is not provided")
      .isFloat()
      .withMessage("companyComission must be number only"),
    body("agentComission")
      .not()
      .isEmpty()
      .withMessage("agentComission is not provided")
      .isFloat()
      .withMessage("agentComission must be number only"),
    body("productDetail")
      .not()
      .isEmpty()
      .withMessage("productDetail is not provided"),
  ],
  bcProductV2Controller.createBcProduct
);

router.delete(
  "/bcproduct/:bcProductId",
  isAuth,
  [
    param("bcProductId")
      .isInt()
      .withMessage("bcProductId is must be integer only"),
  ],
  bcProductController.deleteBcProduct
);

router.delete(
  "/v2/bcproduct/:bcProductId",
  isAuth,
  [
    param("bcProductId")
      .isInt()
      .withMessage("bcProductId is must be integer only"),
  ],
  bcProductV2Controller.deleteBcProduct
);

router.post(
  "/bfproduct/category",
  isAuth,
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage("name is not provided")
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("name must be alphaneumeric only"),
  ],
  bfProductController.createBfCategory
);

router.get(
  "/bfproduct/category",
  isAuth,
  bfProductController.fetchAllBfCategory
);

router.post(
  "/bfproduct",
  isAuth,
  [
    body("bfCategoryIdFK")
      .not()
      .isEmpty()
      .withMessage("bfCategoryIdFK is not provided")
      .isInt()
      .withMessage("bfCategoryIdFK must be integer only"),
    body("name")
      .not()
      .isEmpty()
      .withMessage("name is not provided")
      .isString()
      .withMessage("name must be string only"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("price is not provided")
      .isFloat()
      .withMessage("price must be number only"),
    body("companyComission")
      .not()
      .isEmpty()
      .withMessage("companyComission is not provided")
      .isFloat()
      .withMessage("companyComission must be number only"),
    body("agentComission")
      .not()
      .isEmpty()
      .withMessage("agentComission is not provided")
      .isFloat()
      .withMessage("agentComission must be number only"),
    body("productDetail")
      .not()
      .isEmpty()
      .withMessage("productDetail is not provided"),
  ],
  bfProductController.createBfProduct
);

router.delete(
  "/bfproduct/:bfProductId",
  isAuth,
  [
    param("bfProductId")
      .isInt()
      .withMessage("bfProductId is must be integer only"),
  ],
  bfProductController.deleteBfProduct
);

router.get("/bcproduct", isAuth, bcProductController.fetchAllBcProducts);

router.get("/v2/bcproduct", isAuth, bcProductV2Controller.fetchAllBcProducts);

router.get("/bfproduct", isAuth, bfProductController.fetchAllBfProducts);

router.post(
  "/bc/upload",
  isAuth,
  [body("month").not().isEmpty().withMessage("month field is not provided")],
  bcProductController.uploadExcel
);
router.post(
  "/v2/bc/upload",
  isAuth,
  [body("month").not().isEmpty().withMessage("month field is not provided")],
  bcProductV2Controller.uploadExcel
);

router.post(
  "/bfcommission",
  isAuth,
  [
    body("enquiryId")
      .not()
      .isEmpty()
      .withMessage("enquiryId is not provided")
      .isInt()
      .withMessage("enquiryId must be integer only"),
  ],
  bfProductController.createBfCommissions
);

router.get(
  "/bccommissions",
  isAuth,
  [
    query("agentId")
      .if((value, { req }) => {
        if (value || typeof value === "string") {
          return true;
        }
        return false;
      })
      .isInt()
      .withMessage("agentId must be integer only"),
  ],
  bcProductController.fetchBcCommisions
);

router.get(
  "/v2/bccommissions",
  isAuth,
  [
    query("agentId")
      .if((value, { req }) => {
        if (value || typeof value === "string") {
          return true;
        }
        return false;
      })
      .isInt()
      .withMessage("agentId must be integer only"),
  ],
  bcProductV2Controller.fetchBcCommisions
);

router.get(
  "/bfcommissions",
  isAuth,
  [
    query("agentId")
      .if((value, { req }) => {
        if (value || typeof value === "string") {
          return true;
        }
        return false;
      })
      .isInt()
      .withMessage("agentId must be integer only"),
  ],
  bfProductController.fetchBfCommisions
);

module.exports = router;
