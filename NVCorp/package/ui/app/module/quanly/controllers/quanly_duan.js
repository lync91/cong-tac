'user strict';
//Controllers
// controller Người dùng
app.controller('thietlap_duan', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', function($rootScope, $scope, socket, $http, $window, $stateParams, $modal) {

}]);
// ============================
// * Quản lý loại công việc   *
// ============================
app.controller('thietlap_duan_loaicongviec', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', 'editableOptions', 'editableThemes',
    function($rootScope, $scope, socket, $http, $window, $stateParams, $modal, editableOptions, editableThemes) {
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        $scope.loaicongviec = [];
        $scope.phongban = [];
        socket.emit('get_phongban', 1, function(data) {
            $scope.phongban = data;
        });
        socket.emit('get_loaicongviec', 1, function(data) {
            console.log(data);
            $scope.loaicongviec = data;
        });
        socket.emit('get_congtachd', 1, function(data) {
            $scope.congtachd = data;
        });
        $scope.edit_lcv = function(lcv) {
            var modalInstance = $modal.open({
                templateUrl: 'module/quanly/modals/edit_loaicongviec.htm',
                controller: 'edit_loaicongviec',
                resolve: {
                    lcv: function() {
                        return lcv;
                    },
                    phongban: function() {
                        return $scope.phongban;
                    },
                    congtachd: function() {
                        return $scope.congtachd;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.them_lcv = function() {
            var modalInstance = $modal.open({
                templateUrl: 'module/quanly/modals/add_loaicongviec.htm',
                controller: 'them_loaicongviec',
                resolve: {
                    phongban: function() {
                        return $scope.phongban;
                    }
                }
            });
            modalInstance.result.then(function(data) {
                $scope.loaicongviec.push(data);
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.delete_lcv = function(lcv) {
            var modalInstance = $modal.open({
                templateUrl: 'module/boxes/delete_content.htm',
                controller: 'delete_lcv',
                resolve: {
                    lcv: function() {
                        return lcv;
                    },
                    ac: function() {
                        return ({
                            title: 'Xóa loại công việc',
                            noti: 'Loại công việc này sẽ bị xóa khỏi hệ thống'
                        });
                    }
                }
            });
            modalInstance.result.then(function(res) {
                console.log($scope.loaicongviec.indexOf(res));
                $scope.loaicongviec.splice($scope.loaicongviec.indexOf(res), 1);
            }, function() {});
        };
        $scope.hd = [];
        socket.emit('hdd', 1, function (res) {
          // $scope.hd = res;
          res.forEach(function (h, i) {
            h.giatri.forEach(function (g, ii) {
              if (g.congtac._id == '5922f964ba2b243f77760e76') {
                $scope.hd.push(h);
              }
            });
          });
          console.log(res);
        });
    }
]);
app.controller('edit_loaicongviec', ['$scope', 'socket', '$modalInstance', 'editableOptions', 'editableThemes', 'lcv', 'phongban', 'congtachd',
    function($scope, socket, $modalInstance, editableOptions, editableThemes, lcv, phongban, congtachd) {
        $scope.phongban = phongban;
        $scope.lcv = lcv;
        $scope.congtachd = [];
        $scope.congtachd = congtachd;
        $scope.lcv.loaicongviec_new = lcv.loaicongviec;
        $scope.lcv.phongth_new = lcv.phongth;
        $scope.lcv.thutu_new = lcv.thutu;
        $scope.update_ct = function (ct) {
          socket.emit('update_congtachd', ct, function (data) {

          });
        };
        $scope.congtachd_moi = function (ct) {
          ct.loaicongviec = lcv._id;
          socket.emit('congtachd_moi', ct, function (data) {
            console.log(data);
            $scope.congtachd.push(data);
          });
        };
        $scope.ok = function() {
            console.log($scope.cv);

            socket.emit('update_loaicongviec', $scope.lcv, function(data) {
                console.log(data);
                lcv.loaicongviec = lcv.loaicongviec_new;
                lcv.phongth = lcv.phongth_new;
                $modalInstance.close();
            });
        };
        $
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
]);
app.controller('them_loaicongviec', ['$scope', 'socket', '$modalInstance', 'phongban', function($scope, socket, $modalInstance, phongban) {
    $scope.phongban = phongban;
    $scope.ok = function() {
        console.log($scope.lcv);
        socket.emit('them_loaicongviec', $scope.lcv, function(data) {
            console.log(data);
            $modalInstance.close(data);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('delete_lcv', ['$scope', 'socket', '$modalInstance', 'lcv', 'ac', function($scope, socket, $modalInstance, lcv, ac) {
    $scope.lcv = lcv;
    $scope.ac = ac;
    $scope.ok = function() {

        socket.emit('delete_lcv', $scope.lcv, function(data) {
            $modalInstance.close(lcv);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
// =======================
// * Quản lý chức danh   *
// =======================
app.controller('thietlap_duan_chucdanh', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', function($rootScope, $scope, socket, $http, $window, $stateParams, $modal) {
    $scope.loaicongviec = [];
    $scope.phongban = [];
    $scope.chucdanh = [];
    socket.emit('get_phongban', 1, function(data) {
        $scope.phongban = data;
    });
    socket.emit('get_loaicongviec', 1, function(data) {
        console.log(data);
        $scope.loaicongviec = data;
        $scope._loaicongviec = data[0];
    });
    socket.emit('get_chucdanh_duan', 1, function(data) {
        console.log(data);
        $scope.chucdanh = data;
    });
    $scope.chon_loaicongviec = function(item) {
        $scope._loaicongviec = item;
    };
    $scope.edit_chucdanh = function(cd) {
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/edit_chucdanh.htm',
            controller: 'edit_chucdanh',
            resolve: {
                chucdanh: function() {
                    return cd;
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
    $scope.them_chucdanh = function() {
        var modalInstance = $modal.open({
            templateUrl: 'module/quanly/modals/add_chucdanh.htm',
            controller: 'them_chucdanh',
            resolve: {
                lcv: function() {
                    return $scope._loaicongviec;
                }
            }
        });
        modalInstance.result.then(function(data) {
            $scope.chucdanh.push(data);
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.delete_chucdanh = function(cd) {
        var modalInstance = $modal.open({
            templateUrl: 'module/boxes/delete_content.htm',
            controller: 'delete_chucdanh',
            resolve: {
                chucdanh: function() {
                    return cd;
                },
                ac: function() {
                    return ({
                        title: 'Chức danh này sẽ bị xóa khỏi hệ thống',
                        noti: 'Chức danh tham gia trong dự án này sẽ bị xóa khỏi hệ thống!'
                    });
                }
            }
        });
        modalInstance.result.then(function(res) {
            console.log($scope.chucdanh.indexOf(res));
            $scope.chucdanh.splice($scope.chucdanh.indexOf(res), 1);
        }, function() {});
    };
}]);
app.controller('them_chucdanh', ['$scope', 'socket', '$modalInstance', 'lcv', function($scope, socket, $modalInstance, lcv) {
    $scope.chucdanh = {
        loaicongviec: lcv
    };
    $scope.ok = function() {
        console.log($scope.chucdanh);
        socket.emit('them_chucdanh', $scope.chucdanh, function(data) {
            console.log(data);
            $modalInstance.close(data);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('edit_chucdanh', ['$scope', 'socket', '$modalInstance', 'chucdanh', function($scope, socket, $modalInstance, chucdanh) {
    // $scope.phongban = phongban;
    $scope.chucdanh = chucdanh;
    $scope.chucdanh.chucdanh_new = chucdanh.chucdanh;
    // $scope.chucdanh.phongth_new = chucdanh.phongth;

    $scope.ok = function() {
        console.log($scope.cv);
        socket.emit('update_chucdanh', $scope.chucdanh, function(data) {
            console.log(data);
            chucdanh.chucdanh = $scope.chucdanh.chucdanh_new;
            $modalInstance.close();
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('delete_chucdanh', ['$scope', 'socket', '$modalInstance', 'chucdanh', 'ac', function($scope, socket, $modalInstance, chucdanh, ac) {
    $scope.chucdanh = chucdanh;
    $scope.ac = ac;
    $scope.ok = function() {
        socket.emit('delete_chucdanh', $scope.chucdanh, function(data) {
            $modalInstance.close(chucdanh);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);;
