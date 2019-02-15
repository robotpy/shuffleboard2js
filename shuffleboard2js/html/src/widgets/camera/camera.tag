


<camera>
    <img src={url} /> 

    <style>
        img {
            width: 100%;
        }

    </style>
    <script>

        this.url = '';

        this.on('update', () => {
            
            let streams = this.opts.table.streams;

            if (this.opts.table.connected && streams.length > 0) {

                // get first element from streams
                let stream = streams[0];

                // remove mjpg:
                this.url = stream.replace('mjpg:', '');    
            }
            else {
                this.url = '';
            }      
        });
        
        
    </script>
</camera>