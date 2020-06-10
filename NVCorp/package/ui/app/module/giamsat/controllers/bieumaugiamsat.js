'user strict';
// Controllers
// controller mẫu hồ sơ
app.controller('bieumaugiamsat', ['$rootScope', '$scope', 'socket', '$http', 'applib', '$modal', function ($rootScope, $scope, socket, $http, applib, $modal) {
    var _loaicongviec = [];
    applib.setModule('projects');
    $scope.cacmauhoso = [];
    // $scope.getmauhoso = function () {
    //     socket.emit('get_mauhoso', 1, function (data) {
    //         console.log(data);
    //         $scope.mauhoso = data;
    //     });
    // }

    $scope.giaidoan = [];
    $scope.loaicongviec = [];
    // socket.emit('get_phongban', 1, function(data) {
    //     $scope.phongban = data;
    //     console.log(data);
    //     $scope.hs.phongth = data[0];
    //     socket.emit('get_giaidoan', 1, function(data) {
    //         $scope.giaidoan = data;
    //         $scope.hs.giaidoan = data[0];
    //     });
    //     socket.emit('get_loaicongviec', 1, function(loaicongviec) {
    //         $scope.loaicongviec = loaicongviec;
    //         console.log(loaicongviec);
    //         $scope.loaicongviec.forEach(function(lcv, i) {
    //             if (lcv.phongth._id === $scope.hs.phongth._id) {
    //                 $scope.hs.loaicongviec = lcv;
    //             }
    //         });
    //     });
    // });

    $scope.get_loaicongviec = function () {
        socket.emit('get loai cong viec thi cong', function (data) {
            console.log(data);
            $scope.loaicongviec = data;
            $scope.selected_lcv = data[0];
            $scope.get_listbm($scope.selected_lcv);
        });
    }
    $scope.get_loaicongviec();
    $scope.bieumaugiamsat = [];
    $scope.get_listbm = function (lcv) {
        console.log(lcv)
        socket.emit('get list bieu mau', lcv, function (data) {
            console.log(data);
            $scope.bieumaugiamsat = data;
        });
    };
    $scope.thanhphancongviec = {};
    socket.emit('get thanh phan cong viec giam sat', function (data) {
        $scope.thanhphancongviec = data;
    });
    // $scope.sortableOptions = {
    //     connectWith: '.connected'
    // };
    // $scope.sortableCallback = function (sourceModel, destModel, start, end, mauhs) {
    //     console.log('Dest');
    //     destModel.forEach(function (d, i) {
    //         console.log(d.milestone_name);
    //     });
    //     console.log('model');
    //     mauhs.forEach(function (m, i) {
    //         console.log(m.milestone_name);
    //     });
    //     console.log('Sort');
    //     // console.log(start + ' -> ' + end);
    //     var arr = move(mauhs, (start), (end));
    //     arr.forEach(function (h, i) {
    //         console.log(h.milestone_name);
    //     });
    //     socket.emit('sort_mauhoso', arr, function (data) {
    //         $scope.mauhoso = data;
    //     });
    // };
    // $scope.phongban = [];
    // $scope.user_details = $rootScope.user_details;
    // $scope.sortableOptions = {
    //     containment: '#table-container',
    //     containerPositioning: 'relative'
    // };
    // $scope.chon_phongth = function(phongth) {
    //     $scope.hs.phongth = phongth;
    //     $scope.loaicongviec.forEach(function(lcv, i) {
    //         if (lcv.phongth._id === phongth._id) {
    //             $scope.hs.loaicongviec = lcv;
    //         }
    //     });
    // };
    $scope.selected_lcv = {};
    $scope.chon_loaicongviec = function (lcv) {
        console.log(lcv);
        $scope.selected_lcv = lcv;
        // Get nội dung giám sát
        $scope.get_listbm(lcv);
    };
    $scope.themloaicongviec = function () {
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'themloaicongviec.html',
            controller: 'themloaicongviec',
            resolve: {
                lcv: function () {
                    return $scope.selected_lcv;
                },  
                tps: function () {
                    return $scope.thanhphancongviec;
                }
            }
        });
        modalInstance.result.then(function (data) {
            $scope.get_loaicongviec();
        }, function () {

        });
    }
    // $scope.nhomhs = [];
    // socket.emit('get_nhomhs', 1, function (data) {
    //     $scope.nhomhs = data;
    // });


    // $scope.ok = function () {
    //     console.log($scope.hs);
    // };

    // $scope.cancel = function () {
    //     $uibModalInstance.dismiss('cancel');
    // };
    $scope.themnoidung = function () {
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'themnoidung',
            resolve: {
                lcv: function () {
                    return $scope.selected_lcv;
                },
                tps: function () {
                    return $scope.thanhphancongviec;
                }
            }
        });
        modalInstance.result.then(function (data) {
            $scope.get_listbm($scope.selected_lcv)
        }, function () {

        });
    };
    $scope.suanoidung = function (nd) {
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'suahoso.html',
            controller: 'suanoidung',
            resolve: {
                nd: function () {
                    return nd;
                },
                tps: function () {
                    return $scope.thanhphancongviec;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            // $ctrl.selected = selectedItem;
            $scope.get_listbm($scope.selected_lcv)
        }, function () {
            console.log('OK');
        });
    };
    $scope.xoanoidung = function (nd) {
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'xoanoidung.html',
            controller: 'xoanoidung',
            resolve: {
                nd: function () {
                    return nd;
                }
            }
        });

        modalInstance.result.then(function (data) {
            $scope.mauhoso = data;
        }, function () {
            console.log('OK');
        });
    };
}]);
app.filter('mhsfilter', function () {
    return function (items, props) {
        var out = [];
        // console.log(props);
        if (angular.isArray(items)) {
            items.forEach(function (item) {
                // console.log(item);
                if (item.loaicongviec._id == props.loaicongviec._id) {
                    // console.log(item);
                    out.push(item);
                }
                // var itemMatches = false;
                //
                // var keys = Object.keys(props);
                // for (var i = 0; i < keys.length; i++) {
                //     var prop = keys[i];
                //     var text = props[prop].toLowerCase();
                //     if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                //         itemMatches = true;
                //         break;
                //     }
                // }
                //
                // if (itemMatches) {
                //     out.push(item);
                // }
            });
        } else {
            // Let the output be the input untouched
            out = [];
        }

        return out;
    };
});

app.controller('themloaicongviec', function ($modalInstance, $scope, socket, lcv, tps) {
    $scope.loaicongviec = "";
    $scope.ok = function () {
        socket.emit('them loai cong viec giam sat', $scope.loaicongviec, function () {
            $modalInstance.close()
        })
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('themnoidung', function ($modalInstance, $scope, socket, lcv, tps) {
    console.log(lcv);
    $scope.thanhphancongviec = tps;
    $scope.bm = {};
    $scope.bm.tp = tps[0];
    $scope.tieuchiphu = [];
    $scope.lcv = lcv;
    $scope.add_sub = function () {
        $scope.tieuchiphu.push({
            tieuchi: "",
            phuongthuc: ""
        })
    }
    $scope.delete_sub = function (i) {
        console.log(i);
        $scope.tieuchiphu.splice(i, 1);

    }
    $scope.ok = function () {
        $scope.bm.lcv = lcv;
        $scope.bm.tieuchiphu = $scope.tieuchiphu
        socket.emit('add noi dung giam sat', $scope.bm, function (data) {
            $modalInstance.close();
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('suanoidung', function ($modalInstance, $scope, socket, nd, tps) {
    console.log(nd);

    $scope.thanhphancongviec = tps;
    $scope.nd = nd;
    $scope.nd.noidungdanhgia_new = nd.noidungdanhgia;
    $scope.nd.phuongthucdanhgia_new = nd.phuongthucdanhgia;
    if (nd.tieuchiphu) {
        $scope.nd.tieuchiphu_new = nd.tieuchiphu;
    } else {
        $scope.nd.tieuchiphu_new = [];
    }
    tps.forEach(function (e, i) {
        if (nd.thanhphancongviec._id == e._id) {
            $scope.nd.tp = e;
        }
    });
    $scope.add_sub = function () {
        $scope.nd.tieuchiphu_new.push({
            tieuchi: "",
            phuongthuc: ""
        })
    }
    $scope.delete_sub = function (i) {
        console.log(i);
        $scope.nd.tieuchiphu_new.splice(i, 1);

    }
    // $scope.lcv = lcv;
    $scope.ok = function () {
        // console.log($scope.mauhs);
        socket.emit('update noi dung giam sat', $scope.nd, function (data) {
            console.log($scope.nd);
            nd.noidungdanhgia = $scope.nd.noidungdanhgia_new;
            nd.phuongthucdanhgia = $scope.nd.phuongthucdanhgia_new;
            $modalInstance.close();
        });
        // $scope.mauhs.nhomhs_id = $scope.hs.nhomhs.id;
        // console.log($scope.mauhs);
        // socket.emit('suamauhoso', $scope.mauhs);
        // $modalInstance.close($scope.mauhs);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('xoanoidung', function ($modalInstance, $scope, socket, nd) {

    $scope.ok = function () {
        socket.emit('xoa noi dung giam sat', nd, function (data) {
            nd.deleted = true;
            $modalInstance.close(nd);
        });
        // $scope.mauhs.deleted = 1;
        // socket.emit('suamauhoso', $scope.mauhs);
        // $modalInstance.close($scope.mauhs);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});