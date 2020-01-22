import { LitElement, html, css } from 'lit-element';
import '@vaadin/vaadin-menu-bar';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-lumo-styles';

import CodeMirror from 'codemirror';
window.CodeMirror = CodeMirror;

require('codemirror-grammar-mode');
require('./google-javascript');
require('./google-html');
require('codemirror/mode/css/css');

const cssPath = require.resolve('codemirror/lib/codemirror.css');

class TextEditor extends LitElement {

  static get properties() {
    return {
      text: { type: String }
    };
  }

  static get styles() {
    return css`
      #editor {
        width: 100%;
        height: 100%;
      }

      .CodeMirror {
        height: 100%;
        background: #eee;
        padding-left: 10px;
      }
    `;
  }

  constructor() {
    super();
    
  }

  initEditor() {
    var cm = CodeMirror(this.shadowRoot.getElementById("editor"), {
      value: this.text || '',
      mode: "google-javascript",
      indentUnit: 2,
      tabSize: 2,
      lineNumbers: false,
      autofocus: true,
      readOnly: true,
      extraKeys: {
        Tab: (cm) => {
          if (cm.getMode().name === 'null') {
            cm.execCommand('insertTab');
          } else {
            if (cm.somethingSelected()) {
              cm.execCommand('indentMore');
            } else {
              cm.execCommand('insertSoftTab');
            }
          }
        },
        Backspace: (cm) => {
          if (!cm.somethingSelected()) {
            let cursorsPos = cm.listSelections().map((selection) => selection.anchor);
            let indentUnit = cm.options.indentUnit;
            let shouldDelChar = false;
            for (let cursorIndex in cursorsPos) {
              let cursorPos = cursorsPos[cursorIndex];
              let indentation = cm.getStateAfter(cursorPos.line).indented;
              if (!(indentation !== 0 &&
                 cursorPos.ch <= indentation &&
                 cursorPos.ch % indentUnit === 0)) {
                shouldDelChar = true;
              }
            }
            if (!shouldDelChar) {
              cm.execCommand('indentLess');
            } else {
              cm.execCommand('delCharBefore');
            }
          } else {
            cm.execCommand('delCharBefore');
          }
        },
        'Shift-Tab': (cm) => cm.execCommand('indentLess')
      }
    });
    setTimeout(() => {
      cm.refresh();
    }, 1);
  }

  firstUpdated() {
    this.initEditor();
  }

  render() {
    return html`
      <link type="text/css" rel="stylesheet" href="${cssPath}">
      <div id="editor"></div>
    `;
  }
}

customElements.define('text-editor', TextEditor);


