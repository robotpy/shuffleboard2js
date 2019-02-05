


<pid-tuner>
   
    <form>
        <div class="form-group row">
            <label for="inputP" class="col-sm-2 col-form-label">p</label>
            <div class="col-sm-10">
            <input type="number" onchange={onPChange} class="form-control" value="{opts.table.p}" id="inputP" placeholder="Imput Value">
            </div>
        </div>

        <div class="form-group row">
            <label for="inputI" class="col-sm-2 col-form-label">I</label>
            <div class="col-sm-10">
            <input type="number" onchange={onIChange} class="form-control" value="{opts.table.i}" id="inputI" placeholder="Imput Value">
            </div>
        </div>

        <div class="form-group row">
            <label for="inputD" class="col-sm-2 col-form-label">D</label>
            <div class="col-sm-10">
            <input type="number" onchange={onDChange} class="form-control" value="{opts.table.d}" id="inputD" placeholder="Imput Value">
            </div>
        </div>

        <div class="form-group row">
            <label for="inputF" class="col-sm-2 col-form-label">F</label>
            <div class="col-sm-10">
            <input type="number" onchange={onFChange} class="form-control" value="{opts.table.f}" id="inputF" placeholder="Imput Value">
            </div>
        </div>
        
        <div class="form-group">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                <label class="form-check-label" for="defaultCheck1">
                    Default checkbox
                </label>
            </div>
        </div>

    </form>

    
    <style>
        li {
            margin-bottom: 47px;
        }
    </style>

    <script>
        this.onPChange = (ev) => {
            NetworkTables.putValue(this.opts.ntRoot + 'p', parseFloat(ev.target.value));
        };

         this.onIChange = (ev) => {
            NetworkTables.putValue(this.opts.ntRoot + 'i', parseFloat(ev.target.value));
        };

         this.onDChange = (ev) => {
            NetworkTables.putValue(this.opts.ntRoot + 'd', parseFloat(ev.target.value));
        };

         this.onFChange = (ev) => {
            NetworkTables.putValue(this.opts.ntRoot + 'f', parseFloat(ev.target.value));
        };

    </script>
</pid-tuner>