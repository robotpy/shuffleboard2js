


<number-slider>
    <div class="slider-container">
        <input 
            ref="slider"
            type="range" 
            min={opts.properties.min} 
            max={opts.properties.max}
            value={value} 
            step={opts.properties.blockIncrement} 
            onchange={onChange} 
            onmousedown={onDragStart}
            onmouseup={onDragEnd} />

        <axis 
            ticks="5" 
            vertical={false} 
            range={[opts.properties.min, opts.properties.max]} />
    </div>

    <style>

        .slider-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        input {
            width: 85%;
            max-width: calc(100% - 60px);
        }

        axis {
            width: calc(85% - 14px);
            max-width: calc(100% - 74px);
        }

        axis {
            
        }

    </style>
    <script>

        this.value = 0;
        this.lastTableValue = null;
        this.differentValueCount = 0;

        this.isDragging = false;

        this.on('update', () => {
            if (this.lastTableValue !== this.opts.table) {
                this.value = this.opts.table || this.value;
                $(this.refs.slider).val(this.value);
            }
            this.lastTableValue = this.opts.table;

            // If user is not interacting with the slider but the slider value is consistently
            // different from the table value, change it
            if (typeof this.opts.table === 'number' && this.opts.table !== $(this.refs.slider).val()) {
                this.differentValueCount++;
            }

            if (this.isDragging) {
                this.differentValueCount = 0;
            }

            if (this.differentValueCount > 20) {
                this.value = this.opts.table;
                $(this.refs.slider).val(this.value);
                this.differentValueCount = 0;
            }
        });

        this.onChange = (ev) => {
            this.value = parseFloat(ev.target.value);
            if (this.opts.ntRoot) {
                lastTableValue = this.value;
                NetworkTables.putValue(this.opts.ntRoot, this.value);
            }
        };

        this.onDragStart = (ev) => {
            this.isDragging = true;
        };

        this.onDragEnd = (ev) => {
            this.isDragging = false;
        };

        this.on('mount', () => {
            $(this.root).prepend(`
                <style>
                    .slider-container {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }

                    input {
                        width: 85%;
                        max-width: calc(100% - 60px);
                    }

                    axis {
                        width: calc(85% - 14px);
                        max-width: calc(100% - 74px);
                    }

                    axis {
                        
                    }

                </style>
            `);
        });

    </script>
</number-slider>