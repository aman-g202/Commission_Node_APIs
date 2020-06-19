const Utils = require('../../utils/utils');
const Region = require('../../models/settings/region');
const District = require('../../models/settings/destrict');

exports.createDistrict = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;

    Region
        .findByPk(dataToCreate.regionIdFK)
        .then(region => {
            if (!region) {
                Utils.sendError('Region does not exists!', 404);
            }
            return District.create(dataToCreate);
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

exports.fetchDistricts = (req, res, next) => {
    Utils.checkInputError(req);

    const regionId = req.query.regionId;
    const searchQuery = {
        where: {}
    };

    if (regionId !== '' && typeof regionId !== 'undefined') {
        searchQuery.where.regionIdFK = regionId;
    }

    District
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