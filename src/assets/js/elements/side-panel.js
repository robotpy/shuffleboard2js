import { LitElement, html, css } from 'lit-element';
import './dashboard-sources';


class SidePanel extends LitElement {


  static get styles() {
    return css`
      .card-body {
        padding: 10px;
        overflow: auto;
      }

      > .card > .card-header {
        border-bottom: none;
        padding: 0 1.25rem .75rem;
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
    `;
  }

  firstUpdated() {
    const $root = $(this.shadowRoot);
    $root.find('.nav-tabs a').click(function(e) {
      e.preventDefault();
      $(this).tab('show');
      $root
        .find('.card-body .tab-pane')
        .removeClass('show active');
      
      const tabPaneSelector = $(this).attr('href');
      $root
        .find('.card-body')
        .find(tabPaneSelector)
        .addClass('show active');
    })
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="card ">
        <div class="card-header"> 
          <ul class="nav nav-tabs card-header-tabs pull-right" id="myTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" id="sources-tab" data-toggle="tab" href="#sources" role="tab" aria-controls="sources" aria-selected="true">
                Sources
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="widges-tab" data-toggle="tab" href="#widgets" role="tab" aria-controls="widgets" aria-selected="false">
                Widgets
              </a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="sources" role="tabpanel" aria-labelledby="sources-tab">
              <dashboard-sources></dashboard-sources>
            </div>
            <div class="tab-pane fade" id="widgets" role="tabpanel" aria-labelledby="widgets-tab">
              <widget-menu />
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('side-panel', SidePanel);