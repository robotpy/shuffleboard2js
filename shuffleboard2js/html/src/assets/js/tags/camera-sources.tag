
import { getSubtable } from 'assets/js/networktables';
import _ from 'lodash';
import fileImage from 'open-iconic/png/file-8x.png';

<camera-sources>

  <p data-nt-key="{camera.ntKey}" 
     class="camera-source"
     draggable="true"
     ondragstart={onDragStart}
     ondragend={onDragEnd}
     each={camera, name in opts.cameras}>
    {name}
  </p>

  <style>
    p {
      margin-bottom: 0;
      padding: 6px 0;
      padding-left: 12px;
      border-bottom: 1px solid #bbb;
    }

    p:hover {
      background: cornflowerblue;
      cursor: pointer;
    }
  </style>

  <script>

    let cameras = {};

    let dragImg = document.createElement("img");
    dragImg.src = fileImage;

    this.getWidgets = (x, y) => {
      let widgetTabsElement = document.getElementsByTagName('widget-tabs')[0]; 
      let widgetTabs = widgetTabsElement._tag;
      let widgets = widgetTabs.getActiveWidgetTab();
      return widgets.getWidgets(x, y);
    };

    this.onDragStart = (ev) => {
        ev.dataTransfer.setData("text/plain", ev.target.id);
        ev.dataTransfer.setDragImage(dragImg, 0, 0);
    };

    this.onDragEnd = (ev) => {
      const ntKey = $(ev.target).attr('data-nt-key');

      let widgets = this.getWidgets(ev.clientX, ev.clientY);
      widgets.forEach(widget => {
        widget.setNtRoot(ntKey);
      });
    };

    const mapStateToOpts = (state) => {
      const values = state.networktables.values;

      // Add cameras and modify existing ones
      let cameraKeys = Object.keys(values.CameraPublisher || {});
  
      cameraKeys
        .filter((key) => {
          let subtable = getSubtable(`/CameraPublisher/${key}/`);
          return _.isArray(subtable.streams);
        })
        .forEach((key) => {
          if (cameras[key] === undefined) {
            cameras[key] = {
              ntKey: `/CameraPublisher/${key}/`
            };
            this.update();
          }
        });

      // delete keys
      for (let key in cameras) {
        if (cameraKeys.indexOf(key) === -1) {
          delete cameras[key];
        }
      }

      return {
        cameras
      };
    };

    this.reduxConnect(mapStateToOpts, null);

  </script>

</camera-sources>