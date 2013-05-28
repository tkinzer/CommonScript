/**
 * @author Alejandro Ojeda Gutierrez.
 * @copyright Copyright (c) 2012, Alejandro Ojeda Gutierrez.
 * @license http://www.gnu.org/licenses/gpl.html - GNU Public License.
 * @link http://www.localnet.org.es
 * @package CommonScript
 */

/**
 * CommonJS Modules/1.1.1 implementation for client side.
 * @param {Object} Global scope object.
 * @param {String} Base path for modules load.
 */
(function(global_scope, base_path) {
	var module_temp = {};
	var module_memo = {};


	/**
	 * CommonJS module object namespace.
	 * @param {String} Normalized module ID.
	 */
	function Module(id) {
		Object.defineProperty(this, "id", {value: id, enumerable: true});
	}

	/**
	 * Load a module in a synchronous or asynchronous.
	 * @param {String} Module ID.
	 * @param {Function} Callback function.
	 */
	Module.prototype.load = function(id, callback) {
		var async = !!callback, temp, xhr;

		if(!ownProperty(module_memo, (id = normalizeId(id, this.id))))
			if(!async || !(temp = ownProperty(module_temp, id))) {
				if(!temp)
					module_temp[id] = {xhr: new XMLHttpRequest(), callback: []};
				if(callback)
					module_temp[id].callback.push(callback);
				(xhr = module_temp[id].xhr).open("GET", id2uri(id), async);
				xhr.addEventListener("load", eventLoad, false);
				xhr.addEventListener("error", eventLoad, false);
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				xhr.send(null);
			} else {
				module_temp[id].callback.push(callback);
			}
		else if(callback)
			callback.call(global_scope);
	};

	/**
	 * Callback for XHR events load and error.
	 * @param {Event} Object XHR event.
	 */
	function eventLoad(event) {
		var id;

		for(id in module_temp)
			if(module_temp[id].xhr === this)
				break;

		if(!this.status || this.status >= 200 && this.status < 300)
			memoizeModule(id, this.responseText, false);
		else
			memoizeModule(id, new Error(this.statusText), true);
	}


	/**
	 * CommonJS require function namespace.
	 * @param {Module} Main module object.
	 * @returns {Function} The require function.
	 */
	function factoryRequire(module) {
		/**
		 * The require function.
		 * @param {String} Module ID.
		 * @returns {Object} Exports.
		 */
		function require(id) {
			if(!ownProperty(module_memo, (id = normalizeId(id, module.id))))
				module.load(id, null);

			return getExports(id);
		}

		/**
		 * Gets normalized ID of a module.
		 * @param {String} Module ID.
		 * @returns {String} Normalized ID.
		 */
		require.id = function(id) {
			return normalizeId(id, module.id);
		};

		/**
		 * Converts a module ID to URI.
		 * @param {String} Module ID.
		 * @returns {String} Resultant URI.
		 */
		require.uri = function(id) {
			return id2uri(normalizeId(id, module.id));
		};

		/**
		 * Memoize a module doing it available.
		 * @param {String} Normalized module ID.
		 * @param {Function|Object|String} Module factory, exports or code.
		 */
		require.memoize = function(id, factory) {
			if(ownProperty(module_memo, id))
				throw new Error("Module \"" + id + "\" already memoized.");
			
			memoizeModule(id, factory, false);
		};

		/**
		 * Checks if a module is memoized.
		 * @param {String} Normalized module ID.
		 * @returns {Boolean} Result of checks.
		 */
		require.isMemoized = function(id) {
			return ownProperty(module_memo, id);
		};

		return require;
	}


	/**
	 * Checks if a object has own property.
	 * @param {Object} Object to be checked.
	 * @param {String} Property name.
	 * @returns {Boolean} Result of checks.
	 */
	function ownProperty(object, key) {
		return Object.prototype.hasOwnProperty.call(object, key);
	}

	/**
	 * Normalize a module ID.
	 * @param {String} Module ID.
	 * @param {String} Main module ID.
	 * @returns {String} Normalized ID.
	 */
	function normalizeId(id, main) {
		var relative = id.split("/"), absolute = [];

		if(relative[0] == "." || relative[0] == "..")
			absolute = main.split("/").slice(0, -1);

		for(var i = 0, l = relative.length; i < l; i++)
			if(relative[i] == "..") {
				if(!absolute.length)
					throw new Error("Can't normalize \"" + id +"\".");
				absolute.pop();
			} else if(relative[i] != ".") {
				absolute.push(relative[i]);
			}

		return absolute.join("/");
	}

	/**
	 * Converts a module ID to URI.
	 * @param {String} Normalized module ID.
	 * @returns {String} Resultant URI.
	 */
	function id2uri(id) {
		return location.protocol + "//" + location.host + base_path + id + ".js";
	}

	/**
	 * Memoize a loaded module doing it available.
	 * @param {String} Normalized module ID.
	 * @param {Function|Object|String} Module factory, exports or code.
	 * @param {Boolean} If has ocurred a error true otherwise fase.
	 */
	function memoizeModule(id, factory, error) {
		if(!error) {
			if(typeof factory == "string")
				factory = new Function("require", "exports", "module", factory);
			if(typeof factory == "function")
				module_memo[id] = {factory: factory};
			else
				module_memo[id] = {exports: factory};
		} else {
			module_memo[id] = {error: factory};
		}

		if(ownProperty(module_temp, id)) {
			while(module_temp[id].callback.length)
				module_temp[id].callback.pop().call(global_scope);
			delete module_temp[id].callback, module_temp[id].xhr, module_temp[id];
		}
	}

	/**
	 * Gets the exports of a loaded module.
	 * @param {String} Normalized module ID.
	 * @returns {Object} The exports of the module.
	 */
	function getExports(id) {
		var arg = [], exports;

		if(ownProperty(module_memo[id], "error"))
			throw module_memo[id].error;

		if(!ownProperty(module_memo[id], "exports")) {
			arg[0] = factoryRequire(arg[2] = new Module(id));
			arg[1] = module_memo[id].exports = {};
			try {
				exports = module_memo[id].factory.apply(null, arg);
				if(typeof exports != "undefined")
					module_memo[id].exports = exports;
			} catch(e) {
				throw (module_memo[id].error = e);
			}
		}

		return module_memo[id].exports;
	}


	/**
	 * Public api.
	 */
	global_scope.module = new Module("");
	global_scope.require = factoryRequire(global_scope.module);

	/**
	 * Getter / Setter to configure the base path.
	 */
	Object.defineProperty(global_scope.require, "path", {
		get: function() { return base_path; },
		set: function(value) { base_path = value; }
	});
})(this, location.pathname.split("/").slice(0, -1).join("/") + "/");