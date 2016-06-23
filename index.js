'use strict';

// custom error
function DocError(message, code) {
    this.name = 'DocError';
    this.message = message || 'error validating doc';
    this.internalCode = code;
}

DocError.prototype = Object.create(Error.prototype);
DocError.prototype.constructor = DocError;

module.exports = function (doc) {
    // parse doc and trigger errors
    // TODO: collect all errors not only the first one
    // TODO: validate the doc structure itself
    let validateRequest = function (req, res, next) { // declared here to take closure on doc
        if (req.method.toUpperCase() !== doc.method.toUpperCase()) { // compare ignoring case
            throw new DocError(`wrong method. expected ${doc.method.toUpperCase()}`, 1);
        }
        doc.queryParams.forEach(function (param) {
            if (req.query[param.name] === 'undefined') {
                if (param.required) throw new DocError(`missing required query parameter '${param.name}'`, 2);
            } else {
                let actual = req.query[param.name];
                if (typeof actual !== param.type) throw new DocError(`wrong query parameter '${param.name}' type. Expected ${param.type}, got ${typeof actual}`, 3);
                // run test
                if (param.test) {
                    try {
                        param.test(actual);
                    } catch (err) {
                        throw new DocError(`error validating query parameter '${param.name}': ${err.message}`, 4);
                    }
                }
            }
        });
    };

    let errorHandler = function (err, req, res, next) {
        // the error codes inside validator is for local use e.g. for unit tests
        // the real http code is always 400 since the request validation failed
        err.code = 400;
        next(err);
    };

    return [validateRequest, errorHandler];
};