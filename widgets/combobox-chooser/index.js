const { LitElement, html, css } = dashboard.lit;

class ComboboxChooser extends LitElement {

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
    if (this.hasNtSource()) {
      const value = ev.detail.value;
      NetworkTables.putValue(this.ntRoot + 'selected', value);
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('table')) {
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

dashboard.registerWidget('combobox-chooser', {
  class: ComboboxChooser,
  label: 'ComboBox Chooser',
  category: 'Basic',
  acceptedTypes: ['String Chooser'],
  image: require('./combobox-chooser.png')
});