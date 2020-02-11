'use strict';

const
	caseit = require('@trenskow/caseit'),
	merge = require('merge'),
	isvalid = require('isvalid'),
	keyd = require('keyd');

let config = {};

// We first split the env names at `_` and put them into objects.
Object.keys(process.env)
	.forEach((key) => {

		// Split and filter.
		const parts = key.split('_').filter((part) => part);

		let obj = config;

		parts
			.forEach((part, idx) => {
				// If we're at the end of the name assign { $: value }.
				if (idx === parts.length - 1) {
					obj[part] = { $: process.env[key] };
				}
				// - else just assign an empty object to store the children.
				else {
					obj = obj[part] = obj[part] || {};
				}
			});
	});

// Cleans the object.
const cleanIt = (obj, expanded = [], keyPath = []) => {
	
	if (!Array.isArray(expanded)) expanded = expanded.split(/, ?/);

	// If the object is a string we just return it.
	if (typeof obj === 'string') return obj;
	
	// Now clean all the keys.
	obj = Object.keys(obj).reduce((res, key) => {
		res[key.toLowerCase()] = cleanIt(obj[key], expanded, keyPath.concat([key]));
		return res;
	}, {});

	// Reduce the object. If a key contains an object with only one key, we merge them.
	obj = Object.keys(obj).reduce((res, key) => {
		const keys = Object.keys(obj[key]);
		const fullKeyPath = keyd.append(keyd.join(keyPath.map((key) => key.toLowerCase())), key);
		const isLocked = expanded.some((keyPath) => keyd.within(fullKeyPath, keyPath));
		if (isLocked || typeof obj[key] === 'string' || typeof obj[key] === 'number' || keys.length > 1) {
			res[key] = obj[key];
		} else {
			const newKey = keys[0] !== '$' ? `${key}_${keys[0]}` : key;
			res[caseit(newKey)] = obj[key][keys[0]];
		}
		return res;
	}, {});

	return obj;

};

// Give it back.
module.exports = cleanIt(config);

module.exports.expand = (keyPaths) => {
	module.exports = merge(cleanIt(config, keyPaths), {
		validate: module.exports.validate,
		expand: module.exports.expand
	});
	return module.exports;
};

module.exports.validate = async (schema, options = {}) => {

	options = merge({
		defaults: {
			unknownKeys: 'allow'
		},
		throwDeepKeyOnImplicit: true
	}, options);

	try {
		return module.exports = await isvalid(
			module.exports,
			merge(schema, {
				'validate': {
					type: 'AsyncFunction'
				},
				'expand': {
					type: 'Function'
				}
			}),
			options);
	} catch (error) {
		if (error.keyPath) {
			error.keyPath = caseit(error.keyPath
				.filter((part) => part)
				.join('.'), 'snake').toUpperCase();
		}
		throw error;
	}

};
