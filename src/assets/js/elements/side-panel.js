import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../render-utils';
import './widget-menu';
import './networktables/networktables-sources';

class SidePanel extends LitElement {

  static get styles() {
    return css`
      .card-body {
        padding: 10px;
        overflow: auto;
      }

      > .card > .card-header {
        border-bottom: none;
        padding: 0 1.25rem .75rem;
      }

      > .card {
        border-bottom: none;
        height: 100%;
      }

      .card {
        border-radius: 0;
        border-bottom: none;
      }

      .card:last-child {
        border-bottom: 1px solid rgba(0, 0, 0, 0.125);;
      }
      
      > .card > .card-header .nav-item .nav-link {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-top: 0;
      }
    `;
  }

  constructor() {
    super();
    this.showSources = true;
  }

  selectSources() {
    this.showSources = true;
    this.requestUpdate();
  }

  selectWidgets() {
    this.showSources = false;
    this.requestUpdate();
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="card ">
        <div class="card-header"> 
          <ul class="nav nav-tabs card-header-tabs pull-right" id="myTab" role="tablist">
            <li class="nav-item" @click="${this.selectSources}">
              <a 
                class="nav-link ${this.showSources ? 'active show' : ''}" 
                id="sources-tab" 
                data-toggle="tab" 
                href="#sources" 
                role="tab" 
                aria-controls="sources" 
                aria-selected="${this.showSources ? 'true' : 'false'}"
              >
                Sources
              </a>
            </li>
            <li class="nav-item" @click="${this.selectWidgets}">
              <a 
                class="nav-link ${!this.showSources ? 'active show' : ''}" 
                id="widges-tab" 
                data-toggle="tab" 
                href="#widgets" 
                role="tab" 
                aria-controls="widgets" 
                aria-selected="${!this.showSources ? 'true' : 'false'}"
              >
                Widgets
              </a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <div class="tab-content" id="myTabContent">
            <div 
              class="tab-pane fade ${this.showSources ? 'active show' : ''}" 
              id="sources" 
              role="tabpanel" 
              aria-labelledby="sources-tab"
            >
              <networktables-sources></networktables-sources>
            </div>
            <div 
              class="tab-pane fade ${!this.showSources ? 'active show' : ''}" 
              id="widgets" 
              role="tabpanel" 
              aria-labelledby="widgets-tab"
            >
              <widget-menu></widget-menu>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('side-panel', SidePanel);