'use strict';

/* Controllers */
// signin controller
app.controller('filescan', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window',
  function($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window) {
    $scope.p = {};
    socket.emit('get_milestone', $stateParams.mid, function(data) {
      $scope.m = data;
    })
    socket.emit('get_project_details', $stateParams.id, function(data) {
      $scope.p = data;
    });
    socket.emit('get_files_scan', function (data) {
      $scope.files_scan = data;
      console.log(data);
    })

  }
]);

// function printhtml(html, style) {
//
//   printHtmlElement.printHtml(html, {
//     pageTitle: 'From HTML String',
//     printMode: 'iframe',
//     // styles: [style],
//     stylesheets: ['http://www.namviet.tk/css/biahoso.css']
//   });
// }
