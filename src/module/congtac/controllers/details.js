'user strict';
//Controllers
// controller Người dùng
app.controller('congtac_details', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', '$document',
  function ($rootScope, $scope, socket, $http, $window, $stateParams, $modal, $document) {
    $scope.param = $stateParams;
    $scope.lst_nam = [];
    $scope.lst_nam[0] = $scope.param.nam - 2;
    $scope.lst_nam[1] = $scope.param.nam - 1;
    $scope.lst_nam[2] = $scope.param.nam - 0;
    $scope.lst_nam[3] = $scope.param.nam + 1;
    $scope.lst_nam[4] = $scope.param.nam + 2;
    console.log($scope.lst_nam);
    // $scope.roles = angular.fromJson($rootScope.globals.user_details.roles);
    $scope.dscongtac = [];
    socket.emit('get_dscongtac', $stateParams, function (data) {
      console.log(data);

      $scope.dscongtac = data;
    });
    $scope.delete_congtac = function (ct) {
      var modalInstance = $modal.open({
        templateUrl: 'module/boxes/delete_content.htm',
        controller: 'delete_congtac',
        resolve: {
          ct: function () {
            return ct;
          },
          ac: function () {
            return {
              title: 'Xóa công tác',
              noti: 'Công tác này sẽ bị xóa khỏi hệ thống'
            };
          },

        }
      });
      modalInstance.result.then(function (res) {
        // $scope.selected = selectedItem;
        for (var i = 0; i < $scope.dscongtac.length; i++) {
          if ($scope.dscongtac[i]._id == res._id) {
            $scope.dscongtac.splice(i, 1);
          }
        }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.xuatcongtac = function () {
      socket.emit('xct_nhanvien', $stateParams, function (res) {
        var data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        FileSaver.saveAs(data, $scope.dscongtac[0].nguoith.fullname + ' ' + $stateParams.thang + '-' + $stateParams.nam + '.xlsx');
      });
    };
  }
]);
app.controller('congtac_add', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', 'NgMap', '$document', 'toaster', function ($rootScope, $scope, socket, $http, $window, $stateParams, $modal, NgMap, $document, toaster) {
  var vm = this
  $scope.param = $stateParams;
  $scope.diadiem = [{
    pos: {}
  }];
  //Định mức
  $scope.dinhmuc = {};
  socket.emit('get_dinhmuc', 1, function (data) {
    console.log(data);
    $scope.dinhmuc = data;
  });
  $scope.edit_dinhmuc = function (dinhmuc) {
    var modalInstance = $modal.open({
      templateUrl: 'module/congtac/modals/edit.htm',
      controller: 'edit_dinhmuc',
      resolve: {
        dinhmuc: function () {
          return dinhmuc;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      // $scope.selected = selectedItem;
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  };
  $scope.countries = {};
  socket.emit('get_diadiem', 1, function (data) {
    $scope.diadiem = data;
  });
  // map object
  $scope.route = [];
  var vm = this;
  $scope.types = "['address']";
  $scope.placeChanged = function () {
    $scope.place = this.getPlace();
    console.log('location', $scope.place.geometry.location);
    $scope.map.setCenter($scope.place.geometry.location);
  };
  NgMap.getMap().then(function (map) {
    $scope.map = map;
  });
  // $scope.addToRoute = function(position) {
  //     $scope.route.push(position);
  //     position.onRoute = true;
  // };

  // $scope.removeFromRoute = function(position) {
  //     for (var i = 0; i < $scope.route.length; i++) {
  //         if ($scope.route[i].id == position.id) {
  //             $scope.route.splice(i, 1);
  //             position.onRoute = false;
  //         }
  //     }
  //     window.setTimeout(function() {
  //         $scope.$apply();
  //     }, 100);
  // };

  $scope.start = {};
  $scope.theWaypoints = [];
  $scope.end = {
    title: $scope.diadiem[0].address,
    pos: [$scope.diadiem[0].pos.lat, $scope.diadiem[0].pos.lng]
  };
  $scope.$watchCollection('route', function () {
    if ($scope.route.length > 1) {
      $scope.start = {
        title: $scope.route[0].address,
        pos: [$scope.route[0].pos.lat, $scope.diadiem[0].pos.lng]
      };
      $scope.theWaypoints = [];
      if ($scope.route.length > 1) {
        for (var i = 1; i < $scope.route.length; i++) {
          var obj = {
            location: {
              lat: $scope.route[i].pos.lat,
              lng: $scope.route[i].pos.lng
            },
            stopover: true
          };
          $scope.theWaypoints.push(obj);
        }
      }
    } else {
      $scope.start = {
        title: $scope.diadiem[0].address,
        pos: [$scope.diadiem[0].pos.lat, $scope.diadiem[0].pos.lng]
      };
      $scope.end = {
        title: $scope.diadiem[0].address,
        pos: [$scope.diadiem[0].pos.lat, $scope.diadiem[0].pos.lng]
      };
    }
  });
  $scope.$watchCollection('map.directionsRenderers[0]', function () {
    if ($scope.map) {
      if ($scope.map.directionsRenderers[0]) {
        if ($scope.map.directionsRenderers[0].directions) {
          var route = $scope.map.directionsRenderers[0].directions.routes[0];
          var km = 0;
          if (angular.isArray(route.legs)) {
            route.legs.forEach(function (leg, i) {
              // console.log(leg.distance.value);
              km += leg.distance.value;
            });
            $scope.ct.tongkm = km / 1000;
            $scope.ct.xangxe = Math.round((km / 1000) * $scope.dinhmuc.giaxang / $scope.dinhmuc.xang);
            $scope.ct.tong = $scope.ct.xangxe + $scope.ct.khac;
          }
        }
      }
    }
  });
  $scope.just_add = false;
  $scope.add_diadiem = function (selected_diadiem, place, address) {
    if (place) {
      $scope.route.push({
        name: $scope.input_diadiem,
        title: address,
        pos: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
      });
      $scope.$broadcast('angucomplete-alt:clearInput');
      $scope.cur_diadiem = {};
      $scope.just_add = true;
    } else {
      $scope.route.push({
        name: $scope.cur_diadiem.name,
        title: $scope.cur_diadiem.address,
        address: $scope.cur_diadiem.address,
        pos: $scope.cur_diadiem.pos,
        _id: $scope.cur_diadiem._id
      });
      $scope.$broadcast('angucomplete-alt:clearInput');
      $scope.cur_diadiem = {};
      $scope.just_add = true;
    }
  };
  $scope.ct = {
    xangxe: 0,
    khac: 0
  };
  // $scope.tinh = function(route) {
  //     var km = 0;
  //     if (route) {
  //         if (angular.isArray(route.legs)) {
  //             route.legs.forEach(function(leg, i) {
  //                 // console.log(leg.distance.value);
  //                 km += leg.distance.value;
  //             });
  //             $scope.ct.tongkm = km/1000;
  //             $scope.ct.xangxe = Math.round((km/1000)*$scope.dinhmuc.giaxang/$scope.dinhmuc.xang);
  //         }
  //     }
  //
  // };
  // $scope.countries = [{
  //     name: 'Công ty cổ phần đầu tư xây dựng dịch vụ Nam Việt',
  //     address: '156 đường 11, linh xuân, thủ đức, hồ chí minh',
  //     pos: {
  //         lat: 10.886633,
  //         lng: 106.768182
  //     }
  // }];
  $scope.cur_diadiem = {};
  $scope.input_diadiem = "";
  $scope.select_diadiem = function (diadiem) {
    console.log(diadiem);

    $scope.cur_diadiem = diadiem;
    if (diadiem) {
      $scope.address = diadiem.address;
      $scope.map.setCenter(diadiem.pos);
      $scope.map.setZoom(15);
    } else {
      // console.log($scope.input_diadiem);
      if ($scope.just_add) {
        $scope.address = "";
        $scope.just_add = false;
      } else {
        if ($scope.input_diadiem === "") {
          $scope.address = "";
        }
      }
    }
  };

  $scope.inputChanged = function (str) {
    $scope.input_diadiem = str;
  };
  $scope.options = {};
  $scope.get_char = function (i) {
    if (i) {
      var char = String.fromCharCode(65 + i);
      // console.log(char);
      return char;
    } else {
      return "A";
    }
  };
  // $scope.options.watchEnter = true;
  // $scope.options.country = 'vn';
  //Thao tác thêm công tác
  $scope.tongcp = function (tong) {
    $scope.ct.tong = tong;
  };
  socket.emit("get_dsnhanvien", 1, function (data) {
    var res = [];
    data.forEach(function (nv, i) {
      if (nv.chucvu) {
        // console.log(nv.chucvu);
        if (nv.chucvu.level <= 4) {
          res.push(nv);
        }
      }
    });
    $scope.ds_nhanvien = res;
    $scope.ct.nguoigiaoviec = $scope.ds_nhanvien[0];
  });
  var today = new Date();
  $scope.ct.ngayth = today;
  $scope.add_congtac = function () {
    // console.log($scope.ct);
    $scope.ct.nguoith = $stateParams.u_id;
    $scope.ct.route = [];
    $scope.route.forEach(function (r, i) {
      $scope.ct.route.push(r);
    });
    $scope.ct.route.push({
      name: $scope.diadiem[0].name,
      title: $scope.diadiem[0].address,
      pos: $scope.diadiem[0].pos,
      _id: $scope.diadiem[0]._id
    });
    var dt = new Date($scope.ct.ngayth);
    // $scope.ct.ngayth = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    console.log($scope.ct);
    socket.emit('add_congtac', $scope.ct, function (data) {
      // console.log(data);
      $scope.ct = {};
      $scope.ct.ngayth = today;
      $scope.ct.nguoigiaoviec = $scope.ds_nhanvien[0];
      $scope.route = [];
      $scope.$apply();
      console.log(data);
      $scope.toaster = {
        type: 'success',
        title: 'Thông báo:',
        text: 'Thêm công tác thành công'
      };
      toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
    });
  };

}]);
app.controller('congtac_chitiet', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', 'NgMap', '$document', function ($rootScope, $scope, socket, $http, $window, $stateParams, $modal, NgMap, $document) {
  $scope.route = [];
  $scope.diadiem = [{
    pos: {}
  }];
  $scope.ct = {
    xangxe: 0,
    tongkm: 0
  };
  socket.emit('get_diadiem', 1, function (data) {
    // console.log(diadiem);
    $scope.diadiem = data;
  });

  socket.emit('get_chitietcongtac', $stateParams.ct_id, function (data) {
    console.log(data);
    $scope.ct = data;
    $scope.ct.nguoigiaoviec = data.nguoigv;
    $scope.end = {
      title: data.hanhtrinh[data.hanhtrinh.length - 1].address,
      pos: [data.hanhtrinh[data.hanhtrinh.length - 1].pos.lat, data.hanhtrinh[data.hanhtrinh.length - 1].pos.lng]
    };
    data.hanhtrinh.forEach(function (ht, i) {
      if (i < data.hanhtrinh.length - 1) {
        $scope.route.push({
          name: ht.name,
          title: ht.address,
          address: ht.address,
          pos: ht.pos,
          _id: ht._id
        });
      }
    });
    console.log($scope.route);
    console.log($scope.end);
    // console.log($scope.route);
  });
  //Định mức
  $scope.dinhmuc = {};
  socket.emit('get_dinhmuc', 1, function (data) {
    // console.log(data);
    $scope.dinhmuc = data;
  });
  $scope.edit_dinhmuc = function (dinhmuc) {
    var modalInstance = $modal.open({
      templateUrl: 'module/congtac/modals/edit.htm',
      controller: 'edit_dinhmuc',
      resolve: {
        dinhmuc: function () {
          return dinhmuc;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      // $scope.selected = selectedItem;
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  };
  $scope.countries = {};

  // map object

  var vm = this;
  $scope.types = "['establishment']";
  $scope.placeChanged = function () {
    $scope.place = this.getPlace();
    // console.log('location', $scope.place.geometry.location);
    $scope.map.setCenter($scope.place.geometry.location);
  };
  NgMap.getMap().then(function (map) {
    $scope.map = map;
  });
  // $scope.addToRoute = function(position) {
  //     $scope.route.push(position);
  //     position.onRoute = true;
  // };

  // $scope.removeFromRoute = function(position) {
  //     for (var i = 0; i < $scope.route.length; i++) {
  //         if ($scope.route[i].id == position.id) {
  //             $scope.route.splice(i, 1);
  //             position.onRoute = false;
  //         }
  //     }
  //     window.setTimeout(function() {
  //         $scope.$apply();
  //     }, 100);
  // };

  $scope.start = {};
  $scope.theWaypoints = [];
  $scope.$watchCollection('route', function () {
    if ($scope.route.length > 1) {
      $scope.start = {
        title: $scope.route[0].address,
        pos: [$scope.route[0].pos.lat, $scope.diadiem[0].pos.lng]
      };
      $scope.theWaypoints = [];
      if ($scope.route.length > 1) {
        for (var i = 1; i < $scope.route.length; i++) {
          var obj = {
            location: {
              lat: $scope.route[i].pos.lat,
              lng: $scope.route[i].pos.lng
            },
            stopover: true
          };
          $scope.theWaypoints.push(obj);
        }
      }
    } else {
      $scope.start = {
        title: $scope.diadiem[0].address,
        pos: [$scope.diadiem[0].pos.lat, $scope.diadiem[0].pos.lng]
      };
      $scope.end = {
        title: $scope.diadiem[0].address,
        pos: [$scope.diadiem[0].pos.lat, $scope.diadiem[0].pos.lng]
      };
    }
  });
  $scope.$watchCollection('map.directionsRenderers[0]', function () {
    if ($scope.map) {
      if ($scope.map.directionsRenderers[0]) {
        if ($scope.map.directionsRenderers[0].directions) {
          var route = $scope.map.directionsRenderers[0].directions.routes[0];
          var km = 0;
          if (angular.isArray(route.legs)) {
            route.legs.forEach(function (leg, i) {
              // console.log(leg.distance.value);
              km += leg.distance.value;
            });
            $scope.ct.tongkm = km / 1000;
            $scope.ct.xangxe = Math.round((km / 1000) * $scope.dinhmuc.giaxang / $scope.dinhmuc.xang);
            $scope.ct.tong = $scope.ct.xangxe + $scope.ct.khac;
          }
        }
      }
    }
  });
  $scope.just_add = false;
  $scope.add_diadiem = function (selected_diadiem, place, address) {
    // console.log(selected_diadiem);
    if (place) {
      // console.log(place.geometry.location.lat(), place.geometry.location.lng());
      // console.log(address);
      $scope.route.push({
        name: $scope.input_diadiem,
        title: address,
        pos: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
      });
      $scope.$broadcast('angucomplete-alt:clearInput');
      $scope.cur_diadiem = {};
      $scope.just_add = true;
    } else {
      $scope.route.push({
        name: $scope.cur_diadiem.name,
        title: $scope.cur_diadiem.address,
        address: $scope.cur_diadiem.address,
        pos: $scope.cur_diadiem.pos,
        _id: $scope.cur_diadiem._id
      });
      $scope.$broadcast('angucomplete-alt:clearInput');
      $scope.cur_diadiem = {};
      $scope.just_add = true;
    }
  };
  $scope.ct = {
    xangxe: 0
  };
  $scope.tinh = function (route) {
    var km = 0;
    if (route) {
      if (angular.isArray(route.legs)) {
        route.legs.forEach(function (leg, i) {
          // console.log(leg.distance.value);
          km += leg.distance.value;
        });
        console.log(km);
        $scope.ct.tongkm = km / 1000;
        $scope.ct.xangxe = Math.round((km / 1000) * $scope.dinhmuc.giaxang / $scope.dinhmuc.xang);

      }
    }

  };
  // $scope.countries = [{
  //     name: 'Công ty cổ phần đầu tư xây dựng dịch vụ Nam Việt',
  //     address: '156 đường 11, linh xuân, thủ đức, hồ chí minh',
  //     pos: {
  //         lat: 10.886633,
  //         lng: 106.768182
  //     }
  // }];
  $scope.cur_diadiem = {};
  $scope.input_diadiem = "";
  $scope.select_diadiem = function (diadiem) {
    $scope.cur_diadiem = diadiem;
    if (diadiem) {
      $scope.address = diadiem.address;
      $scope.map.setCenter(diadiem.pos);
      $scope.map.setZoom(15);
    } else {
      // console.log($scope.input_diadiem);
      if ($scope.just_add) {
        $scope.address = "";
        $scope.just_add = false;
      } else {
        if ($scope.input_diadiem === "") {
          $scope.address = "";
        }
      }
    }
  };

  $scope.inputChanged = function (str) {
    $scope.input_diadiem = str;
  };
  $scope.options = {};
  $scope.get_char = function (i) {
    if (i) {
      var char = String.fromCharCode(65 + i);
      // console.log(char);
      return char;
    } else {
      return "A";
    }

  };
  // $scope.options.watchEnter = true;
  // $scope.options.country = 'vn';
  //Thao tác thêm công tác
  $scope.tongcp = function (tong) {
    $scope.ct.tong = tong;
  };
  socket.emit("get_dsnhanvien", 1, function (data) {
    var res = [];
    data.forEach(function (nv, i) {
      if (nv.chucvu) {
        // console.log(nv.chucvu);
        if (nv.chucvu.level <= 4) {
          res.push(nv);
        }
      }
    });
    $scope.ds_nhanvien = res;
  });
  $scope.add_congtac = function () {
    // console.log($scope.ct);
    $scope.ct.nguoith = $stateParams.u_id;
    $scope.ct.route = [];
    $scope.route.forEach(function (r, i) {
      $scope.ct.route.push(r);
    });
    $scope.ct.route.push({
      name: $scope.diadiem[0].name,
      title: $scope.diadiem[0].address,
      pos: $scope.diadiem[0].pos,
      _id: $scope.diadiem[0]._id
    });
    socket.emit('add_congtac', $scope.ct, function (data) {

    });
  };
}]);

app.controller('duyetcongtac', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', 'NgMap', '$document', '$timeout',
  function ($rootScope, $scope, socket, $http, $window, $stateParams, $modal, NgMap, $document, $timeout) {
    var vm = this;
    $scope.param = $stateParams;
    $scope.dscongtac = [];
    // $scope.param.ac = "duyet";
    socket.emit('get_dscongtac', $scope.param, function (data) {
      $scope.dscongtac = data;
    });
    $scope.route = [];
    $scope.diadiem = [{
      pos: {}
    }];
    $scope.ct = {
      xangxe: 0,
      tongkm: 0
    };
    socket.emit('get_diadiem', 1, function (data) {
      // console.log(diadiem);
      $scope.diadiem = data;
    });
    $scope.show = false;
    $scope._show = function () {
      $scope.show = true;
    }
    socket.emit('get_chitietcongtac', $stateParams.ct_id, function (data) {
      console.log(data);
      $scope.ct = data;
      $scope.end = {
        title: data.hanhtrinh[data.hanhtrinh.length - 1].address,
        pos: [data.hanhtrinh[data.hanhtrinh.length - 1].pos.lat, data.hanhtrinh[data.hanhtrinh.length - 1].pos.lng]
      };

      NgMap.getMap().then(function (map) {
        $scope.map = map;
      });
      $timeout(function () {
        $scope.update_route(function () {
          $scope.update_dir(function () {
            // $scope.show = true;
            $scope._show();
          })
        })
        $scope.show = true;
      }, 500)
    });
    $scope.duyet = function () {
      console.log($scope.ct);
      socket.emit('update trang thai cong tac', $scope.ct, function (res) {
        $scope.ct.duyet = !$scope.ct.duyet;
      });
    };
    //Định mức
    $scope.dinhmuc = {};
    socket.emit('get_dinhmuc', 1, function (data) {
      // console.log(data);
      $scope.dinhmuc = data;
    });
    $scope.edit_dinhmuc = function (dinhmuc) {
      var modalInstance = $modal.open({
        templateUrl: 'module/congtac/modals/edit.htm',
        controller: 'edit_dinhmuc',
        resolve: {
          dinhmuc: function () {
            return dinhmuc;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        // $scope.selected = selectedItem;
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.countries = {};

    // map object
    $scope.types = "['establishment']";
    $scope.placeChanged = function () {
      $scope.place = this.getPlace();
      $scope.map.setCenter($scope.place.geometry.location);
    };

    $scope.start = {};
    $scope.theWaypoints = [];
    $scope.update_dir = function (fn) {
      if ($scope.route.length > 1) {
        $scope.start = {
          title: $scope.route[0].address,
          pos: [$scope.route[0].pos.lat, $scope.diadiem[0].pos.lng]
        };
        $scope.theWaypoints = [];
        if ($scope.route.length > 1) {
          for (var i = 1; i < $scope.route.length; i++) {
            var obj = {
              location: {
                lat: $scope.route[i].pos.lat,
                lng: $scope.route[i].pos.lng
              },
              stopover: true
            };
            var ls = [];
            ls.push(obj);
            $scope.theWaypoints = ls
          }
        }
      } else {
        $scope.start = {
          title: $scope.diadiem[0].address,
          pos: [$scope.diadiem[0].pos.lat, $scope.diadiem[0].pos.lng]
        };
        $scope.end = {
          title: $scope.diadiem[0].address,
          pos: [$scope.diadiem[0].pos.lat, $scope.diadiem[0].pos.lng]
        };
      }
      fn()
    }
    // $scope.$watchCollection('route', function () {
    //   $scope.update_dir(function () {

    //   })
    // });
    // $scope.$watchCollection('map.directionsRenderers[0]', function () {
    //   if ($scope.map) {
    //     if ($scope.map.directionsRenderers[0]) {
    //       if ($scope.map.directionsRenderers[0].directions) {
    //         var route = $scope.map.directionsRenderers[0].directions.routes[0];
    //         var km = 0;
    //         if (angular.isArray(route.legs)) {
    //           route.legs.forEach(function (leg, i) {
    //             // console.log(leg.distance.value);
    //             km += leg.distance.value;
    //           });
    //           $scope.ct.tongkm = km / 1000;
    //           $scope.ct.xangxe = Math.round((km / 1000) * $scope.dinhmuc.giaxang / $scope.dinhmuc.xang);
    //           $scope.ct.tong = $scope.ct.xangxe + $scope.ct.khac;
    //         }
    //       }
    //     }
    //   }
    // });
    // $scope.just_add = false;
    // $scope.add_diadiem = function (selected_diadiem, place, address) {
    //   // console.log(selected_diadiem);
    //   if (place) {
    //     // console.log(place.geometry.location.lat(), place.geometry.location.lng());
    //     // console.log(address);
    //     $scope.route.push({
    //       name: $scope.input_diadiem,
    //       title: address,
    //       pos: {
    //         lat: place.geometry.location.lat(),
    //         lng: place.geometry.location.lng()
    //       },
    //     });
    //     $scope.$broadcast('angucomplete-alt:clearInput');
    //     $scope.cur_diadiem = {};
    //     $scope.just_add = true;
    //   } else {
    //     $scope.route.push({
    //       name: $scope.cur_diadiem.name,
    //       title: $scope.cur_diadiem.address,
    //       address: $scope.cur_diadiem.address,
    //       pos: $scope.cur_diadiem.pos,
    //       _id: $scope.cur_diadiem._id
    //     });
    //     $scope.$broadcast('angucomplete-alt:clearInput');
    //     $scope.cur_diadiem = {};
    //     $scope.just_add = true;
    //   }
    // };
    $scope.update_route = function (fn) {
      $scope.route = [];
      $scope.ct.hanhtrinh.forEach(function (ht, i) {
        if (i < $scope.ct.hanhtrinh.length - 1) {
          $scope.route.push({
            name: ht.name,
            title: ht.address,
            address: ht.address,
            pos: ht.pos,
            _id: ht._id
          });
        }
      });
      fn()
    }
    // $scope.tinh = function (route) {
    //   $scope.update_route(function () {
    //     $scope.update_dir(function () {
    //       if ($scope.map) {
    //         if ($scope.map.directionsRenderers[0]) {
    //           if ($scope.map.directionsRenderers[0].directions) {
    //             var route = $scope.map.directionsRenderers[0].directions.routes[0];
    //             console.log(route);

    //             var km = 0;
    //             if (angular.isArray(route.legs)) {
    //               route.legs.forEach(function (leg, i) {
    //                 // console.log(leg.distance.value);
    //                 km += leg.distance.value;
    //               });
    //               $scope.ct.tongkm = km / 1000;
    //               $scope.ct.xangxe = Math.round((km / 1000) * $scope.dinhmuc.giaxang / $scope.dinhmuc.xang);
    //               $scope.ct.tong = $scope.ct.xangxe + $scope.ct.khac;
    //             }
    //           }
    //         }
    //       }
    //     })
    //   })
    // };

    $scope.tinh = function (route) {
      console.log(route);

      var km = 0;
      if (angular.isArray(route.legs)) {
        route.legs.forEach(function (leg, i) {
          // console.log(leg.distance.value);
          km += leg.distance.value;
        });
        $scope.ct.tongkm = km / 1000;
        $scope.ct.xangxe = Math.round((km / 1000) * $scope.dinhmuc.giaxang / $scope.dinhmuc.xang);
        $scope.ct.tong = $scope.ct.xangxe + $scope.ct.khac;
      }
    };

    // $scope.countries = [{
    //     name: 'Công ty cổ phần đầu tư xây dựng dịch vụ Nam Việt',
    //     address: '156 đường 11, linh xuân, thủ đức, hồ chí minh',
    //     pos: {
    //         lat: 10.886633,
    //         lng: 106.768182
    //     }
    // }];
    $scope.cur_diadiem = {};
    $scope.input_diadiem = "";
    $scope.select_diadiem = function (diadiem) {
      console.log(diadiem);

      $scope.cur_diadiem = diadiem;
      if (diadiem) {
        $scope.address = diadiem.address;
        $scope.map.setCenter(diadiem.pos);
        $scope.map.setZoom(15);
      } else {
        // console.log($scope.input_diadiem);
        if ($scope.just_add) {
          $scope.address = "";
          $scope.just_add = false;
        } else {
          if ($scope.input_diadiem === "") {
            $scope.address = "";
          }
        }
      }
    };

    $scope.inputChanged = function (str) {
      $scope.input_diadiem = str;
    };
    $scope.options = {};
    $scope.get_char = function (i) {
      if (i) {
        var char = String.fromCharCode(65 + i);
        // console.log(char);
        return char;
      } else {
        return "A";
      }

    };
    // $scope.options.watchEnter = true;
    // $scope.options.country = 'vn';
    //Thao tác thêm công tác
    $scope.tongcp = function (tong) {
      $scope.ct.tong = tong;
    };
    $scope.add_congtac = function () {
      // console.log($scope.ct);
      $scope.ct.nguoith = $stateParams.u_id;
      $scope.ct.route = [];
      $scope.route.forEach(function (r, i) {
        $scope.ct.route.push(r);
      });
      $scope.ct.route.push({
        name: $scope.diadiem[0].name,
        title: $scope.diadiem[0].address,
        pos: $scope.diadiem[0].pos,
        _id: $scope.diadiem[0]._id
      });
      socket.emit('add_congtac', $scope.ct, function (data) {

      });
    };
  }
]);

app.controller('xuatdulieu', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', '$document', '$timeout',
  function ($rootScope, $scope, socket, $http, $window, $stateParams, $modal, $document, $timeout) {
    $scope.param = $stateParams
    $scope.format = function (n, fix) {
      return "" + n.toFixed(fix).replace(/./g, function (c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
      });
    }

    var headerObj = {
      margin: [60, 25, 40, 10],
      columns: [{
          table: {
            widths: [80, "*", 54],

            body: [
              [{
                  border: [false, false, false, true],
                  image: "logo",
                  width: 80,
                  margin: [0, 0, 0, 1]
                },
                {
                  border: [false, false, false, true],

                  stack: [{
                      text: "CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY DỰNG DỊCH VỤ NAM VIỆT",
                      bold: true,
                      margin: [0, 2, 0, 0],
                      fontSize: 11
                    },
                    {
                      text: "Địa chỉ: 156 Đường 11, KP5, P. Linh Xuân, Q. Thủ Đức, Tp. Hồ Chí Minh",
                      italics: true,
                      fontSize: 10
                    },
                    {
                      text: "Điện thoại: 08.37245963             Fax: 08.37245962",
                      italics: true,
                      fontSize: 10
                    }
                  ]
                },
                {
                  margin: [0, -12, 0, -5],
                  border: [true, false, false, true],
                  stack: [{
                    image: 'qr',
                    width: 60,
                    height: 60,
                    alignment: 'right'
                  }]
                }
              ],
            ]
          },
          // layout: 'noBorders'
          layout: {
            hLineWidth: function (i, node) {
              return 4;
            },
            vLineWidth: function (i, node) {
              return 4;
            },
            hLineColor: 'gray',
            vLineColor: 'gray'
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (i, node) { return null; }
          }
        }

      ]
    };

    var dd = {
      // a string or { width: number, height: number }
      pageSize: 'A4',
      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'landscape',
      pageMargins: [40, 80, 40, 40],
      header: headerObj,
      footer: {},
      content: [],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 12,
          italics: true,
          alignment: 'center'
        },
        date_header: {
          italics: true,
          alignment: 'right'
        },
        tableHeader: {
          bold: true
        },
        ct_header: {
          bold: true,
          margin: [0, 2, 0, 1]
        },
        table1: {
          alignment: 'center',
        }
      },
      defaultStyle: {
        font: 'TimesNewRomans',
        fontSize: 11
      },
      images: {
        logo: "",
        qr: ""
      }
    };

    pdfMake.fonts = {
      TimesNewRomans: {
        normal: 'times.ttf',
        bold: 'timesbd.ttf',
        italics: 'timesi.ttf',
        bolditalics: 'timesbi.ttf'
      }
    };
    ct_content = function (dscongtac) {
      ct_table = [
        [{
            text: "Mã công tác",
            bold: true,
            alignment: "center"
          },
          {
            text: "Tên công tác",
            bold: true,
            alignment: "center"
          },
          {
            text: "Ngày thực hiện",
            bold: true,
            alignment: "center"
          },
          {
            text: "Số địa điểm",
            bold: true,
            alignment: "center"
          },
          {
            text: "Tổng quãng đường (km)",
            bold: true,
            alignment: "center"
          },
          {
            text: "Xăng xe",
            bold: true,
            alignment: "center"
          },
          {
            text: "Chi phí khác",
            bold: true,
            alignment: "center"
          },
          {
            text: "Tổng cộng",
            bold: true,
            alignment: "center"
          },

          {
            text: "Xác nhận",
            bold: true,
            alignment: "center"
          },
          {
            text: "Ghi chú",
            bold: true,
            alignment: "center"
          }
        ]
      ]
      var tongcong_km = 0;
      var tongcong_xangxe = 0;
      var tongcong_khac = 0;
      var tongcong_tong = 0;
      dscongtac.forEach(function (e, i) {
        var ct_num = " "
        if (e.ct_num) {
          ct_num = e.ct_num
        }
        var tencongtac = " "
        if (e.tencongtac) {
          tencongtac = e.tencongtac
        }
        var ngayth = " "
        if (e.ngayth) {
          ngayth = "" + e.ngay + "/" + e.thang + "/" + e.nam
        }
        var sodiadiem = ""
        if (e.hanhtrinh) {
          sodiadiem = e.hanhtrinh.length
        }
        var tongkm = ""
        if (e.tongkm) {
          tongkm = $scope.format(e.tongkm, 0);
          tongcong_km += e.tongkm;
        }
        var xangxe = ""
        if (e.xangxe) {
          xangxe = $scope.format(e.xangxe, 0);
          tongcong_xangxe += e.xangxe;
        }
        var khac = ""
        if (e.khac) {
          khac = $scope.format(e.khac, 0);
          tongcong_khac += e.khac;
        }
        var tong = ""
        if (e.tong) {
          tong = $scope.format(e.tong, 0);
          tongcong_tong += e.tong;
        }
        ct_table.push([{
          text: ct_num,
          alignment: 'center',
          margin: [0, 3, 0, 3]
        }, {
          text: tencongtac,
          margin: [0, 3, 0, 3]
        }, {
          text: ngayth,
          alignment: "center",
          margin: [0, 3, 0, 3]
        }, {
          text: sodiadiem,
          alignment: "center",
          margin: [0, 3, 0, 3]
        }, {
          text: tongkm,
          alignment: "right",
          margin: [0, 3, 0, 3]
        }, {
          text: xangxe,
          alignment: "right",
          margin: [0, 3, 0, 3]
        }, {
          text: khac,
          alignment: "right",
          margin: [0, 3, 0, 3]
        }, {
          text: tong,
          alignment: "right",
          margin: [0, 3, 0, 3]
        }, {}, {}])
      })
      var _tongcong_km = $scope.format(tongcong_km, 0);
      var _tongcong_xangxe = $scope.format(tongcong_xangxe, 0);
      var _tongcong_khac = $scope.format(tongcong_khac, 0);
      var _tongcong_tong = $scope.format(tongcong_tong, 0);
      ct_table.push([{
        text: "",
        alignment: 'center',
        margin: [0, 3, 0, 3]
      }, {
        text: "Tổng cộng",
        alignment: 'center',
        bold: true,
        margin: [0, 3, 0, 3]
      }, {}, {}, {
        text: _tongcong_km,
        alignment: "right",
        bold: true,
        margin: [0, 3, 0, 3]
      }, {
        text: _tongcong_xangxe,
        alignment: "right",
        bold: true,
        margin: [0, 3, 0, 3]
      }, {
        text: _tongcong_khac,
        alignment: "right",
        bold: true,
        margin: [0, 3, 0, 3]
      }, {
        text: _tongcong_tong,
        alignment: "right",
        bold: true,
        margin: [0, 3, 0, 3]
      }, {}, {}])
      return [{
          stack: [{
              text: "BẢNG LIỆT KÊ CÔNG TÁC PHÍ",
              style: 'header'
            },
            {
              margin: 3,
              text: ['Tháng ', $scope.param.thang, " Năm ", $scope.param.nam],
              style: 'subheader',
              fontSize: 11
            },
            {
              text: ['Tp. HCM, ngày     tháng     năm ', $scope.param.nam],
              style: 'date_header'
            },
            {
              text: ["Nhân viên: ", dscongtac[0].nguoith.fullname],
              margin: [0, 3, 0, 5]
            }
          ],
        },
        {
          style: 'tableExample',
          table: {
            widths: [40, '*', 50, 40, 60, 50, 50, 50, 70, 100],
            headerRows: 1,
            body: ct_table
          }
        },
        {
          stack: [{
            alignment: 'center',
            bold: true,
            margin: [0, 10, 0, 0],
            columns: [{
                text: "XÁC NHẬN CỦA LÃNH ĐẠO"
              },
              {
                text: "NGƯỜI LẬP"
              }
            ]
          }]
        }
      ]
    }

    function generate() {
      pdfMake.createPdf(dd).getDataUrl(function (outDoc) {
        $scope.$apply(function () {});
        document.getElementById('pdfV').src = outDoc;
      });
    }
    socket.emit('get logo uri data', function (data) {
      dd.images.logo = data;
      // generate()
      socket.emit('tao ma truy cap danh sach cong tac', $scope.param, function (ctt_num) {
        // console.log(data);
        var str = "DC" + ctt_num;
        socket.emit('get_qr', str, function (qrdata) {
          dd.images.qr = qrdata;
          $scope.param.ac = "xuatdulieu";
          socket.emit('get_dscongtac', $scope.param, function (data) {
            console.log(data);
            $scope.dscongtac = data;
            dd.content = ct_content(data);
            generate();

          });

        });
      })

    });
  }
]);

app.controller('edit_dinhmuc', ['$scope', 'socket', '$modalInstance', 'dinhmuc', function ($scope, socket, $modalInstance, dinhmuc) {
  // console.log(dinhmuc);
  $scope.dinhmuc = {
    xang_new: dinhmuc.xang,
    giaxang_new: dinhmuc.giaxang,
    dau_new: dinhmuc.dau
  };
  $scope.ok = function () {
    socket.emit('update_dinhmuc', $scope.dinhmuc, function (data) {
      dinhmuc.xang = $scope.dinhmuc.xang_new;
      dinhmuc.giaxang = $scope.dinhmuc.giaxang_new;
      dinhmuc.dau = $scope.dinhmuc.dau_new;
      $modalInstance.close();
    });
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
app.controller('delete_congtac', ['$scope', 'socket', '$modalInstance', 'ct', 'ac', function ($scope, socket, $modalInstance, ct, ac) {
  // console.log(ct);
  $scope.ac = ac;
  $scope.ok = function () {
    // console.log(ct);
    socket.emit('delete_congtac', ct, function (res) {
      $modalInstance.close(res);
    });

  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);