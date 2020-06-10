'user strict';
//Controllers
// controller Thông tin dự án
app.controller('project_details', ['$scope', 'socket', '$http', '$stateParams', 'editableThemes', 'editableOptions', '$filter', '$modal', '$location', 'FileUploader', '$state',
    function ($scope, socket, $http, $stateParams, editableThemes, editableOptions, $filter, $modal, $location, FileUploader, $state) {
        // console.log($scope);
        $scope.param = $stateParams;
        $scope.project = {};
        $scope.get_nhansuhd = function (pid) {
            socket.emit('get_nhansu_hopdong', pid, function (data) {
                console.log(data);
                $scope.nhansuhd = data
            })
        }
        $scope.$emit('change overflow', 'auto');
        $scope.get_project = function () {
            socket.emit('get_project_details', $stateParams.p_id, function (data) {
                // console.log(data);
                // $scope.p = data;
                console.log(data);
                if (data) {
                    $scope.project = data;
                    $scope.get_nhansuhd(data._id);
                    $scope.$emit('get_project_details', data);
                    socket.emit('get_nhansu_duan', data._id, function (res) {
                        console.log(res)
                        $scope.nhansuduan = res;
                    })
                    socket.emit('get_projects_activities', $stateParams.p_id, null, function (data) {
                        console.log(data);
                        $scope.activities = data;

                    })
                } else {
                    $state.go('app.home.main')
                }
            });
        }

        $scope.get_project();

        // $scope.project = {};
        $scope.project = $scope.p;
        $scope.Math = Math;
        var uploader = $scope.uploader = new FileUploader({
            url: 'files/uploader/tmp',
            autoUpload: true
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/ , options) {
                return this.queue.length < 10;
            }
        });
        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        $scope.file_list = [];
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            // console.info('onCompleteItem', fileItem, response, status, headers);
            console.log(response);
            $scope.file_list.push(response.file);
            $scope.comment.files = $scope.file_list;
            console.log($scope.file_list);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        $scope.loaded = false;
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        // $scope.project.nhansu = [];

        $scope.update_project = function (ac) {
            console.log($scope.project);
            $scope.project.ac = ac;
            socket.emit('update_project', $scope.project, function (data) {
                $scope.activities.push(data);
            });
        };
        $scope.loaicongtrinh = [];
        socket.emit('get_loaicongtrinh', 1, function (data) {
            // console.log(data);
            $scope.loaicongtrinh = data;
            // $scope.project._loaicongtrinh = data.loaicongtrinh._id;
        });
        $scope.listchungchi = [];
        $scope.listchucdanh = [];
        $scope.loaicongviec = [];
        socket.emit('get_chungchi', 1, function (data) {
            // console.log(data);
            $scope.listchungchi = data;
        });
        socket.emit('get_chucdanh_duan', 1, function (data) {
            $scope.listchucdanh = data;
            // console.log(data);
        });
        socket.emit('get_loaicongviec', 1, function (data) {
            // console.log(data);
            $scope.loaicongviec = data;
        });
        $scope.delete_project = function (p) {
            // console.log(p);
            var modalInstance = $modal.open({
                templateUrl: 'module/boxes/delete_content.htm',
                controller: 'delete_project',
                size: 'md',
                resolve: {
                    p: function () {
                        return p;
                    },
                    ac: function () {
                        return {
                            title: 'Xóa dự án',
                            noti: 'Dự án' + p.project_title + ' sẽ bị xóa khỏi hệ thống. Hãy chắc chắn điều đó!'
                        };
                    }

                }
            });
            modalInstance.result.then(function (data) {
                $location.path('app/projects/list.html');
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.them_nhansu = function (hd) {
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/add_nhansu.htm',
                controller: 'them_nhansu',
                resolve: {
                    hd: function () {
                        return hd;
                    },
                    listchungchi: function () {
                        return $scope.listchungchi;
                    },
                    listchucdanh: function () {
                        return $scope.listchucdanh;
                    },
                    p: function () {
                        return $scope.project._id;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                // console.log(data);
                // $scope.project.nhansu.push(data.nss);
                // $scope.activities.push(data.acc);
                $scope.get_project()
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.sua_nhansu = function (ns, lcv) {
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/sua_nhansu.htm',
                controller: 'sua_nhansu',
                resolve: {
                    ns: function () {
                        return ns;
                    },
                    lcv: function () {
                        return lcv;
                    },
                    listchungchi: function () {
                        return $scope.listchungchi;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                // console.log(data);
                // $scope.project.nhansu.push(data);
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.delete_nhansu_duan = function (ns) {
            var modalInstance = $modal.open({
                templateUrl: 'module/boxes/delete_content.htm',
                controller: 'delete_nhansu_duan',
                resolve: {
                    ns: function () {
                        return ns;
                    },
                    ac: function () {
                        return ({
                            title: 'Xóa nhân sự dự án',
                            noti: 'Nhân sự này sẽ bị xóa khỏi dự án!'
                        });
                    }
                }
            });
            modalInstance.result.then(function (res) {
                // console.log($scope.project.nhansu.indexOf(res));
                // $scope.project.nhansu.splice($scope.project.nhansu.indexOf(res), 1);
                $scope.get_project()
            }, function () {});
        };

        $scope.them_goithau = function () {
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/add_goithau.htm',
                controller: 'them_goithau',
                resolve: {
                    goithauthuchien: function () {
                        return $scope.project.goithauthuchien;
                    },
                    loaicongviec: function () {
                        return $scope.loaicongviec;
                    },
                    project: function () {
                        return $scope.project._id;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                $scope.project.goithauthuchien = data.goithauthuchien;
                $scope.activities.push(data.acc);
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.theodoi = function () {
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/theodoi.htm',
                controller: 'theodoi_duan',
                resolve: {
                    project: function () {
                        return $scope.project;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                console.log(data);
                $scope.project.goithauthuchien = data;
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.add_emoji = function () {
            $scope.isAtListHidden_e = false;
        };
        socket.emit('get_dsnhanvien', 1, function (data) {
            $scope.dsnhanvien = data;
        });
        socket.emit('get_projects', 1, function (data) {
            // console.log(data);
            $scope.projects = data;
        });
        $scope.comment = {
            message: '',
            files: [],
            users: [],
            tags: [],
            projects: [],
            milestones: [],
        };
        socket.on('new project activity', function (data) {
            $scope.activities.push(data);
        });
        $scope.send_comment = function () {
            console.log($scope.comment);
            var data = {
                p: $stateParams.p_id,
                // project_code: $scope.p.project_code,
                message: $scope.comment.message.replace(/(?!".*)\n(?!.*")/g, '\\n'),
                files: $scope.comment.files,
                users: $scope.comment.users,
                tags: $scope.comment.tags,
                projects: $scope.comment.projects,
                milestones: $scope.comment.milestones
            };
            console.log($scope.comment.message.replace(/(?!".*)\n(?!.*")/g, '\\n'));
            socket.emit('project_comment', data, function (res) {
                console.log(res);
                // console.log($rootScope);
                $scope.activities.push(res);
                $scope.comment.message = '';
                $scope.comment.files = [];
                // $scope.uploader.queue = [];
                // $location.hash('bottom');
                // $anchorScroll();
            });
        }
        $scope.maubia = function () {
            console.log('OKK');
        }
        // $scope.project_comment = function() {
        //     var data = {
        //         p: $scope.p._id,
        //         project_code: $scope.p.project_code,
        //         message: $scope.comment.message.replace(/(?!".*)\n(?!.*")/g, '\\n'),
        //         files: $scope.comment.files,
        //         users: [],
        //         milestones: ''
        //     };
        //     // var message = $scope.comment.message
        //     // console.log(message);
        //     // var regex = /<\s*img.*?src\s*=\s*"\s*(.*?)\s*".*?\/?>/ig;
        //     // var emoji = message.match(regex);
        //     // emoji.forEach(function (e, i) {
        //     //   var patt1 = /\s*:\s*(([^\"';]*))\:/g;
        //     //
        //     //   var e_value = e.match(patt1);
        //     //   // console.log(val);
        //     //   var regex_e = new RegExp('<\\s*img alt\\=\\"\\' + e_value + '\\".*?src\\s*=\\s*"\\s*(.*?)\\s*".*?\\/?>', 'gi');
        //     //   // console.log(e);
        //     //   console.log(regex_e);
        //     //   // console.log(e_value[0]);
        //     //   message.replace(regex_e, e_value[0]);
        //     // });
        //     // // console.log(emoji);
        //     // console.log(message);
        //     console.log($scope.comment.message.replace(/(?!".*)\n(?!.*")/g, '\\n'));
        //     socket.emit('project_comment', data, function(res) {
        //         // console.log(res);
        //         $scope.p.activities.push(res);
        //         $scope.comment.message = '';
        //         $scope.comment.files = [];
        //         $scope.uploader.queue = [];
        //     });
        // };

    }
]);
app.controller('them_nhansu', ['$scope', 'socket', '$modalInstance', 'hd', 'listchungchi', 'listchucdanh', 'p',
    function ($scope, socket, $modalInstance, hd, listchungchi, listchucdanh, p) {
        $scope.listchucdanh = listchucdanh;
        // listchucdanh.forEach(function (cd, i) {
        //   if (cd.loaicongviec) {
        //     if (cd.loaicongviec._id === lcv._id) {
        //       $scope.listchucdanh.push(cd);
        //     }
        //   }
        // });
        $scope.listloaicongviec = [];
        socket.emit("get_loaicongviec", 1, function (data) {
            console.log(data)
            $scope.listloaicongviec = data
        })
        // $scope.lcv = lcv;
        $scope.listchucdanh = listchucdanh;
        $scope.listchungchi = listchungchi;
        $scope.ns = {
            hopdong: hd,
            project: p
        };
        $scope.ok = function () {
            // var data = {
            //     hopdong: hd,
            //     chucdanh: $scope.ns.chucdanh._id,
            //     nhansu: $scope.ns.nhansu._id
            // }
            console.log($scope.ns);
            socket.emit('them_nhansu_duan', $scope.ns, function (data) {
                // console.log(data);
                $modalInstance.close(data);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
app.controller('sua_nhansu', ['$scope', 'socket', '$modalInstance', 'ns', 'lcv', 'listchungchi',
    function ($scope, socket, $modalInstance, ns, lcv, listchungchi) {
        $scope.ns = ns;
        $scope.ns.nhansu_new = ns.nhansu;
        $scope.lcv = lcv;
        $scope.listchungchi = listchungchi;
        $scope.ok = function () {
            console.log($scope.ns);
            socket.emit('sua_nhansu_duan', $scope.ns, function (data) {
                // console.log(data);
                ns.nhansu = data.nhansu;
                $modalInstance.close();
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
app.controller('delete_nhansu_duan', ['$scope', 'socket', '$modalInstance', 'ns', 'ac',
    function ($scope, socket, $modalInstance, ns, ac) {
        $scope.ns = ns;
        $scope.ac = ac;
        // $scope.listchungchi = listchungchi;
        $scope.ok = function () {
            console.log($scope.ns);
            socket.emit('delete_nhansu_duan', $scope.ns, function (data) {
                // console.log(data);
                // ns.nhansu = data.nhansu;
                $modalInstance.close(ns);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
app.controller('them_goithau', ['$scope', 'socket', '$modalInstance', 'goithauthuchien', 'loaicongviec', 'project',
    function ($scope, socket, $modalInstance, goithauthuchien, loaicongviec, project) {
        // console.log(loaicongviec);
        // console.log(goithauthuchien);
        console.log(project);
        $scope.goithauthuchien_new = [];

        $scope.loaicongviec = loaicongviec;
        loaicongviec.forEach(function (lcv, i) {
            goithauthuchien.forEach(function (gtt, ii) {
                if (gtt._id === lcv._id) {
                    $scope.goithauthuchien_new.push(lcv);
                }
            });
        });
        $scope.dt = {
            project: project,
            goithauthuchien: $scope.goithauthuchien_new
        };
        $scope.chon_loaicongviec = function (item) {
            // console.log($scope.goithauthuchien_new);
        };
        $scope.ok = function () {
            socket.emit('them_goithau', $scope.dt, function (data) {
                goithauthuchien = data;
                $modalInstance.close(data);
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
app.controller('theodoi_duan', ['$scope', 'socket', '$modalInstance', 'project',
    function ($scope, socket, $modalInstance, project) {
        // console.log(loaicongviec);
        // console.log(goithauthuchien);
        $scope.flags = {};
        console.log(project);
        $scope.nhomhs = [];
        socket.emit('get_nhomhs', 1, function (data) {
            $scope.nhomhs = data;
            console.log(data);
        });
        // $scope.goithauthuchien_new = [];

        // $scope.loaicongviec = loaicongviec;
        // loaicongviec.forEach(function(lcv, i) {
        //     goithauthuchien.forEach(function(gtt, ii) {
        //         if (gtt._id === lcv._id) {
        //             $scope.goithauthuchien_new.push(lcv);
        //         }
        //     });
        // });
        $scope.dt = {
            project: project._id,
            tag: project.project_code,
            flags: JSON.stringify($scope.flags)
        };
        $scope.chon_loaicongviec = function (item) {
            console.log($scope.goithauthuchien_new);
        };
        $scope.ok = function () {
            var flags = JSON.stringify($scope.flags);
            $scope.dt.flags = flags;
            socket.emit('theodoi_duan', $scope.dt, function (res) {
                $modalInstance.close();
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
app.controller('delete_project', ['$scope', 'socket', '$modalInstance', 'p', 'ac', function ($scope, socket, $modalInstance, p, ac) {
    // console.log(dd);
    // console.log(ac);
    $scope.ac = ac;
    $scope.render = true;
    $scope.ok = function () {
        // console.log(p);
        socket.emit('delete_project', p, function (data) {
            if (data) {
                $modalInstance.close(data);
            }
        });
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