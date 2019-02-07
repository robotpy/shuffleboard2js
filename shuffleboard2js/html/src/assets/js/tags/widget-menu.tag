import './widget-menu-item.tag';
import * as _ from 'lodash';

<widget-menu>
  <div id="accordion">
    <div class="card" each={category in opts.categories}>
      <div class="card-header" id="{_.kebabCase(category.label)}-header">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#{_.kebabCase(category.label)}-body" aria-expanded="false" aria-controls="{_.kebabCase(category.label)}-body">
            <span class="oi oi-caret-right"></span>
            <span class="oi oi-caret-bottom"></span>
            {category.label}
          </button>
        </h5>
      </div>

      <div id="{_.kebabCase(category.label)}-body" class="collapse" aria-labelledby="{_.kebabCase(category.label)}-header" data-parent="#accordion">
        <div class="card-body">
          <virtual each={type in category.types}>
            <widget-menu-item type={type.widgetType} label={type.label} image={type.image} minx={type.minX} miny={type.minY} />
          </virtual>
        </div>
      </div>
    </div>  

  <style>

    #accordion {
      height: 100%;
      overflow: auto;
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

  </style>


  <script>
    let widgetTypes = [];
    let categoryNames = [];
    let categories = [];


    this.getUnaddedCategories = (allCategories) => {
      return _.difference(allCategories, categoryNames);
    };

    this.getUnaddedTypes = (allTypes) => {
      return _.difference(allTypes, widgetTypes);
    };

    this.addCategory = (categoryName) => {
      categories.push({
        label: categoryName,
        types: []
      })
      categories.sort(this.sortByLabel);
    };

    this.addType = (type) => {

      for (let i = 0; i < categories.length; i++) {
        if (categories[i].label !== type.category) {
          continue;
        }

        categories[i].types.push(type);
        categories[i].types.sort(this.sortByLabel);
      }
    };

    this.sortByLabel = (config1, config2) => {
      let label1 = config1.label.toLowerCase();
      let label2 = config2.label.toLowerCase();
      if (label1 < label2) {
        return -1;
      }
      else if (label1 > label2) {
        return 1;
      }
      else {
        return 0;
      }
    };

    this.onToggleOpen = (ev) => {
      $(this.refs.dropdown).toggleClass('show');
    };

    this.on('mount', () => {
      $(window).on('click', (ev) => {
        if ($(ev.target).closest('module-menu').length === 0) {
          $(this.refs.dropdown).removeClass('show');
        }
      });
    });

    this.mapStateToOpts = (state) => {

      let unaddedCategories = this.getUnaddedCategories(state.widgets.categories);
      categoryNames = categoryNames.concat(unaddedCategories);

      unaddedCategories.forEach(unaddedCategory => {
        this.addCategory(unaddedCategory);
        this.update();
      });

      let unaddedTypes = this.getUnaddedTypes(Object.keys(state.widgets.registered));
      widgetTypes = widgetTypes.concat(unaddedTypes);

      unaddedTypes.forEach(unaddedType => {
        let type = state.widgets.registered[unaddedType];
        this.addType({
          ...type,
          widgetType: unaddedType
        });
        this.update();
      });

      return {
        categories: categories
      };
    }    

    this.reduxConnect(this.mapStateToOpts, null);

  </script>
</widget-menu>