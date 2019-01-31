import * as _ from 'lodash';


<subtable>
  <div class="wrapper {expanded ? 'expanded' : 'collapsed'}">
    <div class="table-row subtable-header" draggable="true">
      <span class="row-item key">
        <span class="level-space" each={value in _.range(level)}></span>
          <span class="caret" onclick={toggleExpand}>
            <span class="oi oi-caret-right"></span>
            <span class="oi oi-caret-bottom"></span>
          </span>
          {opts.keyLabel}
        </span>
      <span class="row-item value"></span>
    </div>
    <virtual each={value, key in opts.values}>
      <virtual if={_.isPlainObject(value)}>
        <subtable 
          level={level + 1} 
          nt-key={opts.ntKey + key + '/'}
          key-label={key} 
          values={value} />
      </virtual>

      <virtual if={_.isArray(value)}>
        <div class="table-row" data-nt-key={opts.ntKey + key.replace('/', '')} draggable="true">
          <span class="row-item key">
            <span class="level-space" each={value in _.range(level + 1)}></span>
            {key.replace('/', '')}
          </span>
          <span class="row-item value array">
            [{value.join(', ')}]
          </span>
        </div>

      </virtual>

      <virtual if={typeof value !== 'object'}>
        <div class="table-row" data-nt-key={opts.ntKey + key.replace('/', '')} draggable="true">
          <span class="row-item key">
            <span class="level-space" each={value in _.range(level + 1)}></span>
            {key.replace('/', '')}
          </span>
          <span class="row-item value">
            
            <virtual if={typeof value === 'boolean'}>
              <div class="form-check">
                <input class="form-check-input" disabled={true} type="checkbox" checked={value} value={opts.ntKey + key.replace('/', '')} id={opts.ntKey + key.replace('/', '')}>
                <label class="form-check-label" for={opts.ntKey + key.replace('/', '')}>
                  {value.toString()}
                </label>
              </div>
            </virtual>

            <virtual if={typeof value === 'string'}>
              {value}
            </virtual>

            <virtual if={typeof value === 'number'}>
              {value}
            </virtual>

          </span>
        </div>
      </virtual>
    </virtual>
  </div>

  <script>
    this.level = this.opts.level || 0;
    this.expanded = false;

    this.toggleExpand = (ev) => {
      let $el = $(ev.target);
      $el.closest('.wrapper')
        .toggleClass('expanded')
        .toggleClass('collapsed');
    };

  </script>

</subtable>