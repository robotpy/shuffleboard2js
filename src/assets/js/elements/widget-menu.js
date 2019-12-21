import { LitElement, html, css } from 'lit-element';
import store from '../store';
import { connect } from 'pwa-helpers';
import { includeStyles } from '../render-utils';
import { kebabCase, map } from 'lodash';
import '../elements/widget-menu-item';

class WidgetMenu extends connect(store)(LitElement) {

  static get styles() {
    return css`
    #accordion {
        height: 100%;
        overflow: auto;
      }

      .card {
        border-radius: 0;
        border-bottom-width: 0px;
      }

      .card:last-child {
        border-bottom-width: 1px;
      }

      .card-header {
        padding: 3px 5px;
      }

      .oi-caret-right {
        display: none;
      }

      .collapsed .oi-caret-right {
        display: inline-block;
      }

      .collapsed .oi-caret-bottom {
        display: none;
      }

      .oi {
        font-size: 12px;
        margin-right: 5px;
      }

      .btn-link:hover, .btn-link:focus {
        text-decoration: none;
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

  setCollapseState(card, collapse) {
    const $card = $(card);
    const $button = $card.find('.card-header button');
    const $collapse = $card.find('.collapse');
    if (collapse) {
      $button.addClass('collapsed');
      $button.attr('aria-expanded', 'false');
      $collapse.removeClass('show');
    } else {
      $button.removeClass('collapsed');
      $button.attr('aria-expanded', 'true');
      $collapse.addClass('show');
    }
    
  }

  onCollapseToggle(ev) {
    const that = this;
    const $button = $(ev.target);
    const $card = $button.closest('.card');
    const collapsed = $button.hasClass('collapsed');
    $(this.shadowRoot).find('.card').each(function() {
      that.setCollapseState(this, true);
    });
    this.setCollapseState($card, !collapsed);
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
      ${includeStyles()}
      <div id="accordion">
        ${this.categories.map(category => html`
          <div class="card">
            <div class="card-header" id="${kebabCase(category.label)}-header">
              <h5 class="mb-0">
                <button 
                  class="btn btn-link collapsed" 
                  data-toggle="collapse" 
                  data-target="#${kebabCase(category.label)}-body" 
                  aria-expanded="false" 
                  aria-controls="${kebabCase(category.label)}-body"
                  @click="${this.onCollapseToggle}"
                >
                  <span class="oi oi-caret-right"></span>
                  <span class="oi oi-caret-bottom"></span>
                  ${category.label}
                </button>
              </h5>
            </div>

            <div 
              id="${kebabCase(category.label)}-body" 
              class="collapse" 
              aria-labelledby="${kebabCase(category.label)}-header" 
              data-parent="#accordion"
            >
              <div class="card-body">
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
              </div>
            </div>
          </div>  
        `)}
      </div>
    `;
  }
}

customElements.define('widget-menu', WidgetMenu);