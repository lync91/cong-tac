'user strict';
//Controllers
// controller Người dùng
app.controller('diadiem', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', function($rootScope, $scope, socket, $http, $window, $stateParams, $modal) {
    socket.emit('get_diadiem', 1, function(data) {
        console.log(data);
        $scope.dsdiadiem = data;
    });
    $scope.lat = 34.834442;
    $scope.lng = -82.3686479;
    $scope.delete_diadiem = function (dd) {
      console.log(dd);
      var modalInstance = $modal.open({
        templateUrl: 'module/boxes/delete_content.htm',
        controller: 'delete_diadiem',
        size: 'md',
        resolve: {
          dd: function () {
            return dd;
          },
          ac: function () {
            return {
              title: 'Xóa địa điểm',
              noti: 'Địa điểm này sẽ bị xóa khỏi hệ thống. Hãy chắc chắn điều đó!'
            };
          }

        }
      });

      modalInstance.result.then(function (data) {
        for (var i = 0; i < $scope.dsdiadiem.length; i++) {
                if ($scope.dsdiadiem[i]._id == data._id) {
                    $scope.dsdiadiem.splice(i, 1);
                }
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };

}]);
app.controller('edit_diadiem', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', 'NgMap', function($rootScope, $scope, socket, $http, $window, $stateParams, $modal, NgMap) {
    $scope.diadiem = {
        pos: {}
    };
    socket.emit('diadiemById', $stateParams.id, function(data) {
        console.log(data);
        $scope.diadiem = data;
        if (data.pos) {
            $scope.center = [data.pos.lat, data.pos.lng];
        } else {
            $scope.center = data.address;
        }
    });
    var map;
    var vm = this;
    NgMap.getMap().then(function(evtMap) {
        map = evtMap;
    });
    $scope.getCurrentLocation = function(event) {
        console.log(event);
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
        $scope.diadiem.pos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
    };
    console.log($stateParams);

    // console.log($scope.map);
    $scope.save = function() {
        socket.emit('save_diadiem', $scope.diadiem, function(data) {

        });
    };
}]);
app.controller('delete_diadiem', ['$scope', 'socket', '$modalInstance', 'dd', 'ac', function($scope, socket, $modalInstance, dd, ac) {
    // console.log(dd);
    console.log(ac);
    $scope.ac = ac;
    $scope.dd = {
        name_new: dd.name,
        address_new: dd.address,
        pos_new: dd.pos
    };
    $scope.render = true;
    $scope.ok = function() {
      socket.emit('delete_diadiem', dd._id, function (data) {
        // $modalInstance.close(data);
        console.log(data);
        if (data.n >= 0) {
          $modalInstance.close(dd);
        }
      });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
