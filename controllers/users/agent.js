const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Utils = require('../../utils/utils');
const config = require('../../config');
const User = require('../../models/users/user');
const Agent = require('../../models/users/agent');
const sequelize = require('../../utils/database');
const Bank = require('../../models/bank/bank');
const Village = require('../../models/settings/village');

exports.createAgent = (req, res, next) => {
    Utils.checkInputError(req);
    const userData = req.body.userData;
    const agentData = req.body.agentData;

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
            userData.userType = 'AGENT';
            return sequelize.transaction(t => {
                return User
                    .create(userData, { transaction: t })
                    .then(user => {
                        agentData.createdAt = createdAt;
                        agentData.createdBy = req.userId;
                        return user.createAgent(agentData, { transaction: t });
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

exports.fetchAllAgents = (req, res, next) => {
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
            },
            {
                model: Bank,
                attributes: ['bankName']
            },
            {
                model: Village
            }
        ]
    };

    if (typeof page === 'undefined' || typeof page === '') {
        page = 1;
    }

    Agent
        .count({ where: searchQuery.where })
        .then(count => {
            totalCounts = parseInt(count);
            if (typeof limit === 'undefined' || typeof limit === '') {
                limit = totalCounts;
            }
            searchQuery.limit = parseInt(limit);
            searchQuery.offset = (parseInt(page) - 1) * parseInt(limit);
            return Agent.findAll(searchQuery);
        })
        .then(agents => {
            Utils.sendResponse(res, 200, agents, totalCounts);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });
};