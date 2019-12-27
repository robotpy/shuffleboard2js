


<boolean-box>
    <div ref="background" class="background"></div>

    <script>

        this.on('mount', () => {
            $(this.root).prepend(`
                <style>
                    .background {
                        width: 100%;
                        height: 100%;
                    }
                </style>
            `)
        });

        this.on('update', () => {

            let background = 'black';

            if (this.opts.table === true) {
                background = this.opts.properties.colorWhenTrue;
            }
            else if (this.opts.table === false) {
                background = this.opts.properties.colorWhenFalse;
            }

            $(this.refs.background).css('background', background);
        });

    </script>
</boolean-box>