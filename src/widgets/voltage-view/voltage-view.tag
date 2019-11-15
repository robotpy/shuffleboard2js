import _ from 'lodash';


<voltage-view>

  <div class="voltage-container">
    <div class="voltage">
      <div ref="bar" class="bar">
        <div class="foreground" style={getForegroundStyle()}></div>
        <p class="text" if={opts.properties.showText}>
          {value} V
        </p>
      </div>
      <axis 
        ticks={opts.properties.numTickMarks} 
        vertical={false} 
        range={[opts.properties.min, opts.properties.max]}
        units="V" />
    </div>
  </div>

  <style>

    .voltage-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    .bar {
      position: relative;
      width: calc(100% - 60px);
      height: 20px;
      border-radius: 3px;
      margin: 0 30px;
      background: #DDD;
    }

    .foreground {
      position: absolute;
      top: 0;
      height: 20px;
      background: #ffbd2f;
      border-radius: 3px;
    }

    .text {
      font-size: 15px;
      line-height: 18px;
      position: relative;
      margin-bottom: 0;
    }

    axis {
      width: calc(100% - 60px);
      margin: 2px auto 0;
    }


  </style>


  <script>
    this.value = 0;

    this.getForegroundStyle = () => {
      const min = this.opts.properties.min;
      const max = this.opts.properties.max;
      const center = this.opts.properties.center;
      const val = Math.clamp(this.value, min, max);

      if (max < center) {
        return {
          width: Math.abs(val - max) / (max - min) * 100 + '%',
          left: 'auto',
          right: 0
        };
      }
      else if (min > center) {
        return {
          width: Math.abs(val - min) / (max - min) * 100 + '%',
          left: 0,
          right: 'auto'
        };
      }
      else if (val > center) {
        return {
          width: Math.abs(val - center) / (max - min) * 100 + '%',
          left: Math.abs(min - center) / (max - min) * 100 + '%',
          right: 'auto'
        };
      }
      else {
        return {
          width: Math.abs(val - center) / (max - min) * 100 + '%',
          left: 'auto',
          right: Math.abs(max - center) / (max - min) * 100 + '%'
        }
      }
    };

    this.on('update', () => {
      const defaultValue = Math.clamp(this.opts.properties.center, this.opts.properties.min, this.opts.properties.max);
      this.value = _.isNumber(this.opts.table) ? this.opts.table : defaultValue;
    });
  </script>

    
</voltage-view>