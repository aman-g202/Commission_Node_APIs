const Utils = require('../../utils/utils');
const Village = require('../../models/settings/village');
const Branch = require('../../models/settings/branch');

exports.createVillage = (req, res, next) => {
    Utils.checkInputError(req);

    const dataToCreate = req.body;

    Branch
        .findByPk(dataToCreate.branchIdFK)
        .then(branch => {
            if (!branch) {
                Utils.sendError('Branch does not exists!', 404);
            }
            return Village.create(dataToCreate);
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

exports.fetchVillages = (req, res, next) => {
    Utils.checkInputError(req);

    const branchId = req.query.branchId;
    const searchQuery = {
        where: {}
    };

    if (branchId !== '' && typeof branchId !== 'undefined') {
        searchQuery.where.branchIdFK = branchId;
    }

    Village
        .findAll(searchQuery)
        .then(villages => {
            Utils.sendResponse(res, 200, villages);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};