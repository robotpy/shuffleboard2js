


<number-slider-props>
  <form>
  
    <div class="form-group row">
      <label for="min" class="col-sm-4 col-form-label text-right">Min</label>
      <div class="col-sm-8">
        <input 
          type="number" 
          class="form-control" 
          id="min" 
          value={opts.properties.min}
          onchange={onMinChange}>
      </div>
    </div>

    <div class="form-group row">
      <label for="max" class="col-sm-4 col-form-label text-right">Max</label>
      <div class="col-sm-8">
        <input 
          type="number" 
          class="form-control" 
          id="max" 
          value={opts.properties.max}
          onchange={onMaxChange}>
      </div>
    </div>

    <div class="form-group row">
      <label for="blockIncrement" class="col-sm-4 col-form-label text-right">Block incrememnt</label>
      <div class="col-sm-8">
        <input 
          type="number" 
          class="form-control" 
          id="blockIncrement" 
          value={opts.properties.blockIncrement}
          onchange={onBlockIncrementChange} />
      </div>
    </div>

  </form>

  <script>

    this.onMinChange = (ev) => {
      const min = parseFloat(ev.target.value);
      this.opts.properties.min = min;

      if (min > this.opts.properties.max) {
        this.opts.properties.max = min;
      }
    };

    this.onMaxChange = (ev) => {
      const max = parseFloat(ev.target.value);
      this.opts.properties.max = max;

      if (max < this.opts.properties.min) {
        this.opts.properties.min = max;
      }
    };

    this.onBlockIncrementChange = (ev) => {
      const value = parseFloat(ev.target.value);
      this.opts.properties.blockIncrement = value;
    };
    
  </script>
  
    
</number-slider-props>