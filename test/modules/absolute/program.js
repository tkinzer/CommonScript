var assert = require("assert");

var a = require("submodule/a");
var b = require("b");

exports['test module absolute'] = function() {
    assert.strictEqual(a.foo().foo, b.foo, "require not works with absolute identifiers");
};