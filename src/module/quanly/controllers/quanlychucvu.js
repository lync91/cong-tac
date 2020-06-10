'user strict';
//Controllers
// controller Người dùng
app.controller('quanlychucvu', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', function($rootScope, $scope, socket, $http, $window, $stateParams, $modal) {
    // socket.emit('get_dsnhanvien', 1, function (data) {
    //   console.log(data);
    //   $scope.users = data;
    // })
    $scope.chucvu = [];
    socket.emit('get_chucvu', 1, function(data) {
            $scope.chucvu = data;
        });
        // socket.emit('get_phongban', 1, function (data) {
        //   $scope.phongban = data;
        // })
    $scope.edit_chucvu = function(u) {
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/edit_chucvu.htm',
            controller: 'edit_chucvu',
            resolve: {
                cv: function() {
                    return u;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {});
    };
    $scope.them_chucvu = function() {
      // console.log('OK');
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/them_chucvu.htm',
            controller: 'them_chucvu',
            resolve: {
                cv: function() {
                    return 'u';
                }
            }
        });
        modalInstance.result.then(function(data) {
            $scope.chucvu.push(data);
        }, function() {});
    };
    $scope.delete_chucvu = function(u) {
        var modalInstance = $modal.open({
            templateUrl: 'module/boxes/delete_content.htm',
            controller: 'delete_chucvu',
            resolve: {
                cv: function() {
                    return u;
                },
                ac: function () {
                  return({
                    title: 'Xóa chức vụ',
                    noti: 'Chức vụ này sẽ bị xóa khỏi hệ thống'
                  })
                }
            }
        });
        modalInstance.result.then(function(res) {
            console.log($scope.chucvu.indexOf(res));
            $scope.chucvu.splice($scope.chucvu.indexOf(res), 1);
        }, function() {});
    };
}]);
app.controller('edit_chucvu', ['$scope', 'socket', '$modalInstance', 'cv', function($scope, socket, $modalInstance, cv) {
    $scope.cv = cv;
    $scope.cv.chucvu_new = cv.chucvu;
    $scope.cv.level_new = cv.level;
    $scope.cv.ADcode_new = cv.ADcode;
    if (cv.roles) {
      $scope.cv.roles_new = JSON.parse(cv.roles);
    }
    $scope.ok = function() {
        socket.emit('update_chucvu', $scope.cv, function(data) {
            console.log(data);
            cv.chucvu = data.chucvu;
            cv.level = data.level;
            cv.roles = data.roles;
            $modalInstance.close();
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('them_chucvu', ['$scope', 'socket', '$modalInstance', function($scope, socket, $modalInstance) {
    $scope.ok = function() {
        console.log($scope.cv);
        socket.emit('them_chucvu', $scope.cv, function (data) {
          console.log(data);
          $modalInstance.close(data);
        })
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('delete_chucvu', ['$scope', 'socket', '$modalInstance', 'cv', 'ac', function($scope, socket, $modalInstance, cv, ac) {
    $scope.cv = cv;
    $scope.ac = ac;
    $scope.ok = function() {
        socket.emit('delete_chucvu', $scope.cv, function(data) {
            $modalInstance.close(cv);
        })
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);;
