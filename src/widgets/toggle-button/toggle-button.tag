
import _ from 'lodash';

<toggle-button>

    <div class="button-container">
        <button type="button" class="btn btn-{value ? 'primary' : 'light'}" onclick={onClick}>
            {name}
        </button>
    </div>

    <style>

        .button-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        button {
            width: calc(100% - 30px);
            height: calc(100% - 30px);
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
        }

        button:focus {
            box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.75);
        }
       
    </style>
    <script>

        this.name = '';
        this.value = false;
        this.prevTableValue = false;

        this.on('update', () => {

            // Set value if it changes
            if (typeof this.opts.table === 'boolean' && this.opts.table !== this.prevTableValue) {
                this.value = this.opts.table;
            }

            this.prevTableValue = this.opts.table;

            // Set name of widget
            if (this.opts.ntRoot) {
                this.name = _.last(this.opts.ntRoot.split('/')) || '';
            }
        });

        this.onClick = (ev) => {
            if (typeof this.opts.table === 'boolean') {
                NetworkTables.putValue(this.opts.ntRoot, !this.value);
            }
            else {
                this.value = !this.value;
            }
        };
        
    </script>
</toggle-button>