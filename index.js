'use strict';

const DocError = require('./docError');

module.exports = function (doc) {
    // parse doc and trigger errors
    // TODO: collect all errors not only the first one
    // TODO: validate the doc structure itself
    let validateRequest = function (req, res, next) { // declared here to take closure on doc
        if (doc.method && doc.method.toUpperCase() !== 'ALL' && req.method.toUpperCase() !== doc.method.toUpperCase()) { // compare ignoring case
            throw new DocError(1, doc);
        }
        doc.queryParams.forEach(function (param) {
            if (req.query[param.name] === undefined) {
                if (param.required) {
                    throw new DocError(2, param);
                }
            } else {
                let actual = req.query[param.name];
                if (param.type && typeof actual !== param.type) {
                    throw new DocError(3, param, actual);
                }
                // run test
                if (param.test) {
                    try {
                        param.test(actual);
                    } catch (err) {
                        throw new DocError(4, param, err);
                    }
                }
            }
        });
        next();
    };

    let errorHandler = function (err, req, res, next) {
        // the error codes inside validator is for local use e.g. for unit tests
        // the real http status is always 400 since the request validation failed
        err.status = 400;
        next(err);
    };

    return [validateRequest, errorHandler];
};
