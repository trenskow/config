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

# LICENSE

MIT (See license)
