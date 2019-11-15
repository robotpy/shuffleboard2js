import fileImage from 'open-iconic/png/file-8x.png';

<widget-menu-item>

    <div ondragstart={onDragStart} ondragend={onDragEnd} draggable="true">
      <img src="{opts.image || 'unknown'}" draggable="false" />
    </div>
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

    let dragImg = document.createElement("img");
    dragImg.src = fileImage;

    this.addWidget = (x, y, config) => {
      let widgetTabsElement = document.getElementsByTagName('widget-tabs')[0]; 
      let widgetTabs = widgetTabsElement._tag;
      let widgets = widgetTabs.getActiveWidgetTab();
      widgets.addWidget(x, y, config);
    }

    this.onDragStart = (ev) => {
      ev.dataTransfer.setData("text/plain", ev.target.id);
      ev.dataTransfer.setDragImage(dragImg, 0, 0);
    };

    this.onDragEnd = (ev) => {
      this.addWidget(ev.clientX, ev.clientY, {
        type: this.opts.type,
        minX: this.opts.minx,
        minY: this.opts.miny
      });
    };


  </script>

</widget-menu-item>