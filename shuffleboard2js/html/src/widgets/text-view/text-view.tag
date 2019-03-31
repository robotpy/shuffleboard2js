


<text-view>
    <div class="text-container">
        <input
            type={type}
            onchange={onChange}
            value={value}
            ref="input" />
    </div>

    <style>
        .text-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        input {
            border: none;
            outline: none;
            border-bottom: 2px solid lightgray;
            padding-bottom: 5px;
            width: calc(100% - 30px);
            background: none;
        }

        input:focus {
            border-bottom: 2px solid lightblue;
        }
    </style>
    <script>

        this.type = 'text';
        this.value = '';
        this.lastTableValue = '';

        this.on('update', () => {
            
            // Set type
            this.type = (typeof this.opts.table === 'number') ? 'number' : 'text';
            
            // set value if it changes in table
            if (this.lastTableValue !== this.opts.table) {
                if (typeof this.opts.table === 'object') {
                    this.value = '';
                }
                else {
                    this.value = this.opts.table.toString();
                }
            }

            this.lastTableValue = this.opts.table;
        });


        this.onChange = (ev) => {
            const tableValueType = typeof this.opts.table;
            const value = ev.target.value;

            if (tableValueType === 'string') {
                NetworkTables.putValue(this.opts.ntRoot, value);
            }
            else if (tableValueType === 'number') {
                NetworkTables.putValue(this.opts.ntRoot, parseFloat(value));
            }
            else if (tableValueType === 'boolean') {
                if (value === 'true') {
                    NetworkTables.putValue(this.opts.ntRoot, true);
                }
                else if (value === 'false') {
                    NetworkTables.putValue(this.opts.ntRoot, false);
                }
            }
        };

    </script>
</text-view>