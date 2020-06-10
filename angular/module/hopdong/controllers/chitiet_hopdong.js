'use strict';

/* Controllers */
// projects controller
app.controller('chitiet_hopdong', ['$scope', 'socket', '$http', '$filter', 'applib', '$resource', '$stateParams', '$modal', 'editableOptions', 'editableThemes',
    function($scope, socket, $http, $filter, applib, $resource, $stateParams, $modal, editableOptions, editableThemes) {
        // console.log($stateParams);
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        $scope.hopdong = {
            giatri: [],
            nghiemthu: []
        };
        $scope.gt = {};
        var gethd = function() {
            socket.emit('get_chitiethopdong', $stateParams.hd_id, function(data) {
                $scope.hopdong = data;
            });
        };
        gethd();
        socket.emit('get_loaicongviec', 1, function(data) {
            $scope.lcv = data;
            $scope.gt.loaicongviec = data[0];
        });
        $scope.congtachd = [];
        socket.emit('get_congtachd', 1, function (data) {
          $scope.congtachd = data;
        });
        $scope.showStatus = function(ct) {
          var selected = $filter('filter')($scope.congtachd, {_id: ct._id});
          return (selected.length) ? selected[0].name : 'Not set';
        };
        $scope.update_hd_ct = function (g) {
          // console.log(g);
          socket.emit('update_hd_congtac', g, function (data) {

          });
        };
        $scope.nt_click = function(nt) {
            if (nt.collapse === true) {
                nt.collapse = false;
            } else {
                $scope.hopdong.nghiemthu.forEach(function(n, i) {
                    n.collapse = false;
                });
                nt.collapse = true;
            }
        };
        $scope.add_gthopdong = function(giatri) {
            $scope.gt.hd_id = $scope.hopdong._id;
            socket.emit('add_gthopdong', $scope.gt, function(data) {
                giatri.push(data);
                $scope.gt.hopdong = "";
                $scope.gt.nghiemthu = "";
            });
        };
        $scope.add_thanhtoan = function() {
            var modalInstance = $modal.open({
                templateUrl: 'module/hopdong/modals/add_thanhtoan.htm',
                controller: 'add_thanhtoan',
                size: '',
                resolve: {
                    hopdong: function() {
                        return $scope.hopdong;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {

            }, function() {

            });
        };
        $scope.add_chuyentien = function() {
            var modalInstance = $modal.open({
                templateUrl: 'module/hopdong/modals/add_chuyentien.htm',
                controller: 'add_chuyentien',
                size: '',
                resolve: {
                    hopdong: function() {
                        return $scope.hopdong;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {}, function() {

            });
        };
        $scope.update_giatri = function(gt) {
            // console.log(gt);
            socket.emit('update_giatri', gt, function(data) {
                // console.log(data);
            });
        };
        $scope.update_thanhtoan = function(tt) {
            // console.log(tt);
            socket.emit('update_thanhtoan', tt, function(data) {
                // console.log(data);
            });
        };
        $scope.update_chuyentien = function(tt) {
            // console.log(tt);
            socket.emit('update_chuyentien', tt, function(data) {
                // console.log(data);
            });
        };
        $scope.delete_giatri = function(gt) {
            var modalInstance = $modal.open({
                templateUrl: 'module/boxes/delete_content.htm',
                controller: 'delete_content',
                size: '',
                resolve: {
                    ac: function() {
                        return {
                            title: 'Xóa giá trị trong hợp đồng',
                            noti: 'Giá trị này sẽ bị xóa khỏi hợp đồng, hãy chắc chắn điều đó!'
                        };
                    }
                }
            });
            modalInstance.result.then(function(data) {
                socket.emit('delete_giatri', gt, function(data) {
                    gethd();
                });
            }, function() {

            });
        };
        $scope.delete_thanhtoan = function(tt) {
            var modalInstance = $modal.open({
                templateUrl: 'module/boxes/delete_content.htm',
                controller: 'delete_content',
                size: '',
                resolve: {
                    ac: function() {
                        return {
                            title: 'Xóa thanh toán trong hợp đồng',
                            noti: 'Thanh toán này sẽ bị xóa khỏi hợp đồng, hãy chắc chắn điều đó!'
                        };
                    }
                }
            });
            modalInstance.result.then(function(data) {
                socket.emit('delete_thanhtoan', tt, function(data) {
                    gethd();
                });
            }, function() {

            });
        };
        $scope.delete_chuyentien = function(tt) {
            var modalInstance = $modal.open({
                templateUrl: 'module/boxes/delete_content.htm',
                controller: 'delete_content',
                size: '',
                resolve: {
                    ac: function() {
                        return {
                            title: 'Xóa chuyển tiền trong hợp đồng',
                            noti: 'Thông tin chuyển tiền này sẽ bị xóa khỏi hợp đồng, hãy chắc chắn điều đó!'
                        };
                    }
                }
            });
            modalInstance.result.then(function(data) {
                socket.emit('delete_chuyentien', tt, function(data) {
                    gethd();
                });
            }, function() {

            });
        };
        $scope.print = function() {
            // window.print(1);

            console.log('OK');
            // window.printpdf();
        };
    }
]);
app.controller('add_thanhtoan', ['$scope', '$modalInstance', '$log', 'socket', 'hopdong', function($scope, $modalInstance, $log, socket, hopdong) {
    // console.log(hopdong);
    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.tt = {
        ngaythanhtoan: new Date(),
        hopdong: hopdong._id
    };
    $scope.format = 'dd-MM-yyyy';
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function() {
        // console.log($scope.tt);
        socket.emit('add_thanhtoan', $scope.tt, function(data) {
            hopdong.thanhtoan.push(data);
            $modalInstance.close();
        });
    };
}]);
app.controller('add_chuyentien', ['$scope', '$modalInstance', '$log', 'socket', 'hopdong', function($scope, $modalInstance, $log, socket, hopdong) {
    // console.log(hopdong);
    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.tt = {
        ngaychuyentien: new Date(),
        hopdong: hopdong._id
    };
    $scope.format = 'dd-MM-yyyy';
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function() {
        // console.log($scope.tt);
        socket.emit('add_chuyentien', $scope.tt, function(data) {
            hopdong.chuyentien.push(data);
            $modalInstance.close();
        });
    };
}]);
app.filter('highlight', function($sce) {
    return function(text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>');
        return $sce.trustAsHtml(text);
    };
});;

function printpdf(url) {
    console.log('OK');
    printJS('printJS-form', 'html')
}
