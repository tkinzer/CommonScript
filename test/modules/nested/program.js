var assert = require("lib/assert");

exports['test module nested'] = function() {
    assert.equal(require("a/b/c/d").foo(), 1, "not nested module identifier");
};