


<number-bar-props>
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
      <label for="center" class="col-sm-4 col-form-label text-right">Center</label>
      <div class="col-sm-8">
        <input 
          type="number" 
          class="form-control" 
          id="center" 
          value={opts.properties.center}
          onchange={onCenterChange}>
      </div>
    </div>

    <div class="form-group row">
      <label for="numTickMarks" class="col-sm-4 col-form-label text-right">Num tick marks</label>
      <div class="col-sm-8">
        <input type="number" 
               class="form-control" 
               id="numTickMarks" 
               value={opts.properties.numTickMarks}
               onchange={onNumTickMarksChange}>
      </div>
    </div>

    <div class="form-group row">
      <label for="showText" class="col-sm-4 col-form-label text-right">Show text</label>
      <div class="col-sm-1">
        <div class="form-check">
          <input class="form-check-input position-static" 
                 type="checkbox" 
                 id="showText" 
                 checked={opts.properties.showText}
                 onchange={onShowTextChange}>
        </div>
      </div>
    </div>

  </form>



  <style>
    .form-check {
      padding-top: 6px;
    }

  </style>


  <script>

    this.onShowTextChange = (ev) => {
      this.opts.properties.showText = ev.target.checked;
    };

    this.onNumTickMarksChange = (ev) => {
      const value = ev.target.value;

      if (value >= 0) {
        this.opts.properties.numTickMarks = value;
      }
    };

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

    this.onCenterChange = (ev) => {
      const center = parseFloat(ev.target.value);
      this.opts.properties.center = center;
    };

  </script>
  
    
</number-bar-props>