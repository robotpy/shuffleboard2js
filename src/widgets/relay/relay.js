import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';

class RelayWidget extends LitElement {

  static get styles() {
    return css`
      .btn-group-vertical {
          height: 100%;
          width: 100%;
        }
    `;
  }

  static get properties() {
    return {
      
    };
  }

  constructor() {
    super();
    
  }

  onClickOff(ev) {
      this.setBtnValue(ev, 'Off');
  }

  onClickOn(ev) {
      this.setBtnValue(ev, 'On');
  }

  onClickForward(ev) {
      this.setBtnValue(ev, 'Forward');
  }

  onClickReverse(ev) {
    this.setBtnValue(ev, 'Reverse');
  }

  setBtnValue(ev, value) {
    if ('Value' in this.table) {
        NetworkTables.putValue(this.ntRoot + 'Value', value);
    }
    else {
        this.selectBtn(ev.target);
    }
  };

  selectBtn(target) {
    const buttons = this.shadowRoot.getElementById('buttons');
    $(buttons).find('.btn')
      .removeClass('btn-secondary')
      .addClass('btn-light');

    $(target)
      .removeClass('btn-light')
      .addClass('btn-secondary');
  }

  getButton(value) {
    return this.shadowRoot.getElementById(`${value.toLowerCase()}Btn`);
  }

  updated() {
    if ('Value' in this.table) {
      const target = this.getButton(this.table.Value);
      this.selectBtn(target);
    }
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="btn-group-vertical" id="buttons">
        <button id="offBtn" type="button" class="btn btn-secondary" @click="${this.onClickOff}">Off</button>
        <button id="onBtn" type="button" class="btn btn-light" @click="${this.onClickOn}">On</button>
        <button id="forwardBtn" type="button" class="btn btn-light" @click="${this.onClickForward}">Forward</button>
        <button id="reverseBtn" type="button" class="btn btn-light" @click="${this.onClickReverse}">Reverse</button>
      </div>
    `;
  }
}

customElements.define('relay-widget', RelayWidget);
