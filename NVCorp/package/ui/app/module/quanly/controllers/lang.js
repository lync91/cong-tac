'user strict';
//Controllers
// controller Người dùng
app.controller('lang', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', function ($rootScope, $scope, socket, $http, $window, $stateParams, $modal) {
    // socket.emit('get_dsnhanvien', 1, function (data) {
    //   console.log(data);
    //   $scope.users = data;
    // })
    $scope.lang = [];
    socket.emit('get ngon ngu', function (data) {
        $scope.lang = data;
    });
    $scope.edit = function (l) {
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/edit_cuphap_ngonngu.htm',
            controller: 'edit',
            resolve: {
                l: function () {
                    return l;
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
            templateUrl: 'module/quanly/modals/add_cuphap_ngonngu.htm',
            controller: 'add',
            resolve: {
            }
        });
        modalInstance.result.then(function (data) {
            $scope.lang.push(data);
        }, function () {});
    };
    // $scope.delete_chucvu = function (u) {
    //     var modalInstance = $modal.open({
    //         templateUrl: 'module/boxes/delete_content.htm',
    //         controller: 'delete_chucvu',
    //         resolve: {
    //             cv: function () {
    //                 return u;
    //             },
    //             ac: function () {
    //                 return ({
    //                     title: 'Xóa chức vụ',
    //                     noti: 'Chức vụ này sẽ bị xóa khỏi hệ thống'
    //                 })
    //             }
    //         }
    //     });
    //     modalInstance.result.then(function (res) {
    //         console.log($scope.chucvu.indexOf(res));
    //         $scope.chucvu.splice($scope.chucvu.indexOf(res), 1);
    //     }, function () {});
    // };
}]);
app.controller('edit', ['$scope', 'socket', '$modalInstance', 'l', function ($scope, socket, $modalInstance, l) {
    $scope.l = l;
    $scope.l.key_new = l.key;
    $scope.l.value_new= l.value;
    $scope.ok = function () {
        socket.emit('update lang', $scope.l, function (res) {
            l.key = res.key
            l.value = res.value
            $modalInstance.close()
        })
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('add', ['$scope', 'socket', '$modalInstance', function ($scope, socket, $modalInstance) {
    $scope.ok = function () {
        console.log($scope.l);
        socket.emit('add cu phap ngon ngu', $scope.l, function (data) {
            console.log(data);
            $modalInstance.close(data);
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