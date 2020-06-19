const express = require('express');
const { body, query, param } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/users/users');
const vendorController = require('../controllers/users/vendor');
const operatorController = require('../controllers/users/operator');
const agentController = require('../controllers/users/agent');
const isAuth = require('../utils/auth');

router.post(
    '/admin/create',
    [
        body('userLoginId')
            .not()
            .isEmpty()
            .withMessage('userLoginId field is empty')
            .custom((value, { req }) => {
                if (/\s/.test(value)) {
                    return Promise.reject('userLoginId should not contain spaces!');
                }
                return true;
            }),
        body('password')
            .not()
            .isEmpty()
            .withMessage('password field is empty')
            .custom((value, { req }) => {
                if (/\s/.test(value)) {
                    return Promise.reject('password should not contain spaces!');
                }
                return true;
            }),
        body('userType')
            .not()
            .isEmpty()
            .withMessage('userType field is empty')
            .matches(/^[A-Z]+$/)
            .withMessage('userType must be string only with all caps')
    ],
    userController.adminCreate
);

router.post(
    '/login',
    [
        body("userLoginId")
            .trim()
            .not()
            .isEmpty()
            .withMessage("userLoginId field is not provided"),
        body("password")
            .trim()
            .not()
            .isEmpty()
            .withMessage("password field is not provided")
    ],
    userController.loginAnyTypeOfUser
);

router.post(
    '/vendor/create',
    isAuth,
    [
        body('userData.userLoginId')
            .not()
            .isEmpty()
            .withMessage('userLoginId field is empty')
            .custom((value, { req }) => {
                if (/\s/.test(value)) {
                    return Promise.reject('userLoginId should not contain spaces!');
                }
                return true;
            }),
        body('userData.password')
            .not()
            .isEmpty()
            .withMessage('password field is empty')
            .custom((value, { req }) => {
                if (/\s/.test(value)) {
                    return Promise.reject('password should not contain spaces!');
                }
                return true;
            }),
        body('vendorData.businessName')
            .not()
            .isEmpty()
            .withMessage('businessName field is empty')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('businessName must be alphaneumeric only'),
        body('vendorData.name')
            .not()
            .isEmpty()
            .withMessage('name field is empty')
            .matches(/^[A-Za-z ]+$/)
            .withMessage('name must be alpha only'),
        body('vendorData.mobile')
            .not()
            .isEmpty()
            .withMessage('mobile field is empty')
            .isInt()
            .withMessage('mobile must be integer only'),
        body('vendorData.email')
            .not()
            .isEmpty()
            .withMessage('email field is empty')
            .isEmail()
            .withMessage('email is invalid'),
        body('vendorData.address')
            .not()
            .isEmpty()
            .withMessage('address field is empty')
    ],
    vendorController.createVendor
);

router.get(
    '/vendors',
    isAuth,
    vendorController.fetchAllVendors
);

router.post(
    '/operator/create',
    isAuth,
    [
        body('userData.userLoginId')
            .not()
            .isEmpty()
            .withMessage('userLoginId field is empty')
            .custom((value, { req }) => {
                if (/\s/.test(value)) {
                    return Promise.reject('userLoginId should not contain spaces!');
                }
                return true;
            }),
        body('userData.password')
            .not()
            .isEmpty()
            .withMessage('password field is empty')
            .custom((value, { req }) => {
                if (/\s/.test(value)) {
                    return Promise.reject('password should not contain spaces!');
                }
                return true;
            }),
        body('operatorData.name')
            .not()
            .isEmpty()
            .withMessage('name field is empty')
            .matches(/^[A-Za-z ]+$/)
            .withMessage('name must be alpha only'),
        body('operatorData.mobile')
            .not()
            .isEmpty()
            .withMessage('mobile field is empty')
            .isInt()
            .withMessage('mobile must be integer only'),
        body('operatorData.email')
            .not()
            .isEmpty()
            .withMessage('email field is empty')
            .isEmail()
            .withMessage('email is invalid'),
        body('operatorData.address')
            .not()
            .isEmpty()
            .withMessage('address field is empty')
    ],
    operatorController.createOperator
);

router.get(
    '/operators',
    isAuth,
    operatorController.fetchAllOperators
);

router.post(
    '/agent/create',
    isAuth,
    [
        body('userData.userLoginId')
            .not()
            .isEmpty()
            .withMessage('userLoginId field is empty')
            .custom((value, { req }) => {
                if (/\s/.test(value)) {
                    return Promise.reject('userLoginId should not contain spaces!');
                }
                return true;
            }),
        body('userData.password')
            .not()
            .isEmpty()
            .withMessage('password field is empty')
            .custom((value, { req }) => {
                if (/\s/.test(value)) {
                    return Promise.reject('password should not contain spaces!');
                }
                return true;
            }),
        body('agentData.agentId')
            .not()
            .isEmpty()
            .withMessage('agentId field is empty')
            .isInt()
            .withMessage('agentId must be integer only'),
        body('agentData.fullName')
            .not()
            .isEmpty()
            .withMessage('fullName field is empty')
            .matches(/^[A-Za-z ]+$/)
            .withMessage('fullName must be alpha only'),
        body('agentData.mobile')
            .not()
            .isEmpty()
            .withMessage('mobile field is empty')
            .isInt()
            .withMessage('mobile must be integer only'),
        body('agentData.email')
            .not()
            .isEmpty()
            .withMessage('email field is empty')
            .isEmail()
            .withMessage('email is invalid'),
        body('agentData.address')
            .not()
            .isEmpty()
            .withMessage('address field is empty'),
        body('agentData.aadharNumber')
            .not()
            .isEmpty()
            .withMessage('aadharNumber field is empty')
            .isInt()
            .withMessage('aadharNumber must be integer only'),
        body('agentData.panNumber')
            .not()
            .isEmpty()
            .withMessage('panNumber field is empty')
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage('panNumber must be alphaneumeric only'),
        body('agentData.dob')
            .not()
            .isEmpty()
            .withMessage('dob field is empty'),
        body('agentData.education')
            .not()
            .isEmpty()
            .withMessage('education field is empty'),
        body('agentData.bankIdFK')
            .not()
            .isEmpty()
            .withMessage('bankIdFK field is empty')
            .isInt()
            .withMessage('bankIdFK must be integer only'),
        body('agentData.villageIdFK')
            .not()
            .isEmpty()
            .withMessage('villageIdFK field is empty')
            .isInt()
            .withMessage('villageIdFK must be integer only')
    ],
    agentController.createAgent
);

router.get(
    '/agents',
    isAuth,
    agentController.fetchAllAgents
);

router.delete(
    '/remove/:userId',
    isAuth,
    [
        param('userId')
            .isInt()
            .withMessage('userId must be integer only')
    ],
    userController.deleteUser
);

router.patch(
    '/update/:userId',
    isAuth,
    [
        param('userId')
            .isInt()
            .withMessage('userId must be integer only'),
        body('status')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .matches(/^[A-Z]+$/)
            .withMessage('status must be alpha only all caps')
    ],
    userController.updateUser
);

router.get(
    '/issues',
    isAuth,
    [
        query('userId')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .isInt()
            .withMessage('userId must be integer only'),
        query('status')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .matches(/^[A-Z]+$/)
            .withMessage('status must be alpha only with all caps')
    ],
    userController.fetchAllIssues
);

router.post(
    '/issue',
    isAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('title is not provided')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('title must be alphaneurmeric only'),
        body('message')
            .not()
            .isEmpty()
            .withMessage('message is not provided'),
        body('name')
            .not()
            .isEmpty()
            .withMessage('name field is empty')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('name must be alphaneumeric only'),
        body('mobile')
            .not()
            .isEmpty()
            .withMessage('mobile field is empty')
            .isInt()
            .withMessage('mobile must be integer only'),
        body('email')
            .not()
            .isEmpty()
            .withMessage('email field is empty')
            .isEmail()
            .withMessage('email is invalid'),
        body('address')
            .not()
            .isEmpty()
            .withMessage('address field is empty'),
        body('status')
            .not()
            .isEmpty()
            .withMessage('status field is empty')
            .matches(/^[A-Z]+$/)
            .withMessage('status must be alpha only with all caps')
    ],
    userController.createIssue
);

router.patch(
    '/issue/statusupdate/:issueId',
    isAuth,
    [
        param('issueId')
            .isInt()
            .withMessage('issueId must be integer only'),
        body('status')
            .not()
            .isEmpty()
            .withMessage('status field is empty')
            .matches(/^[A-Z]+$/)
            .withMessage('status must be alpha only with all caps')
    ],
    userController.updateIssueStatus
);

router.get(
    '/dashboard',
    isAuth,
    userController.fetchDashboardStatus
);

module.exports = router;