import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../render-utils';
import '@vaadin/vaadin-menu-bar';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-lumo-styles';

import CodeMirror from 'codemirror';
window.CodeMirror = CodeMirror;

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
require('codemirror-grammar-mode');
require('../../../../vendor/codemirror-modes/google-javascript');
require('../../../../vendor/codemirror-modes/google-html');
require('codemirror/mode/css/css');


class TextEditor extends LitElement {

  static get properties() {
    return {
      
    };
  }

  static get styles() {
    return css`
      #editor {
        width: 100%;
        height: 100%;
      }
    `;
  }

  constructor() {
    super();
    
  }

  initEditor() {
    var cm = CodeMirror(this.shadowRoot.getElementById("editor"), {
      value: "function myScript() {\n    return 100;\n}",
      mode: "google-javascript",
      indentUnit: 2,
      tabSize: 2,
      lineNumbers: true,
      autofocus: true,
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

  initEditorMenu() {
    const menu = this.shadowRoot.querySelector('vaadin-menu-bar');
    menu.items = [
      {
        component: makeIcon('lumo:menu'),
        children: [
          {text: 'Dashboard'},
          {text: 'Reports'}
        ]
      },
      {
        component: makeIcon('lumo:user'),
        children: [
          {text: 'Edit Profile'},
          {component: 'hr'},
          {text: 'Privacy Settings'},
          {text: 'Terms of Service'}
        ]
      },
      {
        component: makeIcon('lumo:bell'),
        children: [
          {text: 'Notifications'},
          {text: 'Mark as read'}
        ]
      }
    ];
    function makeIcon(img, txt) {
      const icon = window.document.createElement('iron-icon');
      icon.icon = img;
      icon.style.margin = '0 6px';
      return icon;
    }
    menu.addEventListener('item-selected', function(e) {
      document.querySelector('i').textContent = JSON.stringify(e.detail.value);
    });
  }

  firstUpdated() {
    this.initEditor();
    this.initEditorMenu();
  }


  render() {
    return html`
      ${includeStyles()}
      <vaadin-menu-bar theme="tertiary-inline"></vaadin-menu-bar>
      <div id="editor"></div>
    `;
  }
}

customElements.define('text-editor', TextEditor);


