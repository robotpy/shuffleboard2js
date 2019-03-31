
import Gauge from 'svg-gauge';

<gauge>
    <div class="gauge-container-container">
        <div ref="gauge" class="gauge-container {opts.properties.style}"></div>
    </div>

    <style>

        .gauge-container-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .gauge-container {
            display: block;
            padding: 10px;
        }
        .gauge-container > .gauge > .dial {
            stroke: #ddd;
            stroke-width: 3;
            fill: rgba(0,0,0,0);
        }
        .gauge-container > .gauge > .value {
            stroke: rgb(47, 180, 200);
            stroke-width: 3;
            fill: rgba(0,0,0,0);
        }
        .gauge-container > .gauge > .value-text {
            fill: black;
            font-family: sans-serif;
            font-size: 1em;
        }

    </style>
    <script>

        this.gauge = null;

        this.on('mount', () => {
            this.initialize();
        });

        this.setSize = () => {
            const rect = this.root.getBoundingClientRect();
            const svgWidth = rect.width;
            const svgHeight = rect.height;

            const size = Math.min(svgWidth, svgHeight);
            $(this.refs.gauge).css('width', size + 'px');
        };

        this.initialize = () => {
            $(this.refs.gauge).html('');

            this.gauge = Gauge(this.refs.gauge, {
                min: this.opts.properties.min,
                max: this.opts.properties.max,
                value: 0
            });


            this.setSize();
        };

        this.on('propertiesUpdate', () => {
            this.initialize();
        });

        this.on('resize', () => {
            this.setSize();
        });

        this.on('update', () => {
            if (this.gauge && typeof this.opts.table === 'number') {
                this.gauge.setValue(this.opts.table);
            }
        });

    </script>
</gauge>