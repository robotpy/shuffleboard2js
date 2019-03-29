


<combobox-chooser>
    <div class="chooser-container">
        <form>
            <div class="form-group">
                <select class="form-control" ref="chooser" onchange={onChange}>
                    <option value={option} each={option in options} selected={selected === option}>
                        {option}
                    </option>
                </select>
            </div>
        </form>
    </div>

    <style>

        .chooser-container {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            height: 100%;
        }

        .form-group {
            margin-bottom: 0;
        }

        form {
            margin-bottom: 0;
            max-width: 90%;
            min-width: 100px;
        }

    </style>

    <script>

        this.options = [];
        this.selected = '';

        this.on('mount', () => {
            this.options = this.opts.table.options || [];
            this.selected = this.opts.table.selected || '';
        });

        this.on('update', () => {
            this.options = this.opts.table.options || [];
            this.selected = this.opts.table.selected || '';
            console.log('selected:', this.selected);
        });

        this.onChange = (ev) => {
            const value = ev.target.value;
            NetworkTables.putValue(this.opts.ntRoot + 'selected', value);
        };

    </script>
</combobox-chooser>