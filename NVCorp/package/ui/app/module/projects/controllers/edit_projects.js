'use strict';

/* Controllers */
// signin controller
app.controller('edit_project', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams',
function($rootScope, $scope, socket, $http, $location, $modal, $stateParams) {
  $scope.p = {};
  socket.emit('get_project_details', $stateParams.id, function(data) {
      // console.log(data);
      // $scope.p = data;
      $scope.p = data;
      // $scope.$emit('get_project_details', data);
  });
    $scope.phongban = [];
    $scope.chudautu = [];
    socket.emit('get_chudautu', 1, function(data) {
        $scope.chudautu = data;
    });
    socket.on('get_companies', function(companies) {
        companies.forEach(function(c) {
            if (c.phapnhan_id === 0) {
                $scope.phongban.push(c);
            } else {
                $scope.chudautu.push(c);
            }
        });
    });
    socket.emit('get_loaicongtrinh', 1, function(data) {
        $scope.loaicongtrinh = data;
    });
    $scope.capcongtrinh = [1, 2, 3, 4];
    $scope.nhomduan = ['A', 'B', 'C'];
    $scope.p = {};
    $scope.them_chudautu = function() {
        var modalInstance = $modal.open({
            templateUrl: 'module/projects/modal/them_chudautu.htm',
            controller: 'them_chudautu',
            resolve: {}
        });

        modalInstance.result.then(function(chudautu) {
            $scope.chudautu.push(chudautu);
            $scope.p.chudautu = chudautu;
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.loaicongviec = [];
    socket.emit('get_loaicongviec', 1, function(data) {
        $scope.loaicongviec = data;
    });

    $scope.create_project = function() {
        $scope.p.ac = 'update_project';
        socket.emit('update_project', $scope.p, function(data) {
            if (data) {
                $location.path('/app/projects/view/' + $stateParams.id + '/project_details.html');
            }
        });
    };
}]);
app.controller('them_chudautu', ['$scope', '$modalInstance', 'socket', function($scope, $modalInstance, socket) {
    $scope.ok = function() {
        socket.emit('them_chudautu', $scope.cdt, function(data) {
            $modalInstance.close(data);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
