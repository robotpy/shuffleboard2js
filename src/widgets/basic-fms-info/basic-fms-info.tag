
<basic-fms-info>

  <div class="fms-info-container">
    <p>
      <strong>
        <span>{getEventName()}</span>
        <span>{getMatchType()}</span>
        <span>match {getMatchNumber()}</span>
      </strong>
    </p>
    
    <p style="margin-bottom: 7px; font-weight: normal">
      <span style="margin-right: 5px;">
        <span if={isFmsAttached()}><span class="oi oi-check"></span> FMS connected</span>
        <span if={!isFmsAttached()}><span class="oi oi-x"></span> FMS disconnected</span>
      </span>

      <span>
        <span if={isDsAttached()}><span class="oi oi-check"></span> DriverStation connected</span>
        <span if={!isDsAttached()}><span class="oi oi-x"></span> DriverStation disconnected</span>
      </span>
    </p>

    <p style="font-weight: normal">
      Robot state: {getRobotState()}
    </p>
  </div>

  <style>

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
  </style>


  <script>

    const ENABLED_FLAG = 0x01;
    const AUTO_FLAG = 0x02;
    const TEST_FLAG = 0x04;
    const EMERGENCY_STOP_FLAG = 0x08;
    const FMS_ATTACHED_FLAG = 0x10;
    const DS_ATTACHED_FLAG = 0x20;

    const MATCH_TYPES = ['Unknown', 'Practice', 'Qualification', 'Elimination'];

    this.getRobotState = () => {
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

    this.getMatchType = () => {
      if ('MatchType' in this.opts.table) {
        return MATCH_TYPES[this.opts.table.MatchType];
      }
      else {
        return 'Unknown';
      }
    };

    this.getMatchNumber = () => {
      if ('MatchNumber' in this.opts.table) {
        return this.opts.table.MatchNumber;
      }
      else {
        return 0;
      }
    };

    this.getEventName = () => {
      if ('EventName' in this.opts.table) {
        return this.opts.table.EventName;
      }
      else {
        return '';
      }
    };

    this.isEnabled = () => {
      return !!(this.opts.table.FMSControlData & ENABLED_FLAG);
    };

    this.isAuto = () => {
      return !!(this.opts.table.FMSControlData & AUTO_FLAG);
    };

    this.isTest = () => {
      return !!(this.opts.table.FMSControlData & TEST_FLAG);
    };

    this.isEmergencyStopped = () => {
      return !!(this.opts.table.FMSControlData & EMERGENCY_STOP_FLAG);
    };

    this.isFmsAttached = () => {
      return !!(this.opts.table.FMSControlData & FMS_ATTACHED_FLAG);
    };

    this.isDsAttached = () => {
      return !!(this.opts.table.FMSControlData & DS_ATTACHED_FLAG);
    };


  </script>

    
</basic-fms-info>