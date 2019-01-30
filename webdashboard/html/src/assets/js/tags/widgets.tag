
<widgets>


  <style>
    widgets {
      position: relative;
      width: 100vw;
      height: 100%;
      display: block;
    }

  </style>

  <script>
    this.on('mount', () => {
      $(this.root).width(screen.width - 20);
    });

  </script>


</widgets>