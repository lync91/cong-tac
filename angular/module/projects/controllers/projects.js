'use strict';

/* Controllers */
// projects controller
app.controller('projects', ['$scope', 'socket', '$http', 'applib', '$filter', '$modal',
  function ($scope, socket, $http, applib, $filter, $modal) {
    $scope.config = {
      itemsPerPage: 15,
      maxPages: 5,
      fillLastPage: "no"
    };
    $scope.or_projects = [];
    $scope.projects = [];
    socket.emit('get_projects', 1, function (data) {
      console.log(data);
      $scope.projects = data;
      $scope.or_projects = data;
    });
    $scope.updateFilteredList = function () {
      $scope.projects = $filter("filter")($scope.or_projects, $scope.search);
    };
    $scope.delete_project = function (p) {
      var modalInstance = $modal.open({
        templateUrl: 'module/boxes/delete_content.htm',
        controller: 'delete_project',
        size: 'md',
        resolve: {
          p: function () {
            return p;
          },
          ac: function () {
            return {
              title: 'Xóa dự án',
              noti: 'Dự án' + p.project_title + ' sẽ bị xóa khỏi hệ thống. Hãy chắc chắn điều đó!'
            };
          }

        }
      });

      modalInstance.result.then(function (data) {
        if (data) {
          for (var i = 0; i < $scope.projects.length; i++) {
            if ($scope.projects[i]._id == p._id) {
              $scope.projects.splice(i, 1);
            }
          }
        }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };
    // socket.on('get_projects', function(data) {
    //     $scope.projects = data;
    // })
  }
]);
app.controller('delete_project', ['$scope', 'socket', '$modalInstance', 'p', 'ac', function ($scope, socket, $modalInstance, p, ac) {
  // console.log(dd);
  console.log(ac);
  $scope.ac = ac;
  $scope.render = true;
  $scope.ok = function () {
    console.log(p);
    socket.emit('delete_project', p, function (data) {
      if (data) {
        $modalInstance.close(data);
      }
    });
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);;
// project_progress
// app.filter('project_progress', function($rootScope) {
//     return function(items) {
//         // console.log(items);
//         // console.log($rootScope.globals);
//         var output = 0;
//         var val = 0;
//         var tong = items.length;
//         // console.log(items);
//         if (angular.isArray(items)) {
//           items.forEach(function (m, i) {
//             if (m.trangthai) {
//               if (m.trangthai.trangthai.thutu >= 5) {
//                 val += 1;
//               }
//             }
//           });
//           output = val*100/tong;
//         }
//         return output;
//
//     };
// });