'use strict';

/* Controllers */
// projects controller
app.controller('congvan', ['$scope', 'socket', '$http', 'applib', '$resource', "$filter", '$modal', 'FileUploader',
 function($scope, socket, $http, applib, $resource, $filter, $modal, FileUploader) {

    var uploader = $scope.uploader = new FileUploader({
        url: 'phaply/uploader',
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

    $scope.listcongvan = [];
    $scope.them_congvan = function() {
        var modalInstance = $modal.open({
            templateUrl: 'module/phaply/modals/add_congvan.htm',
            controller: 'them_congvan',
            size: '',
            resolve: {

            }
        });

        modalInstance.result.then(function(data) {
            $scope.listcongvan.push(data);
        }, function() {

        });
    };
    $scope.sua_congvan = function(cv) {
        // console.log(cv);
        var modalInstance = $modal.open({
            templateUrl: 'module/phaply/modals/sua_congvan.htm',
            controller: 'sua_congvan',
            size: '',
            resolve: {
                cv: function() {
                    return cv;
                }
            }
        });

        modalInstance.result.then(function(data) {
            cv.tencongvan = data.tencongvan;
            cv.socongvan = data.socongvan;
            cv.ngayky = data.ngayky;
            cv.noinhan = data.noinhan;
        }, function() {

        });
    };
    $scope.xoa_congvan = function(cv) {
        // console.log(cv);
        var modalInstance = $modal.open({
            templateUrl: 'module/boxes/delete_content.htm',
            controller: 'xoa_congvan',
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
            for (var i = 0; i < $scope.listcongvan.length; i++) {
                if ($scope.listcongvan[i]._id == data._id) {
                    $scope.listcongvan.splice(i, 1);
                }
            }
        }, function() {

        });
    };
    $scope.sl = 15;
    // $scope.or_listhopdong = [];

    socket.emit('get_congvan', 1, function(data) {
        $scope.listcongvan = data;
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
            controller: 'xoa_congvan_file',
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
    $scope.incongvan = function(id) {
        window.printJS('phaply/get/' + id);
    };


}]);
app.controller('them_congvan', ['$scope', '$modalInstance', '$log', 'socket', function($scope, $modalInstance, $log, socket) {
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function() {
        socket.emit('them_congvan', $scope.cv, function(data) {
            $modalInstance.close(data);
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('sua_congvan', ['$scope', '$modalInstance', '$log', 'socket', 'cv', function($scope, $modalInstance, $log, socket, cv) {
    $scope.cv = {
        _id: cv._id,
        tencongvan_new: cv.tencongvan,
        socongvan_new: cv.socongvan,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function() {
        socket.emit('sua_congvan', $scope.cv, function(data) {
            $modalInstance.close(data);
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('xoa_congvan', ['$scope', '$modalInstance', '$log', 'socket', 'cv', 'ac', function($scope, $modalInstance, $log, socket, cv, ac) {
    $scope.ac = ac;
    $scope.cv = {
        _id: cv._id,
        tencongvan_new: cv.tencongvan,
        socongvan_new: cv.socongvan,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.ok = function() {
        socket.emit('xoa_congvan', $scope.cv, function(data) {
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
app.controller('xoa_congvan_file', ['$scope', '$modalInstance', '$log', 'socket', 'cv', 'ac', function($scope, $modalInstance, $log, socket, cv, ac) {
    $scope.ac = ac;
    $scope.cv = {
        _id: cv._id,
        tencongvan_new: cv.tencongvan,
        socongvan_new: cv.socongvan,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.ok = function() {
        socket.emit('xoa_congvan_file', cv, function(data) {
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
