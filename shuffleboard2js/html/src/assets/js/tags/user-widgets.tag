import axios from 'axios';
import pathModule from 'path';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';


<user-widgets>

  <script>
    function getWidgets() {
      try {
        const widgetFolder = dashboard.storage.getDefaultWidgetFolder();
        const widgets = readdirSync(widgetFolder, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        return widgets;
      }
      catch(e) {
        dashboard.toastr.error(`Failed to load widgets in folder: ${e.message}`);
        return [];
      }
    }

    async function includeHtml(path) {
      const widget = window.require(path);
    }

    const widgets = getWidgets();
    const widgetFolder = dashboard.storage.getDefaultWidgetFolder();
    widgets.forEach(function(widget) {
      let widgetPath = join(widgetFolder, widget, 'index.js');
    
      includeHtml(widgetPath);
    });

  </script>

</user-widgets>