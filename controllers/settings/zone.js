const Utils = require('../../utils/utils');
const Zone = require('../../models/settings/zone');
const Bank = require('../../models/bank/bank');

exports.createZone = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;

    Zone
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

exports.fetchZones = (req, res, next) => {
    let searchQuery = {
        where: {},
        include: [
            {
                model: Bank,
                required: true
            }
        ]
    };
    Zone
        .findAll(searchQuery)
        .then(zones => {
            Utils.sendResponse(res, 200, zones);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};