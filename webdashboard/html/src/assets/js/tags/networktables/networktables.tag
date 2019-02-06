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

    this.getWidgets = (x, y) => {
      let widgetsElement = document.getElementsByTagName('widgets')[0]; 
      let widgets = widgetsElement._tag;
      return widgets.getWidgets(x, y);
    };

    this.on('mount', () => {
      $(this.root).on('dragstart', '.table-row:not(.header)', (ev) => {
        let $dragImage = $(`
          <span class="oi oi-file drag-image" style="display: inline-block; font-size: 50px;"></span>
        `).appendTo('body .drag-image-container');
        
        ev.originalEvent.dataTransfer.setDragImage($dragImage[0], 0, 0);
      });

      $(this.root).on('drag', '.table-row:not(.header)', (ev) => {
       
      });

      $(this.root).on('dragend', '.table-row:not(.header)', (ev) => {
        const $ntKey = $(ev.target).closest('[data-nt-key], [nt-key]');
        const isSubtable = $ntKey[0].tagName === 'SUBTABLE';
        const ntKey = $ntKey.attr('data-nt-key') || $ntKey.attr('nt-key');


        let widgets = this.getWidgets(ev.clientX, ev.clientY);
        widgets.forEach(widget => {
          widget.setNtRoot(ntKey);
        });

        $('.drag-image').remove();
      });
    });



    const mapStateToOpts = (state) => {
      const values = state.networktables.values;
      return {
        values
      };
    };

    this.reduxConnect(mapStateToOpts, null);


  </script>


</networktables>