import axios from 'axios';
import pathModule from 'path';

<user-widgets>

  <script>
    async function getWidgets() {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/widgets";
        const response = await axios.get(url);
        return response.data.widgets;
      }
      catch(e) {
        console.log('error', e);
        return [];
      }
    }

    async function includeHtml(path, widget) {

      let result = await axios.get(path);
      let html = result.data;
      let $html = $(`
        <div>${html}</div>
      `);
      
      $html.find('[type="riot/tag"]').each(function() {
        let tag = $(this).html();
        let url = $(this).attr('src');
        
        if (!url.startsWith('http')) {
          let l = window.location;
          let port = process.env.socket_port || l.port;
          url = "http://" + pathModule.join(l.hostname + ":" + port, 'widgets', widget, url);
        }
        
        riot.compile(url ? url : tag, () => {
          $(html).appendTo('body');
        });

      });
    }


    getWidgets()
      .then(function(widgets) {
        widgets.forEach(function(widget) {
          let l = window.location;
          let port = process.env.socket_port || l.port;
          let path = `/widgets/${widget}/index.html`;
          let url = "http://" + l.hostname + ":" + port + path;
          includeHtml(url, widget);
        });
      });

  </script>

</user-widgets>