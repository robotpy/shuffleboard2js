import './subtable.tag';
import './networktables.scss';
import fileImage from 'open-iconic/png/file-8x.png';

<networktables>  
  <div class="table">
    <div class="table-row header">
      <span class="row-item key">Key</span>
      <span class="row-item value">Value</span>
    </div>
    <subtable nt-key="/" key-label="root" values={opts.values} />
  </table>


  <script>

    let dragImg = document.createElement("img");
    dragImg.src = fileImage;

    this.getWidgets = (x, y) => {
      let widgetsElement = document.getElementsByTagName('widgets')[0]; 
      let widgets = widgetsElement._tag;
      return widgets.getWidgets(x, y);
    };

    this.on('mount', () => {
      $(this.root).on('dragstart', '.table-row:not(.header)', (ev) => {
        ev.originalEvent.dataTransfer.setData("text/plain", ev.target.id);
        ev.originalEvent.dataTransfer.setDragImage(dragImg, 0, 0);
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