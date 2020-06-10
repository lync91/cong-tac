// import { log } from "util";

'use strict';

/* Controllers */
// signin controller
app.controller('phancong', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams',
    function ($rootScope, $scope, socket, $http, $location, $modal, $stateParams) {
        $scope.p = {};
        $scope.get_nhanvien = function () {
            socket.emit('get danh sach nhan vien tham gia du an', $scope.p._id, function (users) {
                console.log(users);

                $scope.users = users
            })
        }
        socket.emit('get_project_details', $stateParams.id, function (data) {
            $scope.p = data;
            $scope.get_nhanvien()
        });
        socket.emit('get_dsnhanvien', {}, function (data) {
            $scope.dsnhanvien = data;
        });
        socket.emit('get project roles', function (roles) {
            console.log(roles);
            $scope.roles = roles
        })
        $scope.add_user = function () {
            // console.log($scope.p);
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/phancong_nhanvien.htm',
                controller: 'phancong_nhanvien',
                resolve: {
                    p: function () {
                        return $scope.p
                    },
                    users: function () {
                        return $scope.dsnhanvien;
                    },
                    roles: function () {
                        return $scope.roles
                    }
                }
            });
            modalInstance.result.then(function (chudautu) {
                $scope.get_nhanvien()
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.user_role = function (u) {
            // console.log($scope.p);
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/edit_user_project_roles.htm',
                controller: 'user_project_roles',
                resolve: {
                    u: function () {
                        return u
                    },
                    roles: function () {
                        return $scope.roles;
                    }
                }
            });
            modalInstance.result.then(function (chudautu) {
                $scope.chudautu.push(chudautu);
                $scope.p.chudautu = chudautu;
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }

        //     $scope.phongban = [];
        //     $scope.chudautu = [];
        //     socket.emit('get_chudautu', 1, function(data) {
        //         $scope.chudautu = data;
        //     });
        //     socket.on('get_companies', function(companies) {
        //         companies.forEach(function(c) {
        //             if (c.phapnhan_id === 0) {
        //                 $scope.phongban.push(c);
        //             } else {
        //                 $scope.chudautu.push(c);
        //             }
        //         });
        //     });
        //     socket.emit('get_loaicongtrinh', 1, function(data) {
        //         $scope.loaicongtrinh = data;
        //     });
        //     $scope.capcongtrinh = [1, 2, 3, 4];
        //     $scope.nhomduan = ['A', 'B', 'C'];
        //     $scope.p = {};
        //     $scope.them_chudautu = function() {
        //         var modalInstance = $modal.open({
        //             templateUrl: 'module/projects/modal/them_chudautu.htm',
        //             controller: 'them_chudautu',
        //             resolve: {}
        //         });

        //         modalInstance.result.then(function(chudautu) {
        //             $scope.chudautu.push(chudautu);
        //             $scope.p.chudautu = chudautu;
        //         }, function() {
        //             // $log.info('Modal dismissed at: ' + new Date());
        //         });
        //     };
        //     $scope.loaicongviec = [];
        //     socket.emit('get_loaicongviec', 1, function(data) {
        //         $scope.loaicongviec = data;
        //     });

        //     $scope.create_project = function() {
        //         $scope.p.ac = 'update_project';
        //         socket.emit('update_project', $scope.p, function(data) {
        //             if (data) {
        //                 $location.path('/app/projects/view/' + $stateParams.id + '/project_details.html');
        //             }
        //         });
        //     };
    }
]);
app.controller('phancong_nhanvien', ['$scope', '$modalInstance', 'socket', 'p', 'users', 'roles', function ($scope, $modalInstance, socket, p, users, roles) {
    console.log(p);
    console.log(users);
    $scope.roles = roles;
    $scope._roles = {}
    $scope.pc = {
        p_id: p._id,
        roles: []
    }
    $scope.users = users;
    $scope.ok = function () {
        $scope.pc.roles = [];
        console.log($scope._roles);

        Object.keys($scope._roles).forEach(function (key) {
            $scope.pc.roles.push({
                k: key,
                v: $scope._roles[key]
            })
        });
        console.log($scope.pc);
        socket.emit('them nhan vien tham gia du an', $scope.pc, function (data) {
            console.log(data);
            $modalInstance.close();
        })
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('user_project_roles', ['$scope', '$modalInstance', 'socket', 'u', 'roles', function ($scope, $modalInstance, socket, u, roles) {
    // console.log(u);
    $scope.u = u
    $scope.u_roles = u.roles ? u.roles : {}
    $scope.roles = roles;
    $scope.ok = function () {
        $scope.u.roles_new = [];
        $scope.roles.forEach(e => {
            $scope.u.roles_new.push({
                k: e.key,
                v: $scope.u_roles[e.key] ? $scope.u_roles[e.key] : false
            });
        });
        console.log($scope.u);
        // socket.emit('them nhan vien tham gia du an', $scope.pc, function (data) {
        //     console.log(data);
        //     $modalInstance.close();
        // })
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
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