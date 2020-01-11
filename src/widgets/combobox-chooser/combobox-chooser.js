const { LitElement, html, css } = dashboard.lit;

module.exports = class ComboboxChooser extends LitElement {

  static get properties() {
    return {
      label: { type: String },
      selected: { type: Object },
      options: { type: Array }
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  constructor() {
    super();
    this.options = [];
    this.selected = '';
    this.label = '';
  }

  onChange(ev) {
    if (this.ntRoot) {
      const value = ev.detail.value;
      NetworkTables.putValue(this.ntRoot + 'selected', value);
    }
  }

  updated(changes) {
    if (changes.has('table')) {
      this.options = this.table.options || [];
      this.selected = this.table.selected || '';
    }
  }

  render() {
    return html`
      <vaadin-combo-box 
        label="${this.label}" 
        .items="${this.options}" 
        value="${this.selected}"
        @selected-item-changed="${this.onChange}"
      >
    
      </vaadin-combo-box>
      
    `;
  }
}
