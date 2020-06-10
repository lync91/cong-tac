'user strict';
//Controllers
// controller Người dùng
app.controller('users', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', function($rootScope, $scope, socket, $http, $window, $stateParams, $modal) {
    $scope.users = [];
    socket.emit('get_dsnhanvien', 1, function(data) {
        console.log(data);
        $scope.users = data;
    });
    $scope.date = new Date();
    socket.emit('get_chucvu', 1, function(data) {
        $scope.chucvu = data;
    });
    socket.emit('get_phongban', 1, function(data) {
        $scope.phongban = data;
    });
    $scope.edit_user = function(u) {
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/edit.htm',
            controller: 'edit_user',
            resolve: {
                u: function() {
                    return u;
                },
                chucvu: function() {
                    return $scope.chucvu;
                },
                phongban: function() {
                    return $scope.phongban;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.add_user = function() {
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/add_user.htm',
            controller: 'add_user',
            resolve: {
                chucvu: function() {
                    return $scope.chucvu;
                },
                phongban: function() {
                    return $scope.phongban;
                }
            }
        });

        modalInstance.result.then(function(data) {
            $scope.users.push(data);
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.user_role = function(u) {
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/user_role.htm',
            controller: 'user_role',
            resolve: {
                u: function() {
                    return u;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.delete_user = function(u) {
        var modalInstance = $modal.open({
            templateUrl: 'module/boxes/delete_content.htm',
            controller: 'delete_user',
            resolve: {
                u: function() {
                    return u;
                },
                ac: function () {
                  return {
                    title: 'Xóa nhân viên',
                    noti: 'Nhân viên này sẽ bị xóa khỏi hệ thống!'
                  }
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);
app.controller('edit_user', ['$scope', 'socket', '$modalInstance', 'u', 'chucvu', 'phongban', function($scope, socket, $modalInstance, u, chucvu, phongban) {
    console.log(u.company);
    $scope.u = u;
    $scope.chucvu = chucvu;
    $scope.phongban = phongban;
    $scope.u = u;
    $scope.u.company_new = u.company;
    $scope.u.chucvu_new = u.chucvu;
    $scope.u.fullname_new = u.fullname;
    $scope.u.username_new = u.username;
    $scope.u.email_new = u.email;
    $scope.ok = function() {
        console.log($scope.u);
        socket.emit('update_user_details', $scope.u, function(data) {
            u.company = data.company;
            u.fullname = data.fullname;
            u.username = data.username;
            u.chucvu = data.chucvu;
            u.email = data.email;
            // u.company = data.company;
            $modalInstance.close();
        })

    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('add_user', ['$scope', 'socket', '$modalInstance', 'chucvu', 'phongban', function($scope, socket, $modalInstance, chucvu, phongban) {
    // console.log(u.company);
    $scope.u = {};
    $scope.chucvu = chucvu;
    $scope.phongban = phongban;
    $scope.ok = function() {
        console.log($scope.u);
        socket.emit('add_user', $scope.u, function (data) {
          console.log(data);
          $modalInstance.close(data);
        })

    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('user_role', ['$scope', 'socket', '$modalInstance', 'u', function($scope, socket, $modalInstance, u) {
    // console.log(u.company);
    $scope.u = u;
    // $scope.roles = {};
    socket.emit('get_roles', 1, function (roles) {
      if (u.roles) {
        var u_roles = JSON.parse(u.roles);
        for (r in u_roles) {
          roles[r] = u_roles[r];
        }
      }
      $scope.roles = roles;
    })

    console.log($scope.roles);
    $scope.ok = function() {
      // console.log($scope.roles);
      var data = {
        u_id: u._id,
        roles: $scope.roles
      }
      socket.emit('update_user_role', data, function (res) {
        console.log(res);
        u.roles = res;
        $modalInstance.close();
      })
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('delete_user', ['$scope', 'socket', '$modalInstance', 'u', 'ac', function($scope, socket, $modalInstance, u, ac) {
    $scope.u = u;
    $scope.ac = ac;
    $scope.ok = function() {
      socket.emit('delete_user', u, function (res) {
        u.deleted = true;
        $modalInstance.close();
      })
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
