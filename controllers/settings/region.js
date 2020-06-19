const Utils = require('../../utils/utils');
const Region = require('../../models/settings/region');
const Zone = require('../../models/settings/zone');

exports.createRegion = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;

    Zone
        .findByPk(dataToCreate.zoneIdFK)
        .then(zone => {
            if (!zone) {
                Utils.sendError('Zone does not exists!', 404);
            }
            return Region.create(dataToCreate);
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

exports.fetchRegions = (req, res, next) => {
    Utils.checkInputError(req);

    const zoneId = req.query.zoneId;
    const searchQuery = {
        where: {}
    };

    if (zoneId !== '' && typeof zoneId !== 'undefined') {
        searchQuery.where.zoneIdFK = zoneId;
    }

    Region
        .findAll(searchQuery)
        .then(regions => {
            Utils.sendResponse(res, 200, regions);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};