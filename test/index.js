'use strict';

const
	{ expect } = require('chai');

process.env.CONFIG_TEST = 'true';
process.env.CONFIG_TEST_OBJ_STRING = 'string';
process.env.CONFIG_TEST_OBJ_NUMBER = '200';

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
					'string': { type: Number, required: true}
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
});
