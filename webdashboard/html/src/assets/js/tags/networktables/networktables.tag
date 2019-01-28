import './subtable.tag';
import './networktables.scss';

<networktables>  
  <div class="table">
    <div class="table-row header">
      <span class="row-item key">Key</span>
      <span class="row-item value">Value</span>
    </div>
    <subtable nt-key="/" key-label="root" values={opts.values} />
  </table>


  <script>

    const mapStateToOpts = (state) => {
      const values = state.networktables.values;
      return {
        values
      };
    };

    this.reduxConnect(mapStateToOpts, null);


  </script>


</networktables>