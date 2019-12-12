import { LitElement, html, css } from 'lit-element';
import './camera-sources';
import './networktables/networktables-sources';

class DashboardSources extends LitElement {


  static get styles() {
    return css`
    #accordion {
        max-height: 100%;
      }

      .card-header {
        padding: 3px 5px;
      }

      .oi-caret-right {
        display: none;
      }

      .collapsed .oi-caret-right {
        display: inline-block;
      }

      .collapsed .oi-caret-bottom {
        display: none;
      }

      .oi {
        font-size: 12px;
        margin-right: 5px;
      }

      .btn-link:hover, .btn-link:focus {
        text-decoration: none;
      }
    `;
  }

  firstUpdated() {
    const $root = $(this.shadowRoot);
    const $collapse = $root.find('.collapse');
    const $collapseHeaders = $root.find('.card-header');

    $collapseHeaders.on('click', function() {
      const target = $(this).find('.btn-link').attr('data-target');
      const $target = $root.find(target);
      const isShown = $target.hasClass('show');
      $collapse.removeClass('show');
      if (!isShown)
        $root.find(target).addClass('show');
    });
  }

  render() {
    return html`
      ${includeStyles()}
      <div id="accordion">
        <div class="card">
          <div class="card-header" id="cameraServerHeader">
            <h5 class="mb-0">
              <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#cameraServerBody" aria-expanded="false" aria-controls="cameraServerBody">
                <span class="oi oi-caret-right"></span>
                <span class="oi oi-caret-bottom"></span>
                CameraServer
              </button>
            </h5>
          </div>

          <div id="cameraServerBody" class="collapse" aria-labelledby="cameraServerHeader" data-parent="#accordion">
            <div class="card-body">
              <camera-sources></camera-sources>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header" id="networkTablesHeader">
            <h5 class="mb-0">
              <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#networkTablesBody" aria-expanded="false" aria-controls="networkTablesBody">
                <span class="oi oi-caret-right"></span>
                <span class="oi oi-caret-bottom"></span>
                NetworkTables
              </button>
            </h5>
          </div>
          <div id="networkTablesBody" class="collapse" aria-labelledby="networkTablesHeader" data-parent="#accordion">
            <div class="card-body">
              <networktables-sources></networktables-sources>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('dashboard-sources', DashboardSources);