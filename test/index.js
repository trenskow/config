'use strict';

import { use, expect } from 'chai';
import merge from '@trenskow/merge';
import chaiAsPromised from 'chai-as-promised';

use(chaiAsPromised);

import config from '../index.js';

process.env = merge({}, process.env, {
	CONFIG_TEST: 'true',
	CONFIG_TEST_OBJ_STRING: 'string',
	CONFIG_TEST_OBJ_NUMBER: '200',
	CONFIG_TEST_SOME_OBJECTS_KEY: 'value',
	CONFIG_TEST_SOME_OBJECTS_OTHER_KEY: undefined,
	CONFIG_TEST_ARRAY_0: '0',
	CONFIG_TEST_ARRAY_1: '1',
	CONFIG_TEST_ARRAY_2: '2',
	CONFIG_TEST_ARRAY_3: '3',
	CONFIG_TEST_THIS_IS_A_DEEPLY_NESTED_KEY: 'true',
	config_test_small_array_0: '0'
});

describe('config', () => {
	it ('must come back with the process.env proper converted.', () => {
		return config().then((result) => {
			expect(result).to.have.property('configTest'),
			expect(result).to.have.property('configTest').to.have.property('$').equal('true'),
			expect(result).to.have.property('configTest').to.have.property('obj'),
			expect(result).to.have.property('configTest').to.have.property('obj').to.have.property('string').equal('string'),
			expect(result).to.have.property('configTest').to.have.property('obj').to.have.property('number').equal('200');
		});
	});
	it ('must come back with the original environment name on error.', () => {
		return config({
			'configTest': {
				'obj': {
					'string': { type: Number, required: true }
				}
			}
		}).catch((error) => {
			expect(error.message).to.equal('Is not of type number.');
			expect(error.keyPath).to.equal('CONFIG_TEST_OBJ_STRING');
		});
	});
	it ('must validate', () => {
		return config({
			'configTest': {
				'$': { type: Boolean, required: true},
				'obj': {
					'string': { type: String, required: true },
					'number': { type: Number, required: true }
				}
			}
		}).then((result) => {
			expect(result).to.have.property('configTest');
			expect(result.configTest).to.have.property('$').equal(true);
			expect(result.configTest).to.have.property('obj');
			expect(result.configTest.obj).to.have.property('string').equal('string');
			expect(result.configTest.obj).to.have.property('number').equal(200);
			expect(result.configTest.obj).to.have.property('number').equal(200);
		});
	});
	it ('should convert arrays into arrays.', () => {
		return config().then((result) => {
			expect(result)
				.to.have.property('configTest')
				.to.have.property('array')
				.to.eql(['0', '1', '2', '3']);
		});
	});
	it ('should convert even small arrays.', () => {
		return config().then((result) => {
			expect(result)
				.to.have.property('configTest')
				.to.have.property('smallArray')
				.to.eql(['0']);
		});
	});
	it ('must validate a deeply nested key.', () => {
		return config({
			'configTest': {
				'this': {
					'is': {
						'a': {
							'deeply': {
								'nested': {
									'key': { type: Boolean }
								}
							}
						}
					}
				}
			}
		}).then((result) => {
			expect(result.configTest.this.is.a.deeply.nested.key).to.equal(true);
		});
	});
});
