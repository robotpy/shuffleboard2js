const { LitElement, html, css } = dashboard.lit;

class ToggleSwitch extends LitElement {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 60px;
        height: 34px;
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        margin-bottom: 0;
      }

      .switch input { 
        opacity: 0;
        width: 0;
        height: 0;
      }

      [part=switch] {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }

      [part=switch]:before {
        position: absolute;
        content: "";
        height: var(--circle-height);
        width: var(--circle-width);
        left: var(--circle-top);
        top: var(--circle-top);
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
      }

      input:checked + [part=switch] {
        background-color: #2196F3;
      }

      input:focus + [part=switch] {
        box-shadow: 0 0 1px #2196F3;
      }

      input:checked + [part=switch]:before {
        transform: translateX(var(--circle-translate-x));
      }
    `;
  }

  static get properties() {
    return {
      checked: { type: Boolean }
    }
  }

  constructor() {
    super();
    this.checked = false;
  }

  updated() {
    if (typeof this.table === 'boolean') {
      this.checked = this.table;
    }
  }

  firstUpdated() {
    const resizeObserver = new ResizeObserver(() => {
      this.rect = this.getBoundingClientRect();
      const { width, height } = this.rect;
      const slider = this.shadowRoot.querySelector('[part=switch]');
      slider.style.borderRadius = `${width}px`;
      slider.style.setProperty('--circle-width', `${height * .8}px`);
      slider.style.setProperty('--circle-height', `${height * .8}px`);
      slider.style.setProperty('--circle-left', `${width / 2 - height * .8}px`);
      slider.style.setProperty('--circle-top', `${height * .1}px`);
      slider.style.setProperty('--circle-translate-x', `${width - height}px`);
    });
    resizeObserver.observe(this);
  }

  onChange(ev) {
    const checked = ev.target.checked;

    if (typeof this.table === 'boolean') {
      NetworkTables.putValue(this.ntRoot, checked);
    }
    else {
      this.checked = checked;
    }
  }

  render() {
    return html`   
      <label class="switch">
        <input 
          type="checkbox" 
          .checked="${this.checked}" 
          @change="${this.onChange}"
        />
        <span part="switch"></span>
      </label>
    `;
  }
}

dashboard.registerWidget('toggle-switch', {
  class: ToggleSwitch,
  label: 'Toggle Switch',
  category: 'Basic',
  acceptedTypes: ['boolean'],
  image: require('./toggle-switch.png')
});