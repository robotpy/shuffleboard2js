import './widgets.tag';
import _ from 'lodash';
import axios from 'axios';
import { readFileSync } from 'fs';
const dialog = require('electron').remote.dialog;
import '@vaadin/vaadin-tabs';

<widget-tabs>

  <vaadin-tabs onselected-changed={onselected}>
    <vaadin-tab each={tab in widgetTabs}>
      {tab.header}
    </vaadin-tab>
  </vaadin-tabs>

  <div class="tab-body">
    <virtual if={index === selectedTab} each={tab, index in widgetTabs}>
      <widgets saved-widgets={tab.widgets} />
    </virtual>
  </div>

  <style>
    vaadin-tabs {
      margin-bottom: 5px;
    }
  </style>


  <script>
  
    this.widgetTabs = [];
    this.selectedTab = 0;

    this.onselected = (ev) => {
      this.selectedTab = ev.detail.value;
    }

    this.getActiveWidgetTab = () => {
      let $activeWidget = $(this.root).find('widgets');

      if ($activeWidget.length === 0) {
        return null;
      }

      return $activeWidget[0]._tag;
    };


    this.getWidgetTabs = () => {
      let tabs = [];

      $(this.root).find('widgets').each(function() {
        let widgets = $(this)[0]._tag;
        tabs.push(widgets);
      });

      return tabs;
    };

    this.getWidgetTabsJson = () => {
      let widgetTabs = this.getWidgetTabs();

      return widgetTabs.map((tab, index) => {
        return {
          header: this.widgetTabs[index].header,
          widgets: tab.getWidgetJson()
        }
      });
    };

    this.addTab = () => {
      const tabNumber = this.widgetTabs.length + 1;
      this.widgetTabs.push({
        header: `Tab ${tabNumber}`,
        widgets: []
      });

      this.update();
    };

    this.removeTab = (ev) => {
      let tabIndex = $(ev.target).data('tab-index');
      this.widgetTabs.splice(tabIndex, 1);
      if (this.widgetTabs.length === 0) {
        this.addTab();
      }
      this.update();
    };

    this.onHeaderChange = (ev) => {
      var inputWidth = $(ev.target).textWidth();
      $(ev.target).css({
        width: inputWidth + 20
      })
      $(ev.target).trigger('input');

      // get text
      let header = $(ev.target).val();
      let index = $(ev.target).data('tab-index');
      this.widgetTabs[index].header = header;
    };

    this.loadLayout = () => {
      return getSavedLayout().then((tabs) => {
        if (!tabs) {
          return;
        }
        this.widgetTabs = tabs;
        this.update();
        if (this.widgetTabs.length === 0) {
          this.addTab();
        }
      });
    }

    this.newLayout = () => {
        this.widgetTabs = [];
        this.update();
        this.addTab();
    };

    this.on('mount', () => {
      this.widgetTabs = getDefaultLayout();
      this.update();
      
      if (this.widgetTabs.length === 0) {
        this.addTab();
      }
    });

    function getDefaultLayout() {
      try {
        const filename = dashboard.storage.getDefaultLayoutPath();
        const tabs = JSON.parse(readFileSync(filename, 'utf8'));
        return tabs;
      }
      catch(e) {
        console.error('Error opening dashboard', e.message);
        return [];
      }
    }

    async function getSavedLayout() {

      const options = {
        title: 'Open Layout',
        defaultPath: dashboard.storage.getDefaultLayoutPath(),
        properties: ['openFile'],
        filters: [
          { name: 'JSON files', extensions: ['json'] }
        ]
      };

      try {
        const { canceled, filePaths } = await dialog.showOpenDialog(options);
        if (!canceled) {
          const tabs = JSON.parse(readFileSync(filePaths[0], 'utf8'));
          dashboard.storage.setDefaultLayoutPath(filePaths[0]);
          dashboard.toastr.success(`Layout opened`); 
          return tabs;
        }
      }
      catch(e) {
        dashboard.toastr.error(`Failed to open layout: ${e.message}`);
        return [];
      }
    }

  </script>



</widget-tabs>