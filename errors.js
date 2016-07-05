'use strict';

const errors = {
    1: (doc) => `wrong method. expected ${doc.method.toUpperCase()}`,
    2: (param) => `missing required query parameter '${param.name}'`,
    3: (param, actual) => `wrong type of query parameter '${param.name}'. Expected '${param.type}', got '${typeof actual}'`,
    4: (param, err) => `error validating query parameter '${param.name}': ${err.message}`
};

module.exports = function(code) {
  return errors[code].apply(null, [].slice.call(arguments, 1));
}
