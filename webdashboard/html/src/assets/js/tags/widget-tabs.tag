import './widgets.tag';
import _ from 'lodash';
import axios from 'axios';

<widget-tabs>

  <div class="card">
    <div class="card-header"> 
      <ul class="nav nav-tabs card-header-tabs pull-right" id="widget-tabs" role="tablist">
        <li class="nav-item" each={tab, index in widgetTabs}>
          <a class="nav-link {index === 0 ? 'active' : ''}" 
             id="{_.kebabCase(tab.header)}-tab" 
             data-toggle="tab" 
             href="#{_.kebabCase(tab.header)}" 
             role="tab" aria-controls="{_.kebabCase(tab.header)}" 
             aria-selected="{index === 0 ? 'true' : 'false'}">
            {tab.header}
          </a>
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

    .card-body {
      padding: 10px;
      overflow: auto;
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

    this.on('mount', () => {
      getSavedLayout().then((tabs) => {
        this.widgetTabs = tabs;
        this.update();
      });
    });

    async function getSavedLayout() {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/layout";
        const response = await axios.get(url);
        return response.data.tabs || [];
      }
      catch(e) {
        console.error('error', e);
        return [];
      }
    }

  </script>



</widget-tabs>