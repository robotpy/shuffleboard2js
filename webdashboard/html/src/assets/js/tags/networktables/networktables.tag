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
        console.log('ev:', ev);
        //let $dragImage = $('<img src="https://static.thenounproject.com/png/47347-200.png"/>');

        //let $dragElement = $('<span class="oi" data-glyph="file"></span>');
        let $dragImage = $(`
          <div style="width: 100px; height: 100px; background: green;"></div>
        `)
        ev.originalEvent.dataTransfer.setData('text/plain', 'Data to Drag');
        ev.originalEvent.dataTransfer.setDragImage($dragImage[0], 0, 0);
      });

      $(this.root).on('dragend', '.table-row:not(.header)', (ev) => {
        const $ntKey = $(ev.target).closest('[data-nt-key], [nt-key]');
        const isSubtable = $ntKey[0].tagName === 'SUBTABLE';
        const ntKey = $ntKey.attr('data-nt-key') || $ntKey.attr('nt-key');


        let widgets = this.getWidgets(ev.clientX, ev.clientY);
        widgets.forEach(widget => {
          widget.setNtRoot(ntKey);
        });
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