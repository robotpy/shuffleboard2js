

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

    let offset = {
      x: 0,
      y: 0
    };

    this.addWidget = (x, y, config) => {
      let widgetsElement = document.getElementsByTagName('widgets')[0]; 
      let widgets = widgetsElement._tag;
      widgets.addWidget(x, y, config);
    }

    this.onDragStart = (ev) => {
      let element = ev.target;
      var rect = element.getBoundingClientRect();
      let imageTop = rect.top;
      let imageLeft = rect.left;
      let clickX = ev.clientX;
      let clickY = ev.clientY;
      offset.x = (clickX - imageLeft) / element.offsetWidth * (55 * this.opts.minx);
      offset.y = (clickY - imageTop) / element.offsetHeight * (55 * this.opts.miny);
    };

    this.onDragEnd = (ev) => {
      this.addWidget(ev.clientX - offset.x, ev.clientY - offset.y, {
        type: this.opts.type,
        minX: this.opts.minx,
        minY: this.opts.miny
      });
    };


  </script>

</widget-menu-item>