const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const Utils = require('../../utils/utils');
const config = require('../../config');
const User = require('../../models/users/user');
const Operator = require('../../models/users/operator');
const Agent = require('../../models/users/agent');
const Vendor = require('../../models/users/vendor');
const Issues = require('../../models/users/issues');
const BcProduct = require('../../models/products/bcproduct');
const BfProduct = require('../../models/products/bfproduct');

exports.adminCreate = (req, res, next) => {
    Utils.checkInputError(req);

    let dataToSave = req.body;

    let createdAt = Utils.getDateTime(
        new Date().toLocaleString(config.country, {
            timeZone: config.timeZone
        })
    );

    dataToSave.createdAt = createdAt;

    User
        .findOne({
            where: {
                [Op.or]: [
                    {
                        userLoginId: dataToSave.userLoginId
                    },
                    {
                        userType: 'ADMIN'
                    }
                ]
            }
        })
        .then(user => {
            if (user && user.userType === 'ADMIN') {
                Utils.sendError('Admin already exists!', 406);
            } else if (user) {
                Utils.sendError('User already exists!', 406);
            }
            return bcrypt.hash(dataToSave.password, 12);
        })
        .then(hassedPassword => {
            dataToSave.password = hassedPassword;
            return User.create(dataToSave);
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

exports.loginAnyTypeOfUser = (req, res, next) => {
    Utils.checkInputError(req);

    const userLoginId = req.body.userLoginId;
    const password = req.body.password;
    let fetchedUser;

    User
        .findOne(
            {
                where: {
                    userLoginId: userLoginId,
                    status: 'ACTIVE'
                },
                attributes: ['id', 'userLoginId', 'userType', 'password']
            }
        )
        .then(user => {
            if (!user) {
                Utils.sendError('Either user not found or it is INACTIVE!', 404);
            }
            fetchedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                Utils.sendError("Password didn\'t match", 406);
            }

            if (fetchedUser.userType === 'AGENT') {
                return User.findOne({
                    where: {
                        id: fetchedUser.id
                    },
                    attributes: ['id', 'userLoginId', 'userType'],
                    include: [
                        {
                            model: Agent,
                            required: true
                        }
                    ]
                });
            } else if (fetchedUser.userType === 'VENDOR') {
                return User.findOne({
                    where: {
                        id: fetchedUser.id
                    },
                    attributes: ['id', 'userLoginId', 'userType'],
                    include: [
                        {
                            model: Vendor,
                            required: true
                        }
                    ]
                });
            } else if (fetchedUser.userType === 'OPERATOR') {
                return User.findOne({
                    where: {
                        id: fetchedUser.id
                    },
                    attributes: ['id', 'userLoginId', 'userType'],
                    include: [
                        {
                            model: Operator,
                            required: true
                        }
                    ]
                });
            } else {
                return 'Admin';
            }
        })
        .then(result => {
            const token = jwt.sign(
                {
                    userId: fetchedUser.id.toString(),
                    userType: fetchedUser.userType
                },
                "SomesuperseuparSecretsecretcommissionDashboardParikshitparse",
                {
                    expiresIn: "15d"
                }
            );

            res.status(200).json({
                status: 'success',
                statusCode: 200,
                token: token,
                data: result === 'Admin' ? fetchedUser : result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteUser = (req, res, next) => {
    Utils.checkInputError(req);

    const userId = req.params.userId;

    User
        .findByPk(userId)
        .then(user => {
            if (!user) {
                Utils.sendError('User does not exists', 404);
            }
            return User.destroy({ where: { id: userId } });
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

exports.updateUser = (req, res, next) => {
    Utils.checkInputError(req);
    const userId = req.params.userId;
    const dataToUpdate = req.body;

    if (!dataToUpdate.status && !dataToUpdate.password) {
        Utils.sendError('No data is provided to update', 406);
    }

    User
        .findByPk(userId)
        .then(user => {
            if (!user) {
                Utils.sendError('User does not exists', 404);
            }

            if (!!dataToUpdate.password) {
                return bcrypt.hash(dataToUpdate.password, 12);
            } else {
                return false;
            }
        })
        .then(result => {
            if (result) {
                dataToUpdate.password = result;
            }
            return User.update(dataToUpdate, { where: { id: userId } });
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

exports.createIssue = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;
    let createdAt = Utils.getDateTime(new Date().toLocaleString(config.country, { timeZone: config.timeZone }));
    dataToCreate.createdAt = createdAt;
    dataToCreate.createdBy = req.userId;

    Issues
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

exports.fetchAllIssues = (req, res, next) => {
    let page = req.query.page;
    let limit = req.query.limit;
    const createdBy = req.query.userId;
    const status = req.query.status;
    let searchQuery;
    let totalCounts;

    searchQuery = {
        where: {},
        include: [
            {
                model: User,
                attributes: ['id', 'userType']
            }
        ],
        order: [['createdAt', 'desc']]
    };

    if (typeof page === 'undefined' || typeof page === '') {
        page = 1;
    }

    if (typeof createdBy !== 'undefined') {
        searchQuery.where.createdBy = createdBy;
    }

    if (typeof status !== 'undefined') {
        searchQuery.where.status = status;
    }

    Issues
        .count({ where: searchQuery.where })
        .then(count => {
            totalCounts = parseInt(count);
            if (typeof limit === 'undefined' || typeof limit === '') {
                limit = totalCounts;
            }
            searchQuery.limit = parseInt(limit);
            searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
            return Issues.findAll(searchQuery);
        })
        .then(issues => {
            Utils.sendResponse(res, 200, issues, totalCounts);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};

exports.updateIssueStatus = (req, res, next) => {
    Utils.checkInputError(req);
    const issueId = req.params.issueId;
    const status = req.body.status;

    Issues
        .findByPk(issueId)
        .then(issue => {
            if (!issue) {
                Utils.sendError('Issue does not exists!', 404);
            }
            issue.status = status;
            return issue.save();
        })
        .then(result => {
            Utils.sendResponse(res, 202);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};

exports.fetchDashboardStatus = (req, res, next) => {
    const dashboard = {
        Operators: '',
        Agents: '',
        Vendors: '',
        BcProducts: '',
        BfProducts: ''
    };

    Operator
        .count()
        .then(counts => {
            dashboard.Operators = counts;
            return Agent.count();
        })
        .then(counts => {
            dashboard.Agents = counts;
            return Vendor.count();
        })
        .then(counts => {
            dashboard.Vendors = counts;
            return BfProduct.count();
        })
        .then(counts => {
            dashboard.BfProducts = counts;
            return BcProduct.count();
        })
        .then(counts => {
            dashboard.BcProducts = counts;
            Utils.sendResponse(res, 200, dashboard);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};