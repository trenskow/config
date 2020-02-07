@trenskow/config
----

Converts `process.env` into a neatly packed object.

# Usage

````javascript
const config = require('@/trenskow/config');
````

# What it does

Turn this

````bash
API_PORT=3000
API_BASE_URL="http://api.myapp.com/"
API_AUTH_TOKEN=myauthtoken
````

into this

```javascript
{
	api: {
		port: '3000',
		baseUrl: 'http://api.myapp.com',
		authToken: 'myauthtoken'
	}
}
````

# Validation

The [isvalid](https://npmjs.org/packages/isvalid) is build into the library and can be used to validate the configuration.

> See the documentation for `isvalid` on how to format the schema.

Example

````javascript
const config = await require('@trenskow/config').validate({
	'port': {
		type: Number,
		required: true,
		range: '-65535'
	}
}, /* options = { defaults: { unknownKeys: 'allow' } } */);
````

The above example will throw an error in the data cannot be validated. It will, though, because of *isvalid* works, convert the port to a `Number`.

> See the *isvalid* documentation to see available options.

> The comment in the example is there to show what options *config* uses as default.

## Validate Once and Require

Validating replaces the exported data of the module – so you only have to validate once. An example of this is provided below.

````javascript
require('@trenskow/config')

	.validate({
		'port': {
			type: Number,
			required: true,
			range: '-65535'
		}
	})

	.then(myApp) // <-- start if successful

	.catch((error) => {

		console.error(`Invalid environment variable ${error.keyPath}: ${error.message}`);

		// `error.keyPath` contains the failed environment variable - in this example `PORT`.
		
		process.exit(1);

	})

const myApp = function() {

	const config = require('@trenskow/config');

	// `config` now contains the validated data.

};
````

# LICENSE

MIT (See license)
