import { LitElement } from 'lit-element';
import { isArray } from 'lodash';
import { SourceManager } from '../source-managers';
import { has as hasProvider } from '../source-providers'

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
      if (hasProvider(name)) {
        new SourceManager(name);
      }
    }
  }
}