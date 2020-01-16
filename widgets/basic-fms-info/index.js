const { LitElement, html, css } = dashboard.lit;

const ENABLED_FLAG = 0x01;
const AUTO_FLAG = 0x02;
const TEST_FLAG = 0x04;
const EMERGENCY_STOP_FLAG = 0x08;
const FMS_ATTACHED_FLAG = 0x10;
const DS_ATTACHED_FLAG = 0x20;

class BasicFmsInfo extends LitElement {

  static get styles() {
    return css`
      p {
        margin: 5px 0;
      }

      p:first-child {
        margin-top: 0;
      }

      p:last-child {
        margin-bottom: 0;
      }

      :host {
        text-align: center;
        font-size: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      [icon="vaadin:check"] {
        color: green;
      }

      [icon="vaadin:close-small"] {
        color: red;
      }
    `;
  }

  getRobotState() {
    if (this.isEnabled()) {
      if (this.isTest()) {
        return 'Test';
      } 
      else if (this.isAuto()) {
        return 'Autonomous';
      } 
      else {
        return 'Teleoperated';
      }
    } 
    else {
      return 'Disabled';
    }
  }

  getMatchType() {
    return this.hasNtSource() ? this.table.MatchType : '';
  }

  getMatchNumber() {
    return this.hasNtSource() ? this.table.MatchNumber : 0;
  }

  getEventName() {
    return this.hasNtSource() ? this.table.EventName : '';
  }

  isEnabled() {
    return !!(this.table.FMSControlData & ENABLED_FLAG);
  }

  isAuto() {
    return !!(this.table.FMSControlData & AUTO_FLAG);
  }

  isTest() {
    return !!(this.table.FMSControlData & TEST_FLAG);
  };

  isEmergencyStopped() {
    return !!(this.table.FMSControlData & EMERGENCY_STOP_FLAG);
  }

  isFmsAttached() {
    return !!(this.table.FMSControlData & FMS_ATTACHED_FLAG);
  }

  isDsAttached() {
    return !!(this.table.FMSControlData & DS_ATTACHED_FLAG);
  }

  render() {
    return html`
      <p>
        <strong>
          <span>${this.getEventName()}</span>
          <span>${this.getMatchType()}</span>
          <span>match ${this.getMatchNumber()}</span>
        </strong>
      </p>
      
      <p style="margin-bottom: 7px; font-weight: normal">
        <span style="margin-right: 5px;">
          ${this.isFmsAttached() ? html`
            <span>
              <iron-icon icon="vaadin:check"></iron-icon>
              FMS connected
            </span>
          ` : html`
            <span>
              <iron-icon icon="vaadin:close-small"></iron-icon> 
              FMS disconnected
            </span>
          `}
        </span>
        <span>
          ${this.isDsAttached() ? html`
            <span>
            <iron-icon icon="vaadin:check"></iron-icon>
              DriverStation connected
            </span>
          ` : html`
            <span>
              <iron-icon icon="vaadin:close-small"></iron-icon> 
              DriverStation disconnected
            </span>
          `}
        </span>
      </p>

      <p style="font-weight: normal">
        Robot state: ${this.getRobotState()}
      </p>
    `;
  }
}

dashboard.registerWidget('basic-fms-info', {
  class: BasicFmsInfo,
  label: 'Basic FMS Info',
  category: 'Basic',
  acceptedTypes: ['FMSInfo'],
  image: require('./basic-fms-info.png')
});