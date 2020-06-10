'user strict';
//Controllers
// controller Người dùng
app.controller('project_roles', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', function ($rootScope, $scope, socket, $http, $window, $stateParams, $modal) {
    $scope.roles = [];
    socket.emit('get project roles', function (data) {
        console.log(data);
        $scope.roles = data
    });

    $scope.edit_chucvu = function (u) {
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/edit_chucvu.htm',
            controller: 'edit_chucvu',
            resolve: {
                cv: function () {
                    return u;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {});
    };
    $scope.add = function () {
        // console.log('OK');
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/add_project_roles.htm',
            controller: 'add',
            resolve: {}
        });
        modalInstance.result.then(function (data) {
            $scope.roles.push(data);
        }, function () {});
    };
    $scope.delete_chucvu = function (u) {
        var modalInstance = $modal.open({
            templateUrl: 'module/boxes/delete_content.htm',
            controller: 'delete_chucvu',
            resolve: {
                cv: function () {
                    return u;
                },
                ac: function () {
                    return ({
                        title: 'Xóa chức vụ',
                        noti: 'Chức vụ này sẽ bị xóa khỏi hệ thống'
                    })
                }
            }
        });
        modalInstance.result.then(function (res) {
            console.log($scope.chucvu.indexOf(res));
            $scope.chucvu.splice($scope.chucvu.indexOf(res), 1);
        }, function () {});
    };
}]);
app.controller('edit_chucvu', ['$scope', 'socket', '$modalInstance', 'cv', function ($scope, socket, $modalInstance, cv) {
    $scope.cv = cv;
    $scope.cv.chucvu_new = cv.chucvu;
    $scope.cv.level_new = cv.level;
    if (cv.roles) {
        $scope.cv.roles_new = JSON.parse(cv.roles);
    }
    $scope.ok = function () {
        socket.emit('update_chucvu', $scope.cv, function (data) {
            console.log(data);
            cv.chucvu = data.chucvu;
            cv.level = data.level;
            cv.roles = data.roles;
            $modalInstance.close();
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('add', ['$scope', 'socket', '$modalInstance', function ($scope, socket, $modalInstance) {
    $scope.ok = function () {
        console.log($scope.r);
        socket.emit('add project role', $scope.r, function (res) {
            $modalInstance.close(res);
        })
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('delete_chucvu', ['$scope', 'socket', '$modalInstance', 'cv', 'ac', function ($scope, socket, $modalInstance, cv, ac) {
    $scope.cv = cv;
    $scope.ac = ac;
    $scope.ok = function () {
        socket.emit('delete_chucvu', $scope.cv, function (data) {
            $modalInstance.close(cv);
        })
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);;