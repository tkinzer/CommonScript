var assert = require("assert");

exports['test module missing'] = function() {
    assert.error(function() { require("bogus"); }, null, "require not throws error when module missing");
};