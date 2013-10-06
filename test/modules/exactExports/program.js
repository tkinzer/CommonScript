var assert = require("lib/assert");
var a = require("a");

exports['test module exact exports'] = function() {
    assert.strictEqual(a.program(), exports, "not exact exports");
};