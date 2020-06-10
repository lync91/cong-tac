'use strict';

/* Controllers */
// projects controller
app.controller('chungchi_details', ['$scope', 'socket', '$http', 'applib', '$resource', "$filter", '$modal', 'FileUploader', function($scope, socket, $http, applib, $resource, $filter, $modal, FileUploader) {
    $scope.Math = Math;
    var uploader = $scope.uploader = new FileUploader({
        url: 'phaply/chungchi/uploader',
        autoUpload: true
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    // console.info('uploader', uploader);
    $scope.loaicongtrinh = [];
    $scope.listchungchi = [{
      chungchi: []
    }];
    $scope.loaichungchi = [];
    $scope.lsduan = [];
    $scope.trinhdo = [];
    socket.emit('get_loaicongtrinh', 1, function (data) {
      // console.log(data);
      $scope.loaicongtrinh = data;
    });
    socket.emit('get_projects', 1, function (data) {
      // console.log(data);
      $scope.lsduan = data;
    });
    socket.emit('get_loaichungchi', 1, function (data) {
      // console.log(data);
      $scope.loaichungchi = data;
    });
    socket.emit('get_trinhdo', 1, function (data) {
      $scope.trinhdo = data;
    });
    $scope.them_nhansu = function() {
        // console.log(u);
        var modalInstance = $modal.open({
            templateUrl: 'module/phaply/modals/add_nhansu.htm',
            controller: 'them_nhansu',
            size: '',
            resolve: {
              trinhdo: function () {
                return $scope.trinhdo;
              }
            }
        });
        modalInstance.result.then(function(data) {
            $scope.listchungchi.push(data);
        }, function() {

        });
    };
    $scope.them_chungchi = function(u) {
        // console.log(u);
        var modalInstance = $modal.open({
            templateUrl: 'module/phaply/modals/add_chungchi.htm',
            controller: 'them_chungchi',
            size: '',
            resolve: {
              u: function () {
                return u;
              },
              lct: function () {
                return $scope.loaicongtrinh;
              },
              lcc: function () {
                return $scope.loaichungchi;
              }
            }
        });

        modalInstance.result.then(function(data) {
            u.chungchi.push(data);
        }, function() {

        });
    };
    $scope.sua_chungchi = function(cv) {
        // console.log(cv);
        var modalInstance = $modal.open({
            templateUrl: 'module/phaply/modals/sua_chungchi.htm',
            controller: 'sua_chungchi',
            size: '',
            resolve: {
                cv: function() {
                    return cv;
                }
            }
        });

        modalInstance.result.then(function(data) {
            cv.tenchungchi = data.tenchungchi;
            cv.sochungchi = data.sochungchi;
            cv.ngayky = data.ngayky;
            cv.noinhan = data.noinhan;
        }, function() {

        });
    };
    $scope.xoa_chungchi = function(u, cv) {
        // console.log(cv);
        var modalInstance = $modal.open({
            templateUrl: 'module/boxes/delete_content.htm',
            controller: 'xoa_chungchi',
            size: '',
            resolve: {
                cv: function() {
                    return cv;
                },
                ac: function() {
                    return {
                        title: 'Xóa chứng chỉ',
                        noti: 'Chứng chỉ này sẽ bị xóa khỏi hệ thống, hãy cân nhắc'
                    };
                }
            }
        });

        modalInstance.result.then(function(data) {
            for (var i = 0; i < u.chungchi.length; i++) {
                if (u.chungchi[i]._id == data._id) {
                    u.chungchi.splice(i, 1);
                }
            }
        }, function() {

        });
    };
    $scope.sl = 15;
    // $scope.or_listhopdong = [];

    socket.emit('get_chungchi', 1, function(data) {
        // console.log(data);
        $scope.listchungchi = data;
        // $scope.or_listhopdong = data;
    });
    $scope.config = {
        itemsPerPage: 15,
        maxPages: 5,
        fillLastPage: "yes"
    };
    $scope.updateFilteredList = function() {
        // console.log('OK');
        $scope.listhopdong = $filter("filter")($scope.or_listhopdong, $scope.search);
    };
    $scope.xoa_file = function(res) {
        var modalInstance = $modal.open({
            templateUrl: 'module/boxes/delete_content.htm',
            controller: 'xoa_chungchi_file',
            size: '',
            resolve: {
                cv: function() {
                    return res;
                },
                ac: function() {
                    return {
                        title: 'Xóa công văn',
                        noti: 'Công văn này sẽ bị xóa khỏi hệ thống, hãy cân nhắc'
                    };
                }
            }
        });

        modalInstance.result.then(function(data) {
            for (var i = 0; i < res.cv.files.length; i++) {
                if (res.cv.files[i]._id == data.file._id) {
                    res.cv.files.splice(i, 1);
                }
            }
        }, function() {

        });

    };
    $scope.giaonhanhs = function(m, ac) {
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'module/phaply/modals/giaonhanhs.htm',
            controller: 'giaonhanhs',
            controllerAs: '$ctrl',
            size: 'm',
            resolve: {
                m: function() {
                    return m;
                },
                duan: function () {
                    return $scope.lsduan;
                },
                nv: function() {
                    return $scope.listchungchi;
                },
                pb: function() {
                    return $scope.dsphongban;
                },
                ac: function() {
                    return ac;
                }
            }
        });
        modalInstance.result.then(function(data) {
            m.chungchiluu.push(data);
            socket.emit('get_chungchiluu', data, function (ccl) {
              bbgiaonhan(ccl);
            });
        }, function() {
            // console.log('OK');
        });
    };
    var bbgiaonhan = function(bb) {
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'module/phaply/modals/bb_giaonhan.htm',
            controller: 'bbgiaonhan',
            controllerAs: '$ctrl',
            resolve: {
                bb: function() {
                    return bb;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            // $ctrl.selected = selectedItem;
        }, function() {
            // console.log('OK');
        });
    };
    $scope.inchungchi = function(id) {
        window.printJS('phaply/get/' + id);
    };


}]);
app.controller('them_chungchi', ['$scope', '$modalInstance', '$log', 'socket', 'u', 'lct', 'lcc', function($scope, $modalInstance, $log, socket, u, lct, lcc) {
    // console.log(lct);
    $scope.loaicongtrinh = lct;
    $scope.loaichungchi = lcc;
    $scope.hang = [{hang: 1}, {hang: 2}, {hang: 3}];
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.ok = function() {
        $scope.cc.user = u._id;
        socket.emit('them_chungchi', $scope.cc, function(data) {
            // console.log('OK');
            // console.log(data);
            $modalInstance.close(data);
        });
        // console.log($scope.cc);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('them_nhansu', ['$scope', '$modalInstance', '$log', 'socket', 'trinhdo', function($scope, $modalInstance, $log, socket, trinhdo) {
    // console.log(lct);
    console.log(trinhdo);
    $scope.trinhdo = trinhdo;
    // $scope.hang = [{hang: 1}, {hang: 2}, {hang: 3}];
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.ok = function() {
        // $scope.cc.user = u._id;
        console.log($scope.u);
        socket.emit('them_canhan', $scope.u, function(data) {
            $modalInstance.close(data);
        });
        // console.log($scope.cc);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('sua_chungchi', ['$scope', '$modalInstance', '$log', 'socket', 'cv', function($scope, $modalInstance, $log, socket, cv) {
    $scope.cv = {
        _id: cv._id,
        tenchungchi_new: cv.tenchungchi,
        sochungchi_new: cv.sochungchi,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function() {
        socket.emit('sua_chungchi', $scope.cv, function(data) {
            $modalInstance.close(data);
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('xoa_chungchi', ['$scope', '$modalInstance', '$log', 'socket', 'cv', 'ac', function($scope, $modalInstance, $log, socket, cv, ac) {
    $scope.ac = ac;
    $scope.cv = cv;
    $scope.ok = function() {
        console.log('OKKKKKK');
        socket.emit('xoa_chungchi', $scope.cv, function(data) {
            console.log(data);
            if (data.ok === 1) {
                $modalInstance.close(cv);
            }
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('xoa_chungchi_file', ['$scope', '$modalInstance', '$log', 'socket', 'cv', 'ac', function($scope, $modalInstance, $log, socket, cv, ac) {
    $scope.ac = ac;
    $scope.cv = {
        _id: cv._id,
        tenchungchi_new: cv.tenchungchi,
        sochungchi_new: cv.sochungchi,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.ok = function() {
        socket.emit('xoa_chungchi_file', cv, function(data) {
            console.log(data);
            if (data.ok === 1) {
              $modalInstance.close(cv);
            }
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('giaonhanhs', function($modalInstance, $scope, $rootScope, socket, Blob, m, duan, nv, pb, ac) {
    $scope.cc = {
      _id: m._id,
      user: m.user,
      loaichungchi: m.loaichungchi,
      loaicongtrinh: m.loaicongtrinh,
      sl: 1,
      ac: ac
    };
    $scope.duan = duan;
    $scope.nv = nv;
    // $scope.cc.sl
    // console.log(hs);
    // $scope.hsnhan = hs;
    $scope.sl_tru = function() {
        if ($scope.cc.sl > 0) {
            $scope.cc.sl -= 1;
        }
    };
    $scope.sl_cong = function() {
        $scope.cc.sl += 1;
    };
    $scope.update_luuhs = function() {
        console.log($scope.cc);
        socket.emit('giaonhancc', $scope.cc, function (data) {
          $modalInstance.close(data);
        });

    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('bbgiaonhan', function($modalInstance, $scope, $rootScope, Blob, socket, bb) {
    $scope.bb = bb;
    console.log(bb);
    // var data;
    // socket.emit('bb_giaonhan', bb, function(res) {
    //     console.log(res);
    //     data = new Blob([res.buffer], {
    //         type: 'application/pdf;utf-8'
    //     });
    //     var objectURL = URL.createObjectURL(data);
    //     console.log(objectURL);
    //     // window.printpdf(objectURL);
    //     // FileSaver.saveAs(data, 'bbgiaonhan.pdf');
    // });
    $scope.print = function() {
        // var objectURL = URL.createObjectURL(data);
        window.printpdf('phaply/bbgiaonhancc/' + bb._id);
    };
    $scope.save = function() {
        // FileSaver.saveAs(data, 'bbgiaonhan.pdf');
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
app.filter('slhoso', function() {
    return function(input) {
        var output = 0;
        var giao = 0;
        var nhan = 0;
        input.forEach(function(h, i) {
            if (h.ac == 'nhan') {
                nhan += h.soluong;
            } else if (h.ac == 'giao') {
                giao += h.soluong;
            }
        });
        return nhan - giao;
    };

});

function printpdf(url) {
    printJS(url);
}
