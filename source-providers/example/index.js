const { isString, isNumber, isBoolean, isArray, isNull, forEach } = _;

const existingSources = {
	'boolean': {
		value: false,
		type: 'Boolean',
		name: 'boolean'
	},
	'number': {
		value: 10,
		type: 'Number',
		name: 'number'
	}
};

let sources;

const getType = (value) => {
	if (isString(value)) {
		return 'String';
	} else if (isNumber(value)) {
		return 'Number';
	} else if (isBoolean(value)) {
		return 'Boolean';
	} else if (isArray(value)) {
		return 'Array';
	}
	return null;
};

const provider = {
	updateFromProvider: updateSource => {

		sources = new Proxy(existingSources, {
			get: (sources, key) => {
				return sources[key];
			},
			set: (sources, key, { value, type, name }) => {

				sources[key] = { value, type, name };

				updateSource(key, {
					value,
					type,
					name
				});

				return true;
			}
		});

		forEach(sources, ({ value, type, name }, key) => {
			updateSource(key, {
				value,
				type,
				name
			});
		});
		
  },
  updateFromDashboard: (key, value) => {

		const type = getType(value);

		if (isNull(type)) {
			return;
		}

		if (key in sources) {
			if (type === sources[key].type) {
				sources[key] = {
					...sources[key],
					value
				};
			}
		} else {
			sources[key] = {
				value,
				type,
				name: key
			}
		}
  }
};

dashboard.sourceProviders.add('Example', provider);
