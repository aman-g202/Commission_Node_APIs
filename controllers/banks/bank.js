const Utils = require('../../utils/utils');
const config = require('../../config');
const Bank = require('../../models/bank/bank');
const Zone = require('../../models/settings/zone');
const Region = require('../../models/settings/region');
const District = require('../../models/settings/destrict');
const Village = require('../../models/settings/village');
const Branch = require('../../models/settings/branch');

exports.createBank = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;

    let createdAt = Utils.getDateTime(new Date().toLocaleString(config.country, { timeZone: config.timeZone }));
    dataToCreate.createdAt = createdAt;

    Bank
        .create(dataToCreate)
        .then(bank => {
            Utils.sendResponse(res, 201);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};

exports.fetchAllBanks = (req, res, next) => {
    let page = req.query.page;
    let limit = req.query.limit;
    let searchQuery;
    let totalCounts;

    searchQuery = {
        where: {}
    };

    if (typeof page === 'undefined' || typeof page === '') {
        page = 1;
    }

    Bank
        .count({ where: searchQuery.where })
        .then(count => {
            totalCounts = parseInt(count);
            if (typeof limit === 'undefined' || typeof limit === '') {
                limit = totalCounts;
            }
            searchQuery.limit = parseInt(limit);
            searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
            return Bank.findAll(searchQuery);
        })
        .then(banks => {
            Utils.sendResponse(res, 200, banks, totalCounts);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};

exports.fetchBank = (req, res, next) => {
    Utils.checkInputError(req);
    let bankId = req.params.bankId;
    let searchQuery;

    searchQuery = {
        where: {
            id: bankId
        }
    };

    Bank
        .findOne(searchQuery)
        .then(bank => {
            Utils.sendResponse(res, 200, bank);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};