import _ from 'lodash';

<axis>

  <svg ref="svg"></svg>

  <style>

    axis {
      display: block;
    }

    line {
      stroke: rgb(150, 150, 150);
      stroke-width: 2;
    }
  </style>

  <script>

    this.prevSize = 0;
    this.prevTicks = 0;

    this.setAxis = () => {
      let size = $(this.root).width();
      let tickSpacing = size / (this.opts.ticks - 1);

      // Prevent update if nothing has changed
      if (this.prevSize === size && this.prevTicks === this.opts.ticks) {
        return;
      }
      else {
        this.prevSize = size;
        this.prevTicks = this.opts.ticks;
      }

      $(this.refs.svg).html('');

      let svg = d3.select(this.refs.svg)
        .attr("width", !this.opts.vertical ? size : 10)
        .attr("height", !this.opts.vertical ? 10 : size);

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
    };

    this.on('mount', () => {
      this.setAxis();      
    });

    this.on('update', () => {
      this.setAxis();
    });
  </script>

</axis>