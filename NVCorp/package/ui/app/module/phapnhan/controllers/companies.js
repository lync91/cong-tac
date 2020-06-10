'use strict';

/* Controllers */
// projects controller
app.controller('phongban', ['$scope', 'socket', '$http', 'applib', '$resource', "$filter", '$modal', '$state',
    function ($scope, socket, $http, applib, $resource, $filter, $modal, $state) {
        $scope.param = {
            mod: 'phongban'
        }
        $scope.companies = [];
        socket.emit('get_phongban', 1, function (data) {
            $scope.companies = data;
        });

    }
]);

app.controller('doitac', ['$scope', 'socket', '$http', 'applib', '$resource', "$filter", '$modal',
    function ($scope, socket, $http, applib, $resource, $filter, $modal) {
        $scope.param = {
            mod: 'doitac'
        }
        $scope.companies = [];
        socket.emit('get_phapnhan', 1, function (data) {
            $scope.companies = data;
        });
        $scope.them_phapnhan = function (phapnhan_id) {
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/them_chudautu.htm',
                controller: 'them_phapnhan',
                resolve: {
                    phapnhan_id: function () {
                        return 2;
                    }
                }
            });
            modalInstance.result.then(function (phapnhan) {
                $scope.companies.push(phapnhan);
                $scope.hd.dvthuchien = phapnhan;
            }, function () {});
        };
        $scope.sua_phapnhan = function (c) {
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/sua_phapnhan.htm',
                controller: 'sua_phapnhan',
                resolve: {
                    c: function () {
                        return c;
                    },

                }
            });
            modalInstance.result.then(function (phapnhan) {}, function () {});
        };
        $scope.xoa_phapnhan = function (c) {
            var modalInstance = $modal.open({
                templateUrl: 'module/boxes/delete_content.htm',
                controller: 'xoa_phapnhan',
                resolve: {
                    c: function () {
                        return c;
                    },
                    ac: function () {
                        return {
                            title: 'Xóa đối tác',
                            noti: 'Đối tác này sẽ bị xóa khỏi hệ thống !'
                        }
                    }
                }
            });
            modalInstance.result.then(function (phapnhan) {}, function () {});
        }

    }
]);

app.controller('chudautu', ['$scope', 'socket', '$http', 'applib', '$resource', "$filter", '$modal',
    function ($scope, socket, $http, applib, $resource, $filter, $modal) {
        $scope.param = {
            mod: "chudautu"
        }
        $scope.companies = [];
        socket.emit('get_chudautu', 1, function (data) {
            $scope.companies = data;
        });
        $scope.them_phapnhan = function (phapnhan_id) {
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/them_chudautu.htm',
                controller: 'them_phapnhan',
                resolve: {
                    phapnhan_id: function () {
                        return 1;
                    },
                }
            });
            modalInstance.result.then(function (phapnhan) {
                $scope.companies.push(phapnhan);
                $scope.hd.dvthuchien = phapnhan;
            }, function () {});
        };
        // $scope.selected_c = {};
        $scope.sua_phapnhan = function (c) {
            var modalInstance = $modal.open({
                templateUrl: 'module/projects/modal/sua_phapnhan.htm',
                controller: 'sua_phapnhan',
                resolve: {
                    c: function () {
                        return c;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                // $scope.selected_c = data;
            }, function () {});
        };
        $scope.xoa_phapnhan = function (c) {
            var modalInstance = $modal.open({
                templateUrl: 'module/boxes/delete_content.htm',
                controller: 'xoa_phapnhan',
                resolve: {
                    c: function () {
                        return c;
                    },
                    ac: function () {
                        return {
                            title: 'Xóa đối tác',
                            noti: 'Đối tác này sẽ bị xóa khỏi hệ thống !'
                        }
                    }
                }
            });
            modalInstance.result.then(function (data) {
                $scope.companies.forEach(function (c, i) {
                    if (c._id == data._id) {
                        $scope.companies.splice(i, 1);
                    }
                })
            }, function () {});
        }
    }
]);
app.controller('them_phapnhan', ['$scope', '$modalInstance', 'socket', 'phapnhan_id', function ($scope, $modalInstance, socket, phapnhan_id) {
    $scope.title = 'Chủ đầu tư';
    if (phapnhan_id == 2) {
        $scope.title = 'Đối tác';
    }
    $scope.ok = function () {
        $scope.cdt.phapnhan_id = phapnhan_id;
        socket.emit('them_phapnhan', $scope.cdt, function (data) {
            $modalInstance.close(data);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('sua_phapnhan', ['$scope', '$modalInstance', 'socket', 'c', function ($scope, $modalInstance, socket, c) {
    $scope.title = 'Chủ đầu tư';
    $scope.cdt = c;
    $scope.cdt.company_name_new = c.company_name;
    $scope.cdt.company_address_new = c.company_address;
    $scope.cdt.company_phone_new = c.company_phone;
    $scope.cdt.company_fax_new = c.company_fax;
    $scope.cdt.company_VAT_new = c.company_VAT;
    if (c.phapnhan_id == 2) {
        $scope.title = 'Đối tác';
    }
    $scope.ok = function () {
        // $scope.phapnhan_id = phapnhan_id;
        socket.emit('sua_phapnhan', $scope.cdt, function (data) {
            $modalInstance.close(data);
            c.company_name = $scope.cdt.company_name_new;
            c.company_address = $scope.cdt.company_address_new;
            c.company_phone = $scope.cdt.company_phone_new;
            c.company_fax = $scope.cdt.company_fax_new;
            c.company_VAT = $scope.cdt.company_VAT_new;
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('xoa_phapnhan', ['$scope', '$modalInstance', 'socket', 'c', 'ac', function ($scope, $modalInstance, socket, c, ac) {
    $scope.ac = ac,
        $scope.ok = function () {
            // $scope.phapnhan_id = phapnhan_id;
            socket.emit('xoa_phapnhan', c, function (data) {
                $modalInstance.close(c);
            });
        };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('chitiet', ['$scope', '$stateParams', 'socket', '$http', 'applib', '$resource', "$filter", '$modal', 'editableOptions', 'editableThemes',
    function ($scope, $stateParams, socket, $http, applib, $resource, $filter, $modal, editableOptions, editableThemes) {
        // console.log($stateParams);
        $scope.param = $stateParams;
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';

        $scope.company = [];
        socket.emit('get_company', $stateParams.id, function (data) {
            $scope.company = data;
            socket.emit('get_company_user', $stateParams.id, function (us) {
                $scope.users = us;
            });
        });
        $scope.update_c = function (c) {
            console.log(c);
            socket.emit('update_company_details', c, function (res) {
                // $scope.company =
            });
        }
    }
]);
app.controller('edit_phapnhan', ['$scope', '$stateParams', 'socket', '$http', 'applib', '$resource', "$filter", '$modal', 'editableOptions', 'editableThemes', '$state',
    function ($scope, $stateParams, socket, $http, applib, $resource, $filter, $modal, editableOptions, editableThemes, $state) {
        // console.log($stateParams);   
        console.log($stateParams);
        $scope.param = $stateParams;
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';

        $scope.company = [];
        socket.emit('get_company', $stateParams.id, function (data) {
            console.log(data);
            $scope.company = data;
            socket.emit('get_company_user', $stateParams.id, function (us) {
                $scope.users = us;
            });
            socket.emit('get danh sach lanh dao', 'giamdoc', function (data) {
                $scope.dslanhdao = data;
                console.log(data);
            })
            socket.emit('get danh sach lanh dao', 'truongphong', function (data) {
                $scope.dstruongphong = data;
                console.log(data);
            })
        });
        $scope.update_c = function (c) {
            console.log(c);
            socket.emit('update_company_details', c, function (res) {
                // $scope.company =
                $state.go('app.phapnhan.chitiet', $scope.param)
            });
        }
    }
]);
app.controller('them_quyetdinh', ['$scope', '$modalInstance', '$log', 'socket', function ($scope, $modalInstance, $log, socket) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function () {
        socket.emit('them_quyetdinh', $scope.cv, function (data) {
            $modalInstance.close(data);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('sua_quyetdinh', ['$scope', '$modalInstance', '$log', 'socket', 'cv', function ($scope, $modalInstance, $log, socket, cv) {
    $scope.cv = {
        _id: cv._id,
        tenquyetdinh_new: cv.tenquyetdinh,
        soquyetdinh_new: cv.soquyetdinh,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.ok = function () {
        socket.emit('sua_quyetdinh', $scope.cv, function (data) {
            $modalInstance.close(data);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('xoa_quyetdinh', ['$scope', '$modalInstance', '$log', 'socket', 'cv', 'ac', function ($scope, $modalInstance, $log, socket, cv, ac) {
    $scope.ac = ac;
    $scope.cv = {
        _id: cv._id,
        tenquyetdinh_new: cv.tenquyetdinh,
        soquyetdinh_new: cv.soquyetdinh,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.ok = function () {
        socket.emit('xoa_quyetdinh', $scope.cv, function (data) {
            console.log(data);
            if (data.ok === 1) {
                $modalInstance.close(cv);
            }
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('xoa_quyetdinh_file', ['$scope', '$modalInstance', '$log', 'socket', 'cv', 'ac', function ($scope, $modalInstance, $log, socket, cv, ac) {
    $scope.ac = ac;
    $scope.cv = {
        _id: cv._id,
        tenquyetdinh_new: cv.tenquyetdinh,
        soquyetdinh_new: cv.soquyetdinh,
        ngayky_new: cv.ngayky,
        noinhan_new: cv.noinhan
    };
    $scope.ok = function () {
        socket.emit('xoa_quyetdinh_file', cv, function (data) {
            console.log(data);
            if (data.ok === 1) {
                $modalInstance.close(cv);
            }
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

function printpdf(url) {
    printJS(url);
}