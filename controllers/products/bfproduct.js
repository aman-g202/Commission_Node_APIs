const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Utils = require('../../utils/utils');
const config = require('../../config');

const BfCategory = require('../../models/products/category');
const BfProduct = require('../../models/products/bfproduct');
const Enquiry = require('../../models/enquiries/enquiry');
const BfCommission = require('../../models/products/bfcommission');
const Agent = require('../../models/users/agent');
const User = require('../../models/users/user');
const Vendor = require('../../models/users/vendor');

exports.createBfCategory = (req, res, next) => {
    Utils.checkInputError(req);

    const name = req.body.name;

    BfCategory
        .create({ name: name })
        .then(result => {
            Utils.sendResponse(res, 201);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.fetchAllBfCategory = (req, res, next) => {
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

    BfCategory
        .count({ where: searchQuery.where })
        .then(count => {
            totalCounts = parseInt(count);
            if (typeof limit === 'undefined' || typeof limit === '') {
                limit = totalCounts;
            }
            searchQuery.limit = parseInt(limit);
            searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
            return BfCategory.findAll(searchQuery);
        })
        .then(bfcategories => {
            Utils.sendResponse(res, 200, bfcategories, totalCounts);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};

exports.createBfProduct = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;
    let createdAt = Utils.getDateTime(new Date().toLocaleString(config.country, { timeZone: config.timeZone }));
    dataToCreate.createdAt = createdAt;

    BfProduct
        .create(dataToCreate)
        .then(result => {
            Utils.sendResponse(res, 201);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteBfProduct = (req, res, next) => {
    Utils.checkInputError(req);
    const id = req.params.bfProductId;

    BfProduct
        .findByPk(id)
        .then(prod => {
            if (!prod) {
                Utils.sendError('BfProduct does not exists', 404);
            }
            return BfProduct.destroy({ where: { id: id } });
        })
        .then(result => {
            Utils.sendResponse(res, 202);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.fetchAllBfProducts = (req, res, next) => {
    let page = req.query.page;
    let limit = req.query.limit;
    let searchQuery;
    let totalCounts;

    searchQuery = {
        where: {},
        include: [
            {
                model: BfCategory
            }
        ]
    };

    if (typeof page === 'undefined' || typeof page === '') {
        page = 1;
    }

    BfProduct
        .count({ where: searchQuery.where })
        .then(count => {
            totalCounts = parseInt(count);
            if (typeof limit === 'undefined' || typeof limit === '') {
                limit = totalCounts;
            }
            searchQuery.limit = parseInt(limit);
            searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
            return BfProduct.findAll(searchQuery);
        })
        .then(bfproducts => {
            Utils.sendResponse(res, 200, bfproducts, totalCounts);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};

exports.createBfCommissions = (req, res, next) => {
    Utils.checkInputError(req);
    const enquiryId = req.body.enquiryId;
    let createdAt = Utils.getDateTime(new Date().toLocaleString(config.country, { timeZone: config.timeZone }));

    const dataToCreate = {
        productIdFK: '',
        agentIdFK: '',
        productPrice: '',
        companyCommission: '',
        agentCommission: '',
        qty: '',
        month: '',
        vendorIdFK: '',
        createdAt,
        createdBy: req.userId
    };

    Enquiry
        .findOne({ where: { id: enquiryId }, include: [{ model: BfProduct, as: 'BfProduct', required: true }] })
        .then(enquiry => {
            if (!enquiry) {
                Utils.sendError('Enquiry does not exists!', 404);
            }

            dataToCreate.productIdFK = enquiry.bfProductIdFK;
            dataToCreate.agentIdFK = enquiry.agentIdFK;
            dataToCreate.productPrice = enquiry.BfProduct.price;
            dataToCreate.companyCommission = enquiry.BfProduct.companyComission;
            dataToCreate.agentCommission = enquiry.BfProduct.agentComission;
            dataToCreate.qty = enquiry.qty;
            dataToCreate.month = enquiry.createdAt.split('-')[0] + '-' + enquiry.createdAt.split('-')[1];
            dataToCreate.vendorIdFK = enquiry.enquiryAssignToUserIdFK;

            return BfCommission.create(dataToCreate);
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

exports.fetchBfCommisions = (req, res, next) => {
    Utils.checkInputError(req);
    const agentId = req.query.agentId;
    const currMonth = req.query.currentMonth === '' || typeof req.query.currentMonth === 'undefined' ? false : req.query.currentMonth;
    const startMonth = req.query.startMonth === '' || typeof req.query.startMonth === 'undefined' ? false : req.query.startMonth;
    const endMonth = req.query.endMonth === '' || typeof req.query.endMonth === 'undefined' ? false : req.query.endMonth;
    let page = req.query.page;
    let limit = req.query.limit;
    let totalCounts;

    let searchQuery = {
        where: {},
        include: [
            {
                model: Agent,
                required: true
            },
            {
                model: BfProduct,
                required: true
            },
            {
                model: User,
                attributes: ['id'],
                include: [
                    {
                        model: Vendor,
                        required: true
                    }
                ]
            }
        ]
    };

    if (page === '' || typeof page === 'undefined') {
        page = 1;
    }

    if (currMonth && startMonth && endMonth) {
        Utils.sendError('Pass either currentMonth or startMonth and endMonth', 406);
    }

    if (agentId) {
        searchQuery.where.agentIdFK = agentId;
    }

    if (currMonth) {
        searchQuery.where.month = currMonth;
    }

    if (startMonth && endMonth) {
        searchQuery.where.month = {
            [Op.between]: [startMonth, endMonth]
        }
    }

    BfCommission
        .count({ where: searchQuery.where })
        .then(count => {
            totalCounts = count;
            if (limit === '' || typeof limit === 'undefined') {
                limit = count;
            }
            searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
            searchQuery.limit = parseInt(limit);
            return BfCommission.findAll(searchQuery);
        })
        .then(result => {
            Utils.sendResponse(res, 200, result, totalCounts);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};
