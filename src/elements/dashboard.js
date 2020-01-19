import { LitElement } from 'lit-element';
import { isArray } from 'lodash';
import { updateSource } from '../sources';

export default class Dashboard extends LitElement {

  constructor() {
    super();
    let providerNames = ['NetworkTables'];
    if (typeof this.providerNames === 'string') {
      providerNames = [this.providerNames];
    } else if (isArray(this.providerNames)) {
      providerNames = this.providerNames;
    }

    for (let name of providerNames) {
      const provider = dashboard.sourceProviders.get(name);
      if (provider) {
        provider.updateFromProvider(updateSource);
      }
    }
  }
}