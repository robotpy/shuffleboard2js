import { LitElement, html, css } from 'lit-element';
import './text-editor/index';

const dashboardText = `
const { LitElement, html, css } = dashboard.lit;

class RobotDashboard extends LitElement {

  static get styles() {
    return css\`  
      p {
        color: green;
      }
    \`;
  }

  static get properties() { 
    return {
      
    }
  }

  constructor() {
    super();
  }
  
  firstUpdated() {
    
  }

  render() {
    return html\`
      <p>My first dashboard!</p>
    \`;
  }
}

customElements.define('robot-dashboard', RobotDashboard);
`;

class NoDashboard extends LitElement {

  static get styles() {
    return css`
      
    `;
  }

  static get properties() { 
    return {
      
    }
  }

  constructor() {
    super();
    
  }
  
  firstUpdated() {
    
  }

  render() {
    return html`
      <h2>No dashboard found!</h2>
      <p>To begin creating a robot dashboard, copy the javascript code below, 
        paste it into your favorite editor, save it, and load it into
        <strong>shuffleboard2js</strong> from the file menu.
      </p>
      <text-editor text="${dashboardText}"></text-editor>
    `;
  }
}

customElements.define('no-dashboard', NoDashboard);