'use strict';

const expect = require('chai').expect,
    deepcopy = require('deepcopy');

// environment preparation
const environment = {
    request: {
        method: 'get',
        query: {
            token: "fc6d20d49ec2f447a46bd56b8c89b6asfa316e82491c4f5f31a31cd5d819b71f17a75ed11717c29428e3",
            limit: 5,
            offset: 25
        }
    },
    doc: {
        method: 'get',
        queryParams: [
            {
                name: 'token',
                type: 'string',
                required: true,
                test: function (token) {
                    if (token.length < 16) throw new Error(`too short, must be at least 16 length`);
                }
            },
            {
                name: 'limit',
                type: 'number',
                test: naturalNumberTest
            },
            {
                name: 'offset',
                type: 'number',
                test: naturalNumberTest
            }
        ]
    }
};

function naturalNumberTest(number) {
    if (number < 0) throw new Error(`must be greater then zero`);
    if (!Number.isInteger(number)) throw new Error(`must be integer`);
}

const validate = require('../index')(environment.doc)[0];

// unit tests
describe('validator', function () {
    var req;
    beforeEach(function () {
        // refresh req object
        req = deepcopy(environment.request);
    });
    it('throws error on wrong request method', function () {
        req.method = 'POST';
        try {
            expect(validate(req)).to.throw(Error);
        } catch (err) {
            expect(err.code).to.be.equal(1); // wrong method
        }
    });
    it('throws error on missing required parameters', function () {
        req.query.token = undefined;
        try {
            expect(validate(req)).to.throw(Error);
        } catch (err) {
            expect(err.code).to.be.equal(2);
        }
    });
    it('throws error on wrong parameter type', function () {
        req.query.limit = 'haha';
        try {
            expect(validate(req)).to.throw(Error);
        } catch (err) {
            expect(err.code).to.be.equal(3);
        }
    });
    // TODO: more tests
});
