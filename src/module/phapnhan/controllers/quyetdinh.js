'use strict';

/* Controllers */
// projects controller
app.controller('quyetdinh', ['$scope', 'socket', '$http', 'applib', '$resource', "$filter", '$modal', 'FileUploader',
  function($scope, socket, $http, applib, $resource, $filter, $modal, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: 'phaply/quyetdinh/uploader',
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

    console.info('uploader', uploader);

    $scope.listquyetdinh = [];
    $scope.them_quyetdinh = function() {
        var modalInstance = $modal.open({
            templateUrl: 'module/phaply/modals/add_quyetdinh.htm',
            controller: 'them_quyetdinh',
            size: '',
            resolve: {
            }
        });

        modalInstance.result.then(function(data) {
            $scope.listquyetdinh.push(data);
        }, function() {

        });
    };
    $scope.sua_quyetdinh = function(cv) {
        // console.log(cv);
        var modalInstance = $modal.open({
            templateUrl: 'module/phaply/modals/sua_quyetdinh.htm',
            controller: 'sua_quyetdinh',
            size: '',
            resolve: {
                cv: function() {
                    return cv;
                }
            }
        });

        modalInstance.result.then(function(data) {
            cv.tenquyetdinh = data.tenquyetdinh;
            cv.soquyetdinh = data.soquyetdinh;
            cv.ngayky = data.ngayky;
            cv.noinhan = data.noinhan;
        }, function() {

        });
    };
    $scope.xoa_quyetdinh = function(cv) {
        // console.log(cv);
        var modalInstance = $modal.open({
            templateUrl: 'module/boxes/delete_content.htm',
            controller: 'xoa_quyetdinh',
            size: '',
            resolve: {
                cv: function() {
                    return cv;
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
            for (var i = 0; i < $scope.listquyetdinh.length; i++) {
                if ($scope.listquyetdinh[i]._id == data._id) {
                    $scope.listquyetdinh.splice(i, 1);
                }
            }
        }, function() {

        });
    };
    $scope.sl = 15;
    // $scope.or_listhopdong = [];

    socket.emit('get_quyetdinh', 1, function(data) {
        $scope.listquyetdinh = data;
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
            controller: 'xoa_quyetdinh_file',
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
    $scope.inquyetdinh = function(id) {
        window.printJS('phaply/get/' + id);
    };


}]);
app.controller('them_quyetdinh', ['$scope', '$modalInstance', '$log', 'socket', function($scope, $modalInstance, $log, socket) {
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function() {
        socket.emit('them_quyetdinh', $scope.cv, function(data) {
            $modalInstance.close(data);
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('sua_quyetdinh', ['$scope', '$modalInstance', '$log', 'socket', 'cv', function($scope, $modalInstance, $log, socket, cv) {
    $scope.cv = {
        _id: cv._id,
        tenquyetdinh_new: cv.tenquyetdinh,
        soquyetdinh_new: cv.soquyetdinh,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function() {
        socket.emit('sua_quyetdinh', $scope.cv, function(data) {
            $modalInstance.close(data);
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('xoa_quyetdinh', ['$scope', '$modalInstance', '$log', 'socket', 'cv', 'ac', function($scope, $modalInstance, $log, socket, cv, ac) {
    $scope.ac = ac;
    $scope.cv = {
        _id: cv._id,
        tenquyetdinh_new: cv.tenquyetdinh,
        soquyetdinh_new: cv.soquyetdinh,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.ok = function() {
        socket.emit('xoa_quyetdinh', $scope.cv, function(data) {
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
app.controller('xoa_quyetdinh_file', ['$scope', '$modalInstance', '$log', 'socket', 'cv', 'ac', function($scope, $modalInstance, $log, socket, cv, ac) {
    $scope.ac = ac;
    $scope.cv = {
        _id: cv._id,
        tenquyetdinh_new: cv.tenquyetdinh,
        soquyetdinh_new: cv.soquyetdinh,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.ok = function() {
        socket.emit('xoa_quyetdinh_file', cv, function(data) {
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

function printpdf(url) {
    printJS(url);
}
