const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Utils = require('../../utils/utils');
const config = require('../../config');
const User = require('../../models/users/user');
const Vendor = require('../../models/users/vendor');
const sequelize = require('../../utils/database');

exports.createVendor = (req, res, next) => {
    Utils.checkInputError(req);
    const userData = req.body.userData;
    const vendorData = req.body.vendorData;

    let createdAt = Utils.getDateTime(
        new Date().toLocaleString(config.country, {
            timeZone: config.timeZone
        })
    );

    User
        .findOne({ where: { userLoginId: userData.userLoginId } })
        .then(user => {
            if (user) {
                Utils.sendError('Username already exists!', 406);
            }
            return bcrypt.hash(userData.password, 12);
        })
        .then(hassedPass => {
            userData.password = hassedPass;
            userData.createdAt = createdAt;
            userData.userType = 'VENDOR';
            return sequelize.transaction(t => {
                return User
                    .create(userData, { transaction: t })
                    .then(user => {
                        vendorData.createdAt = createdAt;
                        return user.createVendor(vendorData, { transaction: t });
                    });
            });
        })
        .then(result => {
            Utils.sendResponse(res, 201);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};

exports.fetchAllVendors = (req, res, next) => {
    let page = req.query.page;
    let limit = req.query.limit;
    let searchQuery;
    let totalCounts;

    searchQuery = {
        where: {},
        include: [
            {
                model: User,
                attributes: ['userLoginId']
            }
        ]
    };

    if (typeof page === 'undefined' || typeof page === '') {
        page = 1;
    }

    Vendor
        .count({ where: searchQuery.where })
        .then(count => {
            totalCounts = parseInt(count);
            if (typeof limit === 'undefined' || typeof limit === '') {
                limit = totalCounts;
            }
            searchQuery.limit = parseInt(limit);
            searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
            return Vendor.findAll(searchQuery);
        })
        .then(vendors => {
            Utils.sendResponse(res, 200, vendors, totalCounts);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};