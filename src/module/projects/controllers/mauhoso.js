'user strict';
// Controllers
// controller mẫu hồ sơ
app.controller('mauhoso', ['$rootScope', '$scope', 'socket', '$http', 'applib', '$modal', function($rootScope, $scope, socket, $http, applib, $modal) {
    $scope.hs = {
        giaidoan: {},
        loaicongviec: {},
        phongth: {}
    };

    var _loaicongviec = [];
    applib.setModule('projects');
    $scope.cacmauhoso = [];
    socket.emit('get_mauhoso', 1, function(data) {
        console.log(data);
        $scope.mauhoso = data;
    });
    // var get_laymau = function () {
    //   socket.emit('get_cacmauhoso', 1, function(data) {
    //       $scope.cacmauhoso = data;
    //       $scope.hs.phongth = data[0];
    //   })
    // }
    // socket.emit('get_phongban', 1, function (data) {
    //   $scope.phongban = data;
    // })
    // get_laymau();
    $scope.giaidoan = [];
    $scope.loaicongviec = [];
    socket.emit('get_phongban', 1, function(data) {
        $scope.phongban = data;
        console.log(data);
        $scope.hs.phongth = data[0];
        socket.emit('get_giaidoan', 1, function(data) {
            console.log(data);
            
            $scope.giaidoan = data;
            $scope.hs.giaidoan = data[0];
        });
        socket.emit('get_loaicongviec', 1, function(loaicongviec) {
            $scope.loaicongviec = loaicongviec;
            console.log(loaicongviec);
            $scope.loaicongviec.forEach(function(lcv, i) {
                if (lcv.phongth._id === $scope.hs.phongth._id) {
                    $scope.hs.loaicongviec = lcv;
                }
            });
        });
    });
    // var laymau = function () {
    //   socket.emit('get_phongban', 1, function (data) {
    //     $scope.phongban = data;
    //     $scope.hs.phongth = data[0];
    //     socket.emit('get_giaidoan', 1, function(data) {
    //         console.log(data);
    //         $scope.giaidoan = data;
    //         $scope.hs.giaidoan = data[0];
    //         socket.emit('get_loaicongviec', 1, function(loaicongviec) {
    //             console.log(loaicongviec);
    //             $scope.loaicongviec = loaicongviec;
    //             // $scope.loaicongviec = loaicongviec;
    //             // _loaicongviec = loaicongviec;
    //             // _loaicongviec.forEach(function(lcv, i) {
    //             //         if (lcv.phongth._id == $scope.hs.phongth._id) {
    //             //             $scope.loaicongviec.push(lcv);
    //             //         }
    //             //     });
    //                 // console.log($scope.loaicongviec);
    //             $scope.hs.loaicongviec = $scope.loaicongviec[0];
    //             // $scope.datarender();
    //
    //         });
    //     })
    //   })
    // }
    // laymau();
    socket.on('capnhatmauhs', function(data) {
        // get_laymau();
        // $scope.datarender();
        get_laymau();
    })
    $scope.sortableOptions = {
        connectWith: '.connected'
    };
    $scope.add = function() {
        $scope.data1.push({
            id: $scope.data1.length + 1,
            name: 'E'
        });
    };
    // $scope.datarender = function() {
    //     $scope.giaidoan.forEach(function(gd, i) {
    //         $scope.giaidoan[i].mauhoso = [];
    //         $scope.cacmauhoso.forEach(function(mhs, ii) {
    //             if (mhs.giaidoan == gd.id && mhs.loai_id == $scope.hs.loaicongviec.id && mhs.phongth == $scope.hs.phongth.co_id && mhs.deleted == 0) {
    //                 $scope.giaidoan[i].mauhoso.push(mhs);
    //             }
    //         })
    //     })
    //     console.log($scope.giaidoan);
    // }
    // $scope.sort = function(mauhs) {
    //     console.log(mauhs);
    // }

    function move(arr, old_index, new_index) {
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length;
            while ((k--) + 1) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    }
    // socket.on('capnhatmauhs', function (data) {
    //
    // })
    $scope.sortableCallback = function(sourceModel, destModel, start, end, mauhs) {
        console.log('Dest');
        destModel.forEach(function(d, i) {
            console.log(d.milestone_name);
        });
        console.log('model');
        mauhs.forEach(function(m, i) {
            console.log(m.milestone_name);
        });
        console.log('Sort');
        // console.log(start + ' -> ' + end);
        var arr = move(mauhs, (start), (end));
        arr.forEach(function(h, i) {
            console.log(h.milestone_name);
        });
        socket.emit('sort_mauhoso', arr, function(data) {
            $scope.mauhoso = data;
        });
    };
    $scope.phongban = [];
    $scope.user_details = $rootScope.user_details;
    $scope.sortableOptions = {
        containment: '#table-container',
        containerPositioning: 'relative'
    };
    $scope.chon_phongth = function(phongth) {
        $scope.hs.phongth = phongth;
        $scope.loaicongviec.forEach(function(lcv, i) {
            if (lcv.phongth._id === phongth._id) {
                $scope.hs.loaicongviec = lcv;
            }
        });
        // $scope.loaicongviec = [];
        // _loaicongviec.forEach(function(lcv, i) {
        //     if (lcv.phongth == phongth.co_id) {
        //         $scope.loaicongviec.push(lcv);
        //     }
        // })
        // $scope.hs.loaicongviec = $scope.loaicongviec[0];
        // if ($scope.hs.loaicongviec) {
        //     // $scope.datarender();
        // }
    };
    $scope.chon_loaicongviec = function(loaicongviec) {
        $scope.hs.loaicongviec = loaicongviec;
        // $scope.datarender();
    };
    // $scope.chon_giaidoan = function(giaidoan) {
    //     $scope.hs.giaidoan = giaidoan;
    //     $scope.laymauhs();
    // }
    // $scope.laymauhs = function() {
    //         socket.emit('get_mauhoso', $scope.hs, function(data) {
    //             console.log(data);
    //             $scope.mauhoso = data;
    //         });
    //     }
    // socket.on('get_mauhoso', function(data) {
    //
    // })

    $scope.nhomhs = [];
    socket.emit('get_nhomhs', 1, function(data) {
        $scope.nhomhs = data;
    });
    // socket.on('get_nhomhs', function(data) {
    //     $scope.nhomhs = data;
    // })
    $scope.ok = function() {
        console.log($scope.hs);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    // socket.on('themmauhoso', function(data) {
    //     $scope.mauhoso.push(data);
    // })
    $scope.themmauhoso = function(size, parentSelector) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'themmauhoso',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                hs: function() {
                    return $scope.hs;
                },
                nhomhs: function() {
                    return $scope.nhomhs;
                },
                giaidoan: function() {
                    return $scope.giaidoan;
                }

            }
        });

        modalInstance.result.then(function(data) {
            $scope.mauhoso.push(data);
        }, function() {
            // laymau();
            // $scope.laymauhs();
        });
    };
    $scope.suahoso = function(size, parentSelector, mauhs) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'suahoso.html',
            controller: 'suamauhoso',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                hs: function() {
                    return $scope.hs;
                },
                nhomhs: function() {
                    return $scope.nhomhs;
                },
                mauhs: function() {
                    return mauhs;
                }

            }
        });

        modalInstance.result.then(function(selectedItem) {
            // $ctrl.selected = selectedItem;
        }, function() {
            console.log('OK');
        });
    };
    $scope.xoamauhoso = function(size, parentSelector, mauhs) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $modal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'xoamauhoso.html',
            controller: 'xoamauhoso',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                hs: function() {
                    return $scope.hs;
                },
                nhomhs: function() {
                    return $scope.nhomhs;
                },
                mauhs: function() {
                    return mauhs;
                }

            }
        });

        modalInstance.result.then(function(data) {
            $scope.mauhoso = data;
        }, function() {
            console.log('OK');
        });
    };
}]);
app.filter('mhsfilter', function() {
    return function(items, props) {
        var out = [];
        // console.log(props);
        if (angular.isArray(items)) {
            items.forEach(function(item) {
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
app.controller('themmauhoso', function($modalInstance, $scope, socket, hs, nhomhs, giaidoan) {
    console.log(giaidoan);
    
    $scope.giaidoan = giaidoan;
    $scope.nhomhs = nhomhs;
    $scope.hs = hs;
    $scope.hs.nhomhs = nhomhs[0];

    $scope.ok = function() {
        console.log($scope.hs);
        socket.emit('themmauhoso', $scope.hs, function(data) {
            console.log(data);
            $modalInstance.close(data);
        });
        // $modalInstance.close($scope.mauhs);
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
});
app.controller('suamauhoso', function($modalInstance, $scope, socket, hs, nhomhs, mauhs) {
    console.log(mauhs);
    $scope.nhomhs = nhomhs;
    $scope.hs = hs;
    $scope.mauhs = mauhs;
    $scope.mauhs.milestone_name_edit = mauhs.milestone_name;
    $scope.mauhs.nhomhs_edit = mauhs.nhomhs;
    $scope.ok = function() {
        // console.log($scope.mauhs);
        socket.emit('suamauhoso', $scope.mauhs, function(data) {
            console.log(data);
            mauhs.milestone_name = data.milestone_name;
            mauhs.nhomhs = data.nhomhs;
            $modalInstance.close(data);
        });
        // $scope.mauhs.nhomhs_id = $scope.hs.nhomhs.id;
        // console.log($scope.mauhs);
        // socket.emit('suamauhoso', $scope.mauhs);
        // $modalInstance.close($scope.mauhs);
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
});
app.controller('xoamauhoso', function($modalInstance, $scope, socket, hs, nhomhs, mauhs) {
    console.log(mauhs);
    $scope.nhomhs = nhomhs;
    $scope.mauhs = mauhs;
    $scope.ok = function() {
        socket.emit('xoamauhoso', mauhs, function(data) {
            $modalInstance.close(data);
        })
        // $scope.mauhs.deleted = 1;
        // socket.emit('suamauhoso', $scope.mauhs);
        // $modalInstance.close($scope.mauhs);
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
});

;
