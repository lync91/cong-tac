'use strict';
/* Controllers */
// signin controller

// Im stuck with some shitt

app.controller('inbieumaugiamsat', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window', 'uiGridConstants',
  function ($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window, uiGridConstants) {
    $scope.get_loaicongviec = function () {
      socket.emit('get loai cong viec thi cong', function (data) {
        console.log(data);

        $scope.loaicongviec = data;
      });
    }
    $scope.get_loaicongviec();
    $scope.get_listbm = function () {
      var lcv = {
        _id: $stateParams.ct
      }
      socket.emit('get list bieu mau', lcv, function (data) {
        console.log(data);
        $scope.bieumaugiamsat = data;
      });
    };
    $scope.get_listbm();
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