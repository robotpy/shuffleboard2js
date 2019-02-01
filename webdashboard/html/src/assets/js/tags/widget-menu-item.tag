

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
      let widgetsElement = document.getElementsByTagName('widgets')[0]; 
      let widgets = widgetsElement._tag;
      widgets.addWidget(x, y, config);
    }

    this.onDragStart = (ev) => {

      let $dragImage = $(`
        <span class="oi oi-file" style="display: inline-block; font-size: 50px;"></span>
      `).appendTo('body');
      
      ev.dataTransfer.setDragImage($dragImage[0], 0, 0);

      console.log('client:', ev.clientX, ev.clientY);
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