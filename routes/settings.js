const express = require('express');
const { body, query, param } = require('express-validator');

const router = express.Router();

const zoneController = require('../controllers/settings/zone');
const regionController = require('../controllers/settings/region');
const districtController = require('../controllers/settings/district');
const villageController = require('../controllers/settings/village');
const branchController = require('../controllers/settings/branch');
const isAuth = require('../utils/auth');

router.post(
    '/zone/create',
    isAuth,
    [
        body('name')
            .not()
            .isEmpty()
            .withMessage('name is not provided')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('name must be alphaneumeric only'),
        body("bankIdFK")
            .not()
            .isEmpty()
            .withMessage('bankIdFK is not provided')
            .isInt()
            .withMessage("bankIdFK must be integer only!")
    ],
    zoneController.createZone
);

router.get(
    '/zone',
    isAuth,
    zoneController.fetchZones
);

router.post(
    '/region/create',
    isAuth,
    [
        body('name')
            .not()
            .isEmpty()
            .withMessage('name is not provided')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('name must be alphaneumeric only'),
        body('zoneIdFK')
            .not()
            .isEmpty()
            .withMessage('zoneIdFK is not provided')
            .isInt()
            .withMessage('zoneIdFK must be integer only')
    ],
    regionController.createRegion
);

router.get(
    '/region',
    isAuth,
    [
        query('zoneId')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .isInt()
            .withMessage('zoneId must be integer only')
    ],
    regionController.fetchRegions
);

router.post(
    '/district/create',
    isAuth,
    [
        body('name')
            .not()
            .isEmpty()
            .withMessage('name is not provided')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('name must be alphaneumeric only'),
        body('regionIdFK')
            .not()
            .isEmpty()
            .withMessage('regionIdFK is not provided')
            .isInt()
            .withMessage('regionIdFK must be integer only')
    ],
    districtController.createDistrict
);

router.get(
    '/districts',
    isAuth,
    [
        query('regionId')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .isInt()
            .withMessage('regionId must be integer only')
    ],
    districtController.fetchDistricts
);

router.post(
    '/branch/create',
    isAuth,
    [
        body('name')
            .not()
            .isEmpty()
            .withMessage('name is not provided')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('name must be alphaneumeric only'),
        body('districtIdFK')
            .not()
            .isEmpty()
            .withMessage('districtIdFK is not provided')
            .isInt()
            .withMessage('districtIdFK must be integer only'),
        body('branchCode')
            .not()
            .isEmpty()
            .withMessage('branchCode is not provided')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('branchCode must be alphaneumeric only')
    ],
    branchController.createBranch
);

router.get(
    '/branchs',
    isAuth,
    [
        query('districtId')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .isInt()
            .withMessage('districtId must be integer only')
    ],
    branchController.fetchBranchs
);

router.post(
    '/village/create',
    isAuth,
    [
        body('name')
            .not()
            .isEmpty()
            .withMessage('name is not provided')
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage('name must be alphaneumeric only'),
        body('branchIdFK')
            .not()
            .isEmpty()
            .withMessage('branchIdFK is not provided')
            .isInt()
            .withMessage('branchIdFK must be integer only')
    ],
    villageController.createVillage
);

router.get(
    '/villages',
    isAuth,
    [
        query('branchId')
            .if((value, { req }) => {
                if (value || typeof value === 'string') {
                    return true;
                }
                return false;
            })
            .isInt()
            .withMessage('branchId must be integer only')
    ],
    villageController.fetchVillages
);

module.exports = router;