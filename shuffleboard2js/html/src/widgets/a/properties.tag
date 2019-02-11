

<widget-a-properties>
  <input type="text" onchange={onChange} value={opts.properties.a} />


  <script>
    this.onChange = (ev) => {
      opts.properties.a = ev.target.value;
    };  
  </script>


</widget-a-properties>