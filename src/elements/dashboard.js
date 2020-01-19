import { LitElement } from 'lit-element';
import { isArray } from 'lodash';
import { add as addManager } from '../source-managers';

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
      addManager(name);
    }
  }
}