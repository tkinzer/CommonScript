var assert = require("assert");

exports['test module nested'] = function() {
    assert.equal(require("a/b/c/d").foo(), 1, "not nested module identifier");
};