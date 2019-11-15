


<boolean-box-props>
  <form>
  
    <div class="form-group row">
      <label for="colorWhenTrue" class="col-sm-4 col-form-label text-right">Color when true</label>
      <div class="col-sm-8">
        <input 
          type="color" 
          class="form-control" 
          id="colorWhenTrue" 
          value={opts.properties.colorWhenTrue}
          onchange={onColorWhenTrueChange}>
      </div>
    </div>

    <div class="form-group row">
      <label for="colorWhenFalse" class="col-sm-4 col-form-label text-right">Color when false</label>
      <div class="col-sm-8">
        <input 
          type="color" 
          class="form-control" 
          id="colorWhenFalse" 
          value={opts.properties.colorWhenFalse}
          onchange={onColorWhenFalseChange}>
      </div>
    </div>

  </form>

  <script>

    this.onColorWhenTrueChange = (ev) => {
      const color = ev.target.value;
      this.opts.properties.colorWhenTrue = color;
    };

    this.onColorWhenFalseChange = (ev) => {
      const color = ev.target.value;
      this.opts.properties.colorWhenFalse = color;
    };
    
  </script>
  
    
</boolean-box-props>