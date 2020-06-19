const Utils = require('../../utils/utils');
const config = require('../../config');

const Enquiry = require('../../models/enquiries/enquiry');
const Agent = require('../../models/users/agent');
const BfProduct = require('../../models/products/bfproduct');
const User = require('../../models/users/user');

exports.createEnquiry = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;
    let enquiryId = 100000;
    let createdAt = Utils.getDateTime(new Date().toLocaleString(config.country, { timeZone: config.timeZone }));
    dataToCreate.createdAt = createdAt;

    Enquiry
        .findOne({ order: [['createdAt', 'desc']] })
        .then(enquiry => {
            if (enquiry) {
                enquiryId = parseInt(enquiry.enquiryId) + 1;
            }
            dataToCreate.enquiryId = enquiryId;
            return Enquiry.create(dataToCreate);
        })
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

exports.assignEnquiry = (req, res, next) => {
    Utils.checkInputError(req);
    const userId = req.params.userId;
    const enquiryId = req.params.enquiryId;

    Enquiry
        .findByPk(enquiryId)
        .then(enquiry => {
            if (!enquiry) {
                Utils.sendError('Enquiry does not exists', 404);
            }
            return Enquiry.update({ enquiryAssignToUserIdFK: userId }, { where: { id: enquiryId } });
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

exports.updateStatusOfEnquiry = (req, res, next) => {
    Utils.checkInputError(req);
    const enquiryId = req.params.enquiryId;
    const enquiryStatus = req.body.enquiryStatus;

    Enquiry
        .findByPk(enquiryId)
        .then(enquiry => {
            if (!enquiry) {
                Utils.sendError('Enquiry does not exists', 404);
            }
            return Enquiry.update({ enquiryStatus: enquiryStatus }, { where: { id: enquiryId } });
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

exports.fetchAllEnquiries = (req, res, next) => {
    Utils.checkInputError(req);
    let page = req.query.page;
    let limit = req.query.limit;
    let enquiryStatus = req.query.status;
    let agentId = req.query.agentId;
    let userId = req.query.userId;
    let searchQuery;
    let totalCounts;

    searchQuery = {
        where: {},
        include: [
            {
                model: Agent,
                as: 'Agent'
            },
            {
                model: BfProduct,
                as: 'BfProduct',
                required: true
            }
        ]
    };

    if (enquiryStatus) {
        searchQuery.where.enquiryStatus = enquiryStatus;
    }

    if (agentId) {
        searchQuery.where.agentIdFK = agentId;
    }

    if (userId) {
        searchQuery.where.enquiryAssignToUserIdFK = userId;
    }

    if (typeof page === 'undefined' || typeof page === '') {
        page = 1;
    }

    Enquiry
        .count({ where: searchQuery.where })
        .then(count => {
            totalCounts = parseInt(count);
            if (typeof limit === 'undefined' || typeof limit === '') {
                limit = totalCounts;
            }
            searchQuery.limit = parseInt(limit);
            searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
            return Enquiry.findAll(searchQuery);
        })
        .then(enquiries => {
            Utils.sendResponse(res, 200, enquiries, totalCounts);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};