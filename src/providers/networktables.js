const { isString, isNumber, isBoolean, isArray } = _;

export default {
	updateFromProvider: updateSource => {
		NetworkTables.addGlobalListener((key, value) => {
			if (key.endsWith('/.type')) {
				updateSource(key, {
					value,
					type: 'String'
				});
				updateSource(key.substring(0, key.length - 6), {
					type: value,
				});
			} else if (key.endsWith('/.name')) {
				updateSource(key, {
					value,
					type: 'String'
				});
				updateSource(key.substring(0, key.length - 6), {
					name: value
				});
			} else {
				let primitiveType;

				if (isBoolean(value)) {
					primitiveType = 'Boolean';
				} else if (isString(value)) {
					primitiveType = 'String'
				} else if (isNumber(value)) {
					primitiveType = 'Number';
				} else if (isArray(value)) {
					primitiveType = 'Array';
				}

				const type = NetworkTables.getValue(`${key}/.type`) || primitiveType;
				const name = NetworkTables.getValue(`${key}/.name`);
				updateSource(key, {
          value,
          type,
          name
        });
			}
	  }, true);
  },
  updateFromDashboard: (key, value) => {
		NetworkTables.putValue(key, value);
	}
};