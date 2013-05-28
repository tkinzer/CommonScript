/**
 * @author Alejandro Ojeda Gutierrez.
 * @copyright Copyright (c) 2012, Alejandro Ojeda Gutierrez.
 * @license http://www.gnu.org/licenses/gpl.html - GNU Public License.
 * @link http://www.localnet.org.es
 * @package CommonScript
 */

var module_assert = require("./assert");
var test_failure;

/**
 * Runs a unit testing and gets results.
 * @param {Object} Unit testing.
 * @returns {Object} The results.
 */
exports.run = function(unit) {
	test_failure = 0;

	processUnit(unit);

	return test_failure;
};

/**
 * Process a unit testing and their sub-tests.
 * @param {Object} Unit testing to process.
 */
function processUnit(unit) {
	for(var key in unit)
		if(key != "test" && !key.indexOf("test")) {
			if(typeof unit[key] == "function")
				processTest(unit[key]);
			else
				processUnit(unit[key]);
		}
}

/**
 * Process a test from the unit testing.
 * @param {Function} Test to process.
 */
function processTest(test) {
	try {
		test.call(null);
	} catch(e) {
		if(e instanceof module_assert.AssertionError)
			test_failure++;
		else
			throw e;
	}
}