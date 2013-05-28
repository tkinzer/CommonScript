var assert = require("assert");

var a = require("a");
var b = require("b");

exports['test module cyclic 1'] = function() {
    assert.ok(a.a, "a not exists");
};

exports['test module cyclic 2'] = function() {
    assert.ok(b.b, "b not exists");
};

exports['test module cyclic 3'] = function() {
    assert.strictEqual(a.a().b, b.b, "a not gets b");
};

exports['test module cyclic 4'] = function() {
    assert.strictEqual(b.b().a, a.a, "b not gets a");
};