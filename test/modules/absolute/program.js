/*
var path = window.require.path;

window.require.path = window.require.path.split("/").slice(0, -4).join("/") + "/";

var assert = require("lib/assert");

window.require.path = path;
*/

var assert = require("lib/assert");
var a = require("submodule/a");
var b = require("b");

exports['test module absolute'] = function() {
    assert.strictEqual(a.foo().foo, b.foo, "require not works with absolute identifiers");
};
