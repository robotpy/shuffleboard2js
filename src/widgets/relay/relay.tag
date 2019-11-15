


<relay>
    
    <div class="btn-group-vertical" ref="buttons">
        <button ref="offBtn" type="button" class="btn btn-secondary" onclick={onClickOff}>Off</button>
        <button ref="onBtn" type="button" class="btn btn-light" onclick={onClickOn}>On</button>
        <button ref="forwardBtn" type="button" class="btn btn-light" onclick={onClickForward}>Forward</button>
        <button ref="reverseBtn" type="button" class="btn btn-light" onclick={onClickReverse}>Reverse</button>
    </div>

    <style>

        .btn-group-vertical {
            height: 100%;
            width: 100%;
        }

    </style>
    <script>

        this.on('update', () => {
            if ('Value' in this.opts.table) {
                const target = this.getButton(this.opts.table.Value);
                this.selectBtn(target);
            }
        });

        this.onClickOff = (ev) => {
            this.setBtnValue(ev, 'Off');
        };

        this.onClickOn = (ev) => {
            this.setBtnValue(ev, 'On');
        };

        this.onClickForward = (ev) => {
            this.setBtnValue(ev, 'Forward');
        };

        this.onClickReverse = (ev) => {
            this.setBtnValue(ev, 'Reverse');
        };

        this.setBtnValue = (ev, value) => {
            if ('Value' in this.opts.table) {
                NetworkTables.putValue(this.opts.ntRoot + 'Value', value);
            }
            else {
                this.selectBtn(ev.target);
            }
        };

        this.selectBtn = (target) => {
            $(this.refs.buttons).find('.btn')
                .removeClass('btn-secondary')
                .addClass('btn-light');

            $(target)
                .removeClass('btn-light')
                .addClass('btn-secondary');
       };

       this.getButton = (value) => {
           return this.refs[value.toLowerCase() + 'Btn'];
       };

    </script>
</relay>