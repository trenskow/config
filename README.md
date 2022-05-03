@trenskow/config
----

Converts `process.env` into a neatly packed object.

# Usage

````javascript
import config from '@trenskow/config';

const myConfig = await config();
````

# What it does

It turns the environment variables below...

````bash
API_PORT=3000
API_BASE_URL="http://api.myapp.com/"
API_AUTH_TOKEN=myauthtoken
API_USER_KEYS_0="key1"
API_USER_KEYS_1="key2"
API_USER_KEYS_2="key3"
````

...into the data below.

```javascript
{
	api: {
		port: '3000',
		baseUrl: 'http://api.myapp.com',
		authToken: 'myauthtoken',
		userKeys: [
			'key1',
			'key2',
			'key3'
		]
	}
}
````

# Validation

The [isvalid](https://npmjs.org/package/isvalid) package is build into the library and can be used to validate the configuration.

> See the documentation for `isvalid` on how to format the schema.

Example

````javascript
const myConfig = await config({
	'port': {
		type: Number,
		required: true,
		range: '-65535'
	}
}, /* options = { defaults: { unknownKeys: 'allow' } } */);
````

The above example will throw an error if the data cannot be validated. It will, though, because of the way *isvalid* works, convert the port to a `Number`.

> See the *isvalid* documentation for available options.

> The comment in the example is there to show what options *config* uses per default.

# License

See license in LICENSE.

