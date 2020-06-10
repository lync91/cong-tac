module.exports = {
  angular: {
    src: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-cookies/angular-cookies.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-touch/angular-touch.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/ngstorage/ngstorage.js',
      'node_modules/ui-utils/ui-utils.js',
      'node_modules/angular-bootstrap/ui-bootstrap-tpls.js',
      'node_modules/oclazyload/dist/ocLazyLoad.js',
      'node_modules/angular-translate/dist/angular-translate.js',
      'node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'node_modules/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'node_modules/angular-translate-storage-local/angular-translate-storage-local.js',
      'node_modules/socket.io-client/dist/socket.io.js',
      'node_modules/angular-socket-io/socket.js',
      'node_modules/angular-filter/dist/angular-filter.js',
      'node_modules/angular-web-notification/angular-web-notification.js',
      'node_modules/angucomplete-alt/angucomplete-alt.js',
      'node_modules/angular-table/dist/angular-table.js',
      'node_modules/angular-ui-grid/ui-grid.min.js',
      'node_modules/ng-mask/dist/ngMask.js',

      'src/js/*.js',
      'src/js/directives/*.js',
      'src/js/services/*.js',
      'src/js/filters/*.js',
      'src/js/factory/*.js',
      'src/js/controllers/bootstrap.js'
    ],
    dest: 'angular/js/app.src.js'
  },
  html: {
    src: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'html/js/*.js'
    ],
    dest: 'html/js/app.src.js'
  }
}
