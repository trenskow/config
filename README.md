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

The [isvalid](https://npmjs.org/packages/isvalid) is build into the library and can be used to validate the configuration. See the documentation for `isvalid` on how to format the schema.

Example

````javascript
const config = await require('@trenskow/config').validate({
	'port': {
		type: Number,
		required: true,
		range: '-65536'
	}
}, /* options = { defaults: { unknownKeys: 'allow' } } */);
````

The above example will throw an error in the data cannot be validated. It will, though, because of *isvalid* works, convert the port to a `Number`.

Validating replaces the exported data of the module – so you only have to validate once.

> The options (shown in the example) is for *isvalid* and can be provided optionally. The comment is there to show what the *config* uses as default. See the *isvalid* documentation to see available options.

# LICENSE

MIT (See license)
