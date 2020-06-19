const Utils = require('../../utils/utils');
const District = require('../../models/settings/destrict');
const Branch = require('../../models/settings/branch');

exports.createBranch = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;

    District
        .findByPk(dataToCreate.districtIdFK)
        .then(districts => {
            if (!districts) {
                Utils.sendError('District does not exists!', 404);
            }
            return Branch.create(dataToCreate);
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

exports.fetchBranchs = (req, res, next) => {
    Utils.checkInputError(req);

    const districtId = req.query.districtId;
    const searchQuery = {
        where: {}
    };

    if (districtId !== '' && typeof districtId !== 'undefined') {
        searchQuery.where.districtIdFK = districtId;
    }

    Branch
        .findAll(searchQuery)
        .then(branchs => {
            Utils.sendResponse(res, 200, branchs);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};