'use strict';

const errors = require('./errors');

// custom error
function DocError(code) {
    this.name = 'DocError';
    this.message = errors.apply(null, arguments) || 'error validating doc';
    this.code = code;
}

DocError.prototype = Object.create(Error.prototype);
DocError.prototype.constructor = DocError;

module.exports = DocError;
