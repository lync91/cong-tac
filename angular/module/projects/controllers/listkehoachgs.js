'use strict';

/* Controllers */
// signin controller
app.controller('listkehoachgiamsat', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window', 'uiGridConstants',
  function ($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window, uiGridConstants) {
    console.log($stateParams);
    $scope.param = $stateParams;
    // $scope.okkk = function (str) {
    //   var res = $scope.$eval(str);
    //   console.log(res);
    // };
    $scope.listkh = [];
    socket.emit('get list ke hoach giam sat cong trinh', $scope.param, function (data) {
      console.log(data);
      $scope.listkh = data;
    });
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