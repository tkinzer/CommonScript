var assert = require("assert");

var a = require("a");
var foo = a.foo;

exports['test module method 1'] = function() {
    assert.equal(a.foo(), a, "calling a module member");
};

exports['test module method 2'] = function() {
    assert.equal(foo(), (function (){return this})(), "members implicitly bound");
};

a.set(10);

exports['test module method 2'] = function() {
    assert.equal(a.get(), 10, "get and set");
};