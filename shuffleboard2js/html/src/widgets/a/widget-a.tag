
<widget-a>
  <p>Widget A</p>
  <p>{JSON.stringify(opts.properties)}</p>


  <script>

    this.on('propertiesUpdate', () => {
      console.log('properties update:', this.opts.properties);
    });

    
  </script>
</widget-a>