import './widgets.tag';
import _ from 'lodash';
import axios from 'axios';
import { readFileSync } from 'fs';
const dialog = require('electron').remote.dialog;

<widget-tabs>

  <div class="card">
    <div class="card-header"> 
      <ul class="nav nav-tabs card-header-tabs pull-right" id="widget-tabs" role="tablist">
        <li class="nav-item tab" each={tab, index in widgetTabs}>
          <a class="nav-link {index === 0 ? 'active' : ''}" 
             id="{_.kebabCase(tab.header)}-tab" 
             data-toggle="tab" 
             href="#{_.kebabCase(tab.header)}" 
             role="tab" aria-controls="{_.kebabCase(tab.header)}" 
             aria-selected="{index === 0 ? 'true' : 'false'}">

            <input data-tab-index={index} 
                   type="text" class="tab-header-input" 
                   onchange={onHeaderChange} 
                   onfocusout={onHeaderChange} 
                   oninput={onHeaderChange} 
                   value={tab.header} />
            <span class="oi oi-x" data-tab-index={index} onclick={removeTab}></span>
          </a>
        </li>
        <li class="nav-item add-tab">
          <span class="oi oi-plus" onclick={addTab}></span>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <div class="tab-content" id="widget-tab-content">
        <virtual each={tab, index in widgetTabs}>
          <div class="tab-pane fade {index === 0 ? 'active show' : ''}" 
              id="{_.kebabCase(tab.header)}" role="tabpanel" 
              aria-labelledby="{_.kebabCase(tab.header)}-tab">
            <widgets saved-widgets={tab.widgets} />
          </div>
        </virtual>
      </div>
    </div>
  </div>

  <style>

    side-panel {
      height: 100%;
    }

    > .card > .card-body {
      padding: 10px;
      overflow: hidden;
      background: #EFEFEF;
    }

    > .card > .card-header {
      overflow: hidden;
      border-bottom: none;
      padding: 0 1.25rem .75rem;
      background: white;
    }

    > .card {
      border-bottom: none;
      height: 100%;
    }

    .card {
      border-radius: 0;
      border-bottom: none;
    }

    .card:last-child {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);;
    }
    
    > .card > .card-header .nav-item .nav-link {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 0;
    }

    > .card > .card-header .nav-item .nav-link.active {
      background: #EFEFEF;
    }

    .nav-item.add-tab .oi {
      margin-top: 15px;
      margin-left: 10px;
      font-size: 11px;
      cursor: pointer;
    }

    .nav-item.tab .nav-link {
      display: flex;
      align-items: center;
    }

    .nav-item.tab .nav-link .oi {
      display: none;
      margin-left: 10px;
      font-size: 11px;
      height: 12px;
    }

    .nav-item.tab .nav-link.active .oi {
      display: inline-block;
    }

    .tab-header-input {
      white-space: nowrap;
      outline: none;
      border: none;
      background-color: rgba(0,0,0,0);
      text-overflow: ellipsis;
      max-width: 200px;
      min-width: 30px;
    }
  </style>


  <script>
  
    this.widgetTabs = [];

    this.getActiveWidgetTab = () => {
      let $activeWidget = $(this.root).find('.card-body .tab-pane.active widgets');

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
      this.updateTabInputWidths();
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

    this.updateTabInputWidths = () => {
        $(this.root).find('.tab-header-input').each(function() {
          var inputWidth = $(this).textWidth();
          $(this).css({ 
            width: inputWidth + 20
          })
        });
    };

    this.loadLayout = () => {
      return getSavedLayout().then((tabs) => {

        if (!tabs) {
          return;
        }

        this.widgetTabs = tabs;
        this.update();
        this.updateTabInputWidths();
        
        if (this.widgetTabs.length === 0) {
          this.addTab();
        }
      });
    }

    this.newLayout = () => {
        this.widgetTabs = [];
        this.update();
        this.updateTabInputWidths();
        this.addTab();
    };

    this.on('mount', () => {
      this.widgetTabs = getDefaultLayout();
      this.update();
      this.updateTabInputWidths();
      
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