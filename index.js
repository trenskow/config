'use strict';

import caseit from '@trenskow/caseit';
import merge from '@trenskow/merge';
import isvalid, { formalize, keyPaths } from 'isvalid';
import keyd from 'keyd';

const fillArray = (value, length) => {
	let result = [];
	for (let idx = 0; idx < length; idx++) result.push(value);
	return result;
};

const makeArrayIfNecessary = (obj) => {

	const keys = Object.keys(obj);
	const arrayKeys = fillArray(undefined, keys.length)
		.map((_, idx) => idx);

	for (let idx = 0; idx < keys.length; idx++) {
		if (keys[idx] != arrayKeys[idx]) return obj;
	}

	return arrayKeys.map((idx) => obj[idx]);

};

// Cleans the object.
const cleanIt = (obj, expanded = [], keyPath = []) => {

	if (typeof obj === 'undefined') return;

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

		const keys = obj[key] ? Object.keys(obj[key]) : [];

		let fullKeyPath = keyd.join(keyPath.map((key) => key.toLowerCase()));

		if (key !== '$') fullKeyPath = keyd.append(fullKeyPath, key);

		const isLocked = expanded.some((keyPath) => {
			return keyPath.split(/(?=[A-Z])|\./).map((key) => caseit(key)).join('.') == fullKeyPath;
		});

		if (Array.isArray(obj[key]) || isLocked || typeof obj[key] === 'undefined' || typeof obj[key] === 'string' || typeof obj[key] === 'number' || keys.length > 1) {
			res[key] = obj[key];
		} else {
			const newKey = keys[0] !== '$' ? `${key}_${keys[0]}` : key;
			res[caseit(newKey)] = obj[key][keys[0]];
		}

		return makeArrayIfNecessary(res);

	}, {});

	return obj;

};

const camelCased = (schema) => {
	const result = {};
	Object.keys(process.env)
		.filter((key) => process.env[key])
		.forEach((key) => {
			keyd(result).set(`${caseit(key.toLowerCase(), 'domain')}.$`, process.env[key]);
		});
	return cleanIt(result, keyPaths(schema).all(Object).filter((keyPath) => keyPath));
};

// Give it back.
export default async (schema = {}, options = {}) => {

	schema = formalize(schema);

	options = merge({
		defaults: {
			unknownKeys: 'allow'
		},
		aggregatedErrors: 'flatten'
	}, options);

	try {
		return await isvalid(
			camelCased(schema),
			schema,
			options);
	} catch (error) {
		(error.errors || [error]).forEach((error) => {
			if (error.keyPath) {
				error.keyPath = caseit(error.keyPath
					.filter((part) => part)
					.join('.'), 'snake').toUpperCase();
			}
		});
		throw error;

	}

};
