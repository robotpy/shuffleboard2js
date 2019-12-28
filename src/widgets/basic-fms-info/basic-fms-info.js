import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';

const ENABLED_FLAG = 0x01;
const AUTO_FLAG = 0x02;
const TEST_FLAG = 0x04;
const EMERGENCY_STOP_FLAG = 0x08;
const FMS_ATTACHED_FLAG = 0x10;
const DS_ATTACHED_FLAG = 0x20;

const MATCH_TYPES = ['Unknown', 'Practice', 'Qualification', 'Elimination'];

class BasicFmsInfo extends LitElement {

  static get styles() {
    return css`
      p {
        font-size: 15px;
      }

      .fms-info-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      }

      .oi-check {
        color: green;
        font-size: 13px;
      }

      .oi-x {
        color: red;
        font-size: 13px;
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
    if ('MatchType' in this.table) {
      return MATCH_TYPES[this.table.MatchType];
    }
    else {
      return 'Unknown';
    }
  }

  getMatchNumber() {
    if ('MatchNumber' in this.table) {
      return this.table.MatchNumber;
    }
    else {
      return 0;
    }
  }

  getEventName() {
    if ('EventName' in this.table) {
      return this.table.EventName;
    }
    else {
      return '';
    }
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
      ${includeStyles()}
      <div class="fms-info-container">
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
              <span><span class="oi oi-check"></span> FMS connected</span>
            ` : html`
              <span><span class="oi oi-x"></span> FMS disconnected</span>
            `}
          </span>
          <span>
            ${this.isDsAttached() ? html`
              <span ><span class="oi oi-check"></span> DriverStation connected</span>
            ` : html`
              <span><span class="oi oi-x"></span> DriverStation disconnected</span>
            `}
          </span>
        </p>

        <p style="font-weight: normal">
          Robot state: ${this.getRobotState()}
        </p>
      </div>
    `;
  }
}

customElements.define('basic-fms-info', BasicFmsInfo);
