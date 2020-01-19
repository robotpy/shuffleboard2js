import { LitElement, html, css } from 'lit-element';
import store from '../redux/store';
import { connect } from 'pwa-helpers';
import { map } from 'lodash';
import './widget-menu-item';
import '@vaadin/vaadin-accordion';

class WidgetMenu extends connect(store)(LitElement) {

  static get styles() {
    return css`

      vaadin-accordion {
        margin-left: 15px;
      }

      vaadin-accordion-panel {
        border: none;
      }

      widget-menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        margin: 10px 5px;
      }
    `;
  }

  static get properties() { 
    return {
      categories: { type: Object }      
    };
  }

  stateChanged(state) {
    const { registered, categories } = state.widgets;
    this.categories = categories
      .sort()
      .map(category => ({
        label: category,
        types: map(registered, (type, name) => ({ ...type, widgetType: name }))
          .filter(widget => widget.category === category)
          .sort((widget1, widget2) => {
            let label1 = widget1.label.toLowerCase();
            let label2 = widget2.label.toLowerCase();
            if (label1 < label2) return -1;
            else if (label1 > label2) return 1;
            return 0;
          })
      }))
  }

  render() {
    return html`
      <vaadin-accordion>
        ${this.categories.map(category => html`
          <vaadin-accordion-panel>
            <div slot="summary">${category.label}</div>
            <vaadin-vertical-layout>
              ${category.types.map(type => html`
                <widget-menu-item 
                  type="${type.widgetType}"
                  label="${type.label}"
                  image="${type.image}"
                  minx="${type.minX}"
                  miny="${type.minY}"
                >
                </widget-menu-item>
              `)}   
            </vaadin-vertical-layout>
          </vaadin-accordion-panel>
        `)}
      </vaadin-accordion>
    `;
  }
}

customElements.define('widget-menu', WidgetMenu);