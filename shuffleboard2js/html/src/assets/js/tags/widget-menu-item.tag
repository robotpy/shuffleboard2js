

<widget-menu-item>

    <img src="{opts.image || 'unknown'}" ondragstart={onDragStart} ondragend={onDragEnd} />
    <h5>{opts.label}</h5>

  <style>
    widget-menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      margin: 10px 5px;
    }

    h5 {
      margin-bottom: 0;
      margin-top: 10px;
    }

    img {
      display: block;
      width: 100%;
      max-width: 250px;
      max-height: 250px;
    }

  </style>


  <script>

    this.addWidget = (x, y, config) => {
      let widgetTabsElement = document.getElementsByTagName('widget-tabs')[0]; 
      let widgetTabs = widgetTabsElement._tag;
      let widgets = widgetTabs.getActiveWidgetTab();
      widgets.addWidget(x, y, config);
    }

    this.onDragStart = (ev) => {

      let $dragImage = $(`
        <span class="oi oi-file drag-image" style="display: inline-block; font-size: 50px;"></span>
      `).appendTo('body .drag-image-container');
      
      ev.dataTransfer.setDragImage($dragImage[0], 0, 0);
    };

    this.onDragEnd = (ev) => {
      this.addWidget(ev.clientX, ev.clientY, {
        type: this.opts.type,
        minX: this.opts.minx,
        minY: this.opts.miny
      });

      $('.drag-image').remove();
    };


  </script>

</widget-menu-item>