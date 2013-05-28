var assert = require("assert");

function block() {
    require("submodule/a");
}

exports['test module transitive'] = function() {
    assert.error(block, null, "require fall back to relative modules.");
};