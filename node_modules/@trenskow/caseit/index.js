'use strict';

module.exports = exports = function(input, type = 'camel') {

	const separators = {
		'camel': '',
		'pascal': '',
		'snake': '_',
		'domain': '.',
		'kebab': '-',
		'title': ' '
	};

	if (Object.keys(separators).indexOf(type) == -1) {
		throw new TypeError('Type must either be `camel`, `pascal`, `snake`, `domain`, `kebab`, `title`.');
	}

	const parts = input.split(/(?=[A-Z])|_|-| |\./)
		.filter((key) => key.length)
		.map((key, idx) => {
			switch (type) {
			case 'camel':
				if (idx == 0) return key.toLowerCase();
				// falls through
			case 'title':
				// falls through
			case 'pascal':
				return key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();
			case 'domain':
				// falls through
			case 'kebab':
				// falls through
			case 'snake':
				return key.toLowerCase();
			}
		});

	return parts.join(separators[type]);
					
};
