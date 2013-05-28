var assert = require("assert");

var a = require("submodule/a");
var b = require("submodule/b");

exports['test module method 2'] = function() {
    assert.equal(a.foo, b.foo, "a and b share foo through a relative require");
};