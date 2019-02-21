


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

                let img = new Image();

                // remove mjpg:
                img.src = stream.replace('mjpg:', ''); 
                img.onload = () => {
                    this.url = img.src;
                    img.onload = () => {}
                }
 
            }
            else {
                this.url = '';
            }      
        });
        
        
    </script>
</camera>