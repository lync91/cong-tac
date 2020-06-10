'use strict';

/* Controllers */
// signin controller
app.config(['weeklySchedulerLocaleServiceProvider', function (localeServiceProvider) {
  localeServiceProvider.configure({
    doys: {
      'es-es': 4
    },
    lang: {
      'es-es': {
        month: 'Mes',
        weekNb: 'número de la semana',
        addNew: 'Añadir'
      }
    },
    localeLocationPattern: 'https://code.angularjs.org/1.5.8/i18n/angular-locale_{{locale}}.js'
  });
}])

app.controller('botrikehoachgiamsat', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window', '$timeout', '$log',
  function ($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window, $timeout, $log) {
    console.log($stateParams);
    $scope.param = $stateParams;
    $scope.options = {
      fromDate: new Date(2013, 9, 1, 15, 0, 0),
      toDate: new Date(2013, 9, 30, 15, 0, 0)
    }
    $scope.data = [];
    socket.emit('get ke hoach details', $stateParams.kh_id, function (data) {
      console.log(data);
      if (angular.isArray(data.dscongtac)) {
        data.dscongtac.forEach(e => {
          $scope.data.push({
            name: e.congtac.tencongtac,
            tasks: [{
              name: "",
              color: '#9FC5F8',
              from: new Date(2013, 9, 25, 15, 0, 0),
              to: new Date(2013, 9, 25, 18, 30, 0)
            }]
          });
        });
      }
    });
    $scope.addSamples = function () {
      $scope.loadData(getSampleData().data1);
      $timeout(function () {
        $scope.scrollToDate(new Date());
      }, 0, true);
    };
  }
]);

// function printhtml(html, style) {

//   printHtmlElement.printHtml(html, {
//     pageTitle: 'From HTML String',
//     printMode: 'iframe',
//     // styles: [style],
//     stylesheets: ['http://www.namviet.tk/css/biahoso.css']
//   });
// }