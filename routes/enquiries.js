const express = require('express');
const { body, query, param } = require('express-validator');

const router = express.Router();

const isAuth = require('../utils/auth');
const enquiryController = require('../controllers/enquiries/enquiry');

router.post(
    '/create',
    isAuth,
    [
        body('priority')
            .not()
            .isEmpty()
            .withMessage('priority is not provided')
            .matches(/^[A-Z]+$/)
            .withMessage('priority must be alpha only all caps'),
        body('bfProductIdFK')
            .not()
            .isEmpty()
            .withMessage('bfProductIdFK is not provided')
            .isInt()
            .withMessage('bfProductIdFK must be integer only'),
        body('message')
            .not()
            .isEmpty()
            .withMessage('message is not provided'),
        body('createdByUserIdFK')
            .not()
            .isEmpty()
            .withMessage('createdByUserIdFK is not provided')
            .isInt()
            .withMessage('createdByUserIdFK must be integer only'),
        body('customerName')
            .not()
            .isEmpty()
            .withMessage('customerName is not provided')
            .matches(/^[A-Za-z ]+$/)
            .withMessage('customerName must be alpha only'),
        body('customerMobile')
            .not()
            .isEmpty()
            .withMessage('customerMobile is not provided')
            .isInt()
            .withMessage('customerMobile must be integer only'),
        body('customerEmail')
            .not()
            .isEmpty()
            .withMessage('customerEmail is not provided')
            .isEmail()
            .withMessage('customerEmail is invalid'),
        body('customerAddress')
            .not()
            .isEmpty()
            .withMessage('customerAddress is not provided'),
        body('agentIdFK')
            .not()
            .isEmpty()
            .withMessage('agentIdFK is not provided')
            .isInt()
            .withMessage('agentIdFK must be integer only'),
        body('enquiryStatus')
            .not()
            .isEmpty()
            .withMessage('enquiryStatus is not provided')
            .matches(/^[A-Z]+$/)
            .withMessage('enquiryStatus must be alpha only all caps'),
        body('qty')
            .not()
            .isEmpty()
            .withMessage('qty is not provided')
            .isInt()
            .withMessage('qty must be integer only')
    ],
    enquiryController.createEnquiry
);

router.patch(
    '/assign/:enquiryId/:userId',
    isAuth,
    [
        param('userId')
            .isInt()
            .withMessage('userId must be integer only'),
        param('enquiryId')
            .isInt()
            .withMessage('enquiryId must be integer only')
    ],
    enquiryController.assignEnquiry
);

router.patch(
    '/statusupdate/:enquiryId',
    isAuth,
    [
        param('enquiryId')
            .isInt()
            .withMessage('enquiryId must be integer only'),
        body('enquiryStatus')
            .not()
            .isEmpty()
            .withMessage('enquiryStatus is not provided')
            .matches(/^[A-Z]+$/)
            .withMessage('enquiryStatus must be alpha only all caps'),
    ],
    enquiryController.updateStatusOfEnquiry
);

router.get(
    '/fetch',
    isAuth,
    [
        query('status')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .matches(/^[A-Z]+$/)
            .withMessage('status must be string only with all caps'),
        query('agentId')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .isInt()
            .withMessage('agentId must be integer only'),
        query('userId')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .isInt()
            .withMessage('userId must be integer only')
    ],
    enquiryController.fetchAllEnquiries
);

module.exports = router;