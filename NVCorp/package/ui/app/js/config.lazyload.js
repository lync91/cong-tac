// lazyload config

angular.module('app')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      easyPieChart:   [   'node_modules/easy-pie-chart/dist/jquery.easypiechart.js'],
      sparkline:      [   'node_modules/jquery-sparkline/dist/jquery.sparkline.retina.js'],
      plot:           [   'node_modules/flot/jquery.flot.js',
                          'node_modules/flot/jquery.flot.pie.js', 
                          'node_modules/flot/jquery.flot.resize.js',
                          'node_modules/flot.tooltip/js/jquery.flot.tooltip.js',
                          'node_modules/flot.orderbars/js/jquery.flot.orderBars.js',
                          'node_modules/flot-spline/js/jquery.flot.spline.js'],
      moment:         [   'node_modules/moment/moment.js'],
      screenfull:     [   'node_modules/screenfull/dist/screenfull.min.js'],
      slimScroll:     [   'node_modules/slimscroll/jquery.slimscroll.min.js'],
      sortable:       [   'node_modules/html5sortable/jquery.sortable.js'],
      nestable:       [   'node_modules/nestable/jquery.nestable.js',
                          'node_modules/nestable/jquery.nestable.css'],
      filestyle:      [   'node_modules/bootstrap-filestyle/src/bootstrap-filestyle.js'],
      slider:         [   'node_modules/bootstrap-slider/bootstrap-slider.js',
                          'node_modules/bootstrap-slider/bootstrap-slider.css'],
      chosen:         [   'node_modules/chosen/chosen.jquery.min.js',
                          'node_modules/bootstrap-chosen/bootstrap-chosen.css'],
      TouchSpin:      [   'node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
                          'node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
      wysiwyg:        [   'node_modules/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                          'node_modules/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
      dataTable:      [   'node_modules/datatables/media/js/jquery.dataTables.min.js',
                          'node_modules/datatables-bootstrap3-plugin/media/dataTables-bootstrap.js',
                          'node_modules/datatables-bootstrap3-plugin/media/dataTables-bootstrap.css'],
      vectorMap:      [   'node_modules/bower-jvectormap/jquery-jvectormap-1.2.2.min.js', 
                          'node_modules/bower-jvectormap/jquery-jvectormap-world-mill-en.js',
                          'node_modules/bower-jvectormap/jquery-jvectormap-us-aea-en.js',
                          'node_modules/bower-jvectormap/jquery-jvectormap-1.2.2.css'],
      footable:       [   'node_modules/footable/dist/footable.all.min.js',
                          'node_modules/footable/css/footable.core.css'],
      fullcalendar:   [   'node_modules/moment/moment.js',
                          'node_modules/fullcalendar/dist/fullcalendar.min.js',
                          'node_modules/fullcalendar/dist/fullcalendar.css',
                          'node_modules/fullcalendar/dist/fullcalendar.theme.css'],
      daterangepicker:[   'node_modules/moment/moment.js',
                          'node_modules/bootstrap-daterangepicker/daterangepicker.js',
                          'node_modules/bootstrap-daterangepicker/daterangepicker-bs3.css'],
      tagsinput:      [   'node_modules/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
                          'node_modules/bootstrap-tagsinput/dist/bootstrap-tagsinput.css']
                      
    }
  )
  // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:  true,
          events: true,
          modules: [
              {
                  name: 'ngGrid',
                  files: [
                      'node_modules/ng-grid/build/ng-grid.min.js',
                      'node_modules/ng-grid/ng-grid.min.css',
                      'node_modules/ng-grid/ng-grid.bootstrap.css'
                  ]
              },
              {
                  name: 'ui.grid',
                  files: [
                      'node_modules/angular-ui-grid/ui-grid.min.js',
                      'node_modules/angular-ui-grid/ui-grid.min.css',
                      'node_modules/angular-ui-grid/ui-grid.bootstrap.css'
                  ]
              },
              {
                  name: 'ui.select',
                  files: [
                      'node_modules/angular-ui-select/select.min.js',
                      'node_modules/angular-ui-select/select.min.css'
                  ]
              },
              {
                  name:'angularFileUpload',
                  files: [
                    'node_modules/angular-file-upload/angular-file-upload.min.js'
                  ]
              },
              {
                  name:'ui.calendar',
                  files: ['node_modules/angular-ui-calendar/src/calendar.js']
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      'node_modules/ng-img-crop/compile/minified/ng-img-crop.js',
                      'node_modules/ng-img-crop/compile/minified/ng-img-crop.css'
                  ]
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      'node_modules/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                      'node_modules/angular-bootstrap-nav-tree/dist/abn_tree.css'
                  ]
              },
              {
                  name: 'toaster',
                  files: [
                      'node_modules/angularjs-toaster/toaster.js',
                      'node_modules/angularjs-toaster/toaster.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      'node_modules/textangular/dist/textangular-sanitize.min.js',
                      'node_modules/textangular/dist/textangular.min.js'
                  ]
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      'node_modules/venturocket-angular-slider/build/angular-slider.min.js',
                    //   'node_modules/venturocket-angular-slider/build/angular-slider.css'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular',
                  files: [
                      'node_modules/videogular/videogular.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.controls',
                  files: [
                      'node_modules/videogular-controls/controls.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.buffering',
                  files: [
                      'node_modules/videogular-buffering/buffering.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.overlayplay',
                  files: [
                      'node_modules/videogular-overlay-play/overlay-play.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.poster',
                  files: [
                      'node_modules/videogular-poster/poster.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.imaads',
                  files: [
                      'node_modules/videogular-ima-ads/ima-ads.min.js'
                  ]
              },
              {
                  name: 'xeditable',
                  files: [
                      'node_modules/angular-xeditable/dist/js/xeditable.min.js',
                      'node_modules/angular-xeditable/dist/css/xeditable.css'
                  ]
              },
              {
                  name: 'smart-table',
                  files: [
                      'node_modules/angular-smart-table/dist/smart-table.min.js'
                  ]
              },
              {
                name: 'ngMap',
                files: [
                  'node_modules/ngmap/build/scripts/ng-map.min.js',
                ]
              },
              {
                name: 'ngMapAutocomplete',
                files: [
                  'node_modules/ng-map-autocomplete/src/ng-map-autocomplete.js',
                  'node_modules/angucomplete/angucomplete.css'
                ]
              },
              {
                name: 'ui.utils.masks',
                files: [
                  'node_modules/angular-input-masks/releases/angular-input-masks-standalone.js',
                  'node_modules/angular-input-masks/releases/angular-input-masks-dependencies.min.js'
                ]
              },
              {
                name: 'pdfmake',
                files: [
                  'node_modules/pdfmake/build/pdfmake.min.js',
                ]
              },
              {
                name: 'pdfmake-font',
                files: [
                    'node_modules/pdfmake/build/vfs_fonts.js',
                ]
              },
          ]
      });
  }])
;
