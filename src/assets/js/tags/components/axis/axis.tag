import _ from 'lodash';

<axis>

  <svg ref="svg"></svg>

  <style>

    svg {
      overflow: visible;
    }

    axis {
      display: block;
    }

    line {
      stroke: rgb(150, 150, 150);
      stroke-width: 2;
    }

    text {
      font-weight: normal;
      font-size: 13px;
    }
  </style>

  <script>

    this.prevSize = 0;
    this.prevTicks = 0;
    this.prevMin = null;
    this.prevMax = null;

    this.setAxis = () => {
      let size = this.opts.vertical ? $(this.root).height() : $(this.root).width();
      let tickSpacing = size / (this.opts.ticks - 1);
      const width = this.opts.range ? 30 : 10;
      const showNums = this.opts.range && this.opts.range.length === 2;
      const min = showNums ? this.opts.range[0] : 0;
      const max = showNums ? this.opts.range[1] : 0;

      let lastTickWithText = -Infinity;
      let textEnd = -Infinity;

      // Prevent update if nothing has changed
      if (this.prevSize === size && this.prevTicks === this.opts.ticks && this.prevMin === min && this.prevMax === max) {
        return;
      }
      else {
        this.prevSize = size;
        this.prevTicks = this.opts.ticks;
        this.prevMin = min;
        this.prevMax = max;
      }

      $(this.refs.svg).html('');

      let svg = d3.select(this.refs.svg)
        .attr("width", !this.opts.vertical ? size : width)
        .attr("height", !this.opts.vertical ? width : size);

      for (let i = 0; i < this.opts.ticks; i++) {

        if (!this.opts.vertical) {
          svg.append('line')
            .attr('x1', i * tickSpacing)
            .attr('y1', 0)
            .attr('x2', i * tickSpacing)
            .attr('y2', 8);
        }
        else {
          svg.append('line')
            .attr('x1', 0)
            .attr('y1', i * tickSpacing)
            .attr('x2', 8)
            .attr('y2', i * tickSpacing);
        }

        if (showNums) {
            
            if (!this.opts.vertical) {
              // check to see if text will fit
              let spaceBetweenTicks = (i - lastTickWithText) * tickSpacing;
              let pointWhereNewTextCanBegin = (lastTickWithText * tickSpacing) + spaceBetweenTicks * .4;
              let textWillFit = textEnd < 0 || pointWhereNewTextCanBegin > textEnd;

              if (textWillFit) {
                const value = min + i * (max - min) / Math.max(this.opts.ticks - 1, 1);
                
                let textEl = svg.append('text')
                  .attr('x', i * tickSpacing)
                  .attr('y', 25)
                  .attr('text-anchor', 'middle')
                  .text(value.toFixed(2) + (this.opts.units ? ` ${this.opts.units}` : ''));

                textEnd = i * tickSpacing + textEl.node().getBBox().width / 2;
                lastTickWithText = i;
              }
            }
            else {
              const value = min + i * (max - min) / Math.max(this.opts.ticks - 1, 1);
                
              let textEl = svg.append('text')
                .attr('x', -3)
                .attr('y', i * tickSpacing + 4)
                .attr('text-anchor', 'end')
                .text(value.toFixed(2) + (this.opts.units ? ` ${this.opts.units}` : ''));
            }
          }


        // don't do this for last tick
        if (i < this.opts.ticks - 1) {
          for (let j = 1; j < 4; j++) {
            if (!this.opts.vertical) {
              svg.append('line')
                .attr('x1', i * tickSpacing + j * tickSpacing / 4)
                .attr('y1', 0)
                .attr('x2', i * tickSpacing + j * tickSpacing / 4)
                .attr('y2', 4);
            }
            else {
              svg.append('line')
                .attr('x1', 4)
                .attr('y1', i * tickSpacing + j * tickSpacing / 4)
                .attr('x2', 8)
                .attr('y2', i * tickSpacing + j * tickSpacing / 4);
            }
          }
        }
      }
    };

    this.on('mount', () => {
      this.setAxis();      
    });

    this.on('update', () => {
      this.setAxis();
    });
  </script>

</axis>