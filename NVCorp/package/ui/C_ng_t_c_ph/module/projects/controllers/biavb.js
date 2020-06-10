'use strict';

/* Controllers */
// signin controller
app.controller('biavb', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window',
  function($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window) {
    $scope.p = {};
    var bia_data = function() {
      return {
        type: "a4d",
        tieude: {
          content: '',
          size: 47,
          color: null,
          pad: 12,
          show: true
        },
        tap: {
          content: 'Tập 1',
          size: 33,
          color: null,
          pad: 12,
          show: true
        },
        tentap: {
          content: 'Báo cáo chính',
          size: 37,
          color: null,
          pad: 12,
          show: true
        },
        tieude_opts: {
          cao: 80
        },
        pinfo_opts: {
          size: 20,
          cao: 40,
          pad: 28
        },
        id: 1
      }
    }
    $scope.m = {};
    $scope.bia_data = {};
    $scope.list_bia = [];
    // $scope.bia_data.tieude.content =
    // $scope.get_ms = function(p_id){
    //   socket.emit('get_project_milestones', p_id, function(data){
    //     $scope.milestones = data;
    //     console.log(data)
    //   })
    // }
    
    socket.emit('get_milestone', $stateParams.mid, function(data) {
      $scope.m = data;
      // console.log(data);
      if (data.bia) {
        console.log(data.bia);
        $scope.list_bia = angular.fromJson(data.bia);
        $scope.bia_data = $scope.list_bia[0];
      } else {
        $scope.list_bia.push(bia_data());
        $scope.bia_data = $scope.list_bia[0];
      }
      $scope.bia_data.tieude.content = data.milestone_name
    })
    socket.emit('get_project_details', $stateParams.id, function(data) {
      console.log(data);
      $scope.p = data;
      $scope.get_ms(data._id);
      // console.log(data);
      // $scope.$emit('get_project_details', data);
    });
    socket.emit('get_qr', 'http://namviet.tk/api/m/' + $stateParams.mid, function(data) {
      $scope.qr = data;
    });
    socket.emit('get logo', 1, function(data) {
      $scope.logo = data;
    });
    $scope.add_bia = function() {
      // console.log("SSSS");
      var b = new bia_data();
      // var n = $scope.list_bia.lenght;
      // console.log(n);
      b.tap.content = 'Tập mới';
      b.tieude.content = $scope.m.milestone_name;
      $scope.list_bia.push(b);
      console.log($scope.list_bia);
      $scope.bia_data = b;
    };
    $scope.select_bia = function(b) {
      $scope.bia_data = b;
    }
    console.log($scope.bia_data);
    $scope.save = function() {
      var data = {
        _id: $scope.m._id,
        bia: JSON.stringify($scope.list_bia)
      }
      socket.emit('update_bia_milestone', data, function(res) {

      });
    }
    $scope.print = function() {
      var data = {
        _id: $scope.m._id,
        bia: JSON.stringify($scope.list_bia)
      }
      socket.emit('update_bia_milestone', data, function(res) {

      })
      $scope.table = $scope.table;
      var style = document.getElementById('style').innerHTML;
      // console.log(style);
      var innerContents = document.getElementById('htmlContent').innerHTML;
      // console.log(innerContents);
      $window.printhtml(innerContents, style);
    }

  }
]);

function printhtml(html, style) {

  printHtmlElement.printHtml(html, {
    pageTitle: 'From HTML String',
    printMode: 'iframe',
    // styles: [style],
    stylesheets: ['http://www.namviet.tk/css/biahoso.css']
  });
}
