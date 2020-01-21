const { isString, isNumber, isBoolean, isArray } = _;
const NetworkTables = require('./networktables.js');
const SettingsElement = require('./settings-element');
const { SourceProvider } = dashboard.sourceProviders;

module.exports = class NetworkTablesProvider extends SourceProvider {

	static get typeName() {
		return 'NetworkTables';
	}

	static get settingsElement() {
		return SettingsElement;
	}

	static get settingsDefaults() {
		return {
			address: 'localhost'
		};
	}

	constructor(settings) {
		super();
		this.address = dashboard.storage.get('robotAddress', settings.address);
		
		// Keep trying to connect if a connection hasn't been found
    setInterval(() => {
      if (!NetworkTables.isRobotConnected()) {
        NetworkTables.connect(this.address);
      }
    }, 500);

    NetworkTables.addRobotConnectionListener(connected => {
      dashboard.store.dispatch(dashboard.actions.clearSources('NetworkTables'));
    }, true);
	}

	get settings() {
		return {
			address: this.address
		}
	}

	onSettingsChange(settings) {
		this.address = settings.address;
	}

	updateFromProvider(updateSource) {
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
	}

	updateFromDashboard(key, value) {
		NetworkTables.putValue(key, value);
  }
}
