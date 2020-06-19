const express = require('express');
const { body, query, param } = require('express-validator');

const router = express.Router();

const isAuth = require('../utils/auth');
const bankController = require('../controllers/banks/bank');

router.post(
    '/create',
    isAuth,
    [
        body("bankName")
            .trim()
            .not()
            .isEmpty()
            .withMessage("bankName field is not provided")
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('bankName must be alphaneumeric only')
    ],
    bankController.createBank
);

router.get(
    '/fetch',
    isAuth,
    bankController.fetchAllBanks
);

router.get(
    '/:bankId',
    isAuth,
    [
        param('bankId')
            .isInt()
            .withMessage('bankId must be integer only')
    ],
    bankController.fetchBank
);

module.exports = router;