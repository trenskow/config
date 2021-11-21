'use strict';

const
	{ expect } = require('chai');

process.env = {
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
};

const config = require('../');

describe('config', () => {
	it ('must come back with the process.env proper converted.', () => {
		expect(config).to.have.property('configTest');
		expect(config.configTest).to.have.property('$').equal('true');
		expect(config.configTest).to.have.property('obj');
		expect(config.configTest.obj).to.have.property('string').equal('string');
		expect(config.configTest.obj).to.have.property('number').equal('200');
	});
	it ('must come back with the original environment name on error.', (done) => {
		config.validate({
			'configTest': {
				'obj': {
					'string': { type: Number, required: true }
				}
			}
		}).then(() => {
			done(new Error('Data was validated.'));
		}).catch((error) => {
			expect(error.message).to.equal('Is not of type Number.');
			expect(error.keyPath).to.equal('CONFIG_TEST_OBJ_STRING');
			done();
		}).catch(done);
	});
	it ('must validate', (done) => {
		config.validate({
			'configTest': {
				'$': { type: Boolean, required: true},
				'obj': {
					'string': { type: String, required: true },
					'number': { type: Number, required: true }
				}
			}
		}).then((returned) => {
			expect(config).to.have.property('configTest');
			expect(config.configTest).to.have.property('$').equal(true);
			expect(config.configTest).to.have.property('obj');
			expect(config.configTest.obj).to.have.property('string').equal('string');
			expect(config.configTest.obj).to.have.property('number').equal(200);
			expect(config.validate).to.be.a('Function');
			expect(returned.configTest.obj).to.have.property('number').equal(200);
			done();
		}).catch(done);
	});
	it ('should convert arrays into arrays.', () => {
		const result = require('../');
		expect(result)
			.to.have.property('configTest')
			.to.have.property('array')
			.to.eql(['0', '1', '2', '3']);
	});
	it ('should convert even small arrays.', () => {
		const result = require('../');
		expect(result)
			.to.have.property('configTest')
			.to.have.property('smallArray')
			.to.eql(['0']);
	});
	it ('not remove validate method when unknown keys are set to be removed', (done) => {
		config.validate({
			'configTest': {
				'$': { type: Boolean, required: true},
				'obj': {
					'string': { type: String, required: true }
				}
			}
		}, {
			defaults: {
				unknownKeys: 'remove'
			}
		}).then(() => {
			const result = require('../');
			expect(result.validate).to.be.a('Function');
			done();
		}).catch(done);
	});
	it ('must validate a deeply nested key.', (done) => {
		config.validate({
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
		}).then(() => {
			const result = require('../');
			expect(result.configTest.this.is.a.deeply.nested.key).to.equal(true);
			done();
		}).catch(done);
	});
});
