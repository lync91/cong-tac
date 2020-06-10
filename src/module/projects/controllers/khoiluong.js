'user strict';
//Controllers
// controller Hồ sơ dự án
app.controller('khoiluong', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', 'editableOptions', 'editableThemes', '$state', 'editableOptions', 'editableThemes', '$filter', 'uiGridConstants',
  function ($rootScope, $scope, socket, $http, $window, $stateParams, $modal, editableOptions, editableThemes, $state, editableOptions, editableThemes, $filter, uiGridConstants) {
    // $state.go('app.projects.view.milestones',  {p_id: '59cfdd2d35defd7916f56cf3'});
    // console.log($state);

    $scope.canEdit = function () {
      return $scope.pageOptions.isView;
    };

    $scope.pageOptions = {
      isView: false
    };

    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
    // editableOptions.isDisabled = true;
    $scope.change_mtool = function (data) {
      $scope.$emit('change_mtools', data);
    };
    $scope.$emit('change overflow', 'hidden');
    $scope.congtachd = [];
    $scope._congtachd = {};
    socket.emit('get loai cong viec thi cong', function (data) {
      // $scope.congtachd = data;
      // console.log(data);
      if (angular.isArray(data)) {
        data.forEach(function (e, i) {
          // console.log(e);
          $scope.congtachd.push({
            id: e.id,
            _id: e._id,
            tenloaicongtac: e.name
          });
          $scope._congtachd[e.id] = {
            _id: e._id,
            name: e.name
          };
        });
      }
      // console.log($scope.congtachd);

    });
    $scope.check_enable = false;
    $scope.change_editable = function () {
      $scope.pageOptions.isView = !$scope.pageOptions.isView;
    }
    $scope.change_check = function () {
      $scope.check_enable = !$scope.check_enable;
      $scope.gridOptions.data = $scope.bangkhoiluong;
      $scope.gridOptions.data.forEach(function (e, i) {
        e.select = false;
      })
    }
    $scope.columns = [{
        field: 'select',
        displayName: '',
        width: 30,
        cellClass: 'ui-grid-contents-wrapper',
        cellEditableCondition: false,
        cellTemplate: '<div class="ui-grid-cell-contents text-center {{grid.appScope.canCheck().b}}" title="TOOLTIP"><div class="checkbox"><label class="i-checks i-checks-sm"><input type="checkbox" disabled ng-model="MODEL_COL_FIELD"><i></i></label></div></div><div class="ui-grid-cell-contents text-center {{grid.appScope.canCheck().a}}" title="TOOLTIP"><div class="checkbox"><label class="i-checks i-checks-sm"><input type="checkbox" ng-model="MODEL_COL_FIELD"><i></i></label></div></div>',
      },
      {
        field: 'tencongtac',
        displayName: 'Tên công tác',
        cellClass: 'ui-grid-contents-wrapper',
        cellEditableCondition: $scope.canEdit
      },
      {
        field: 'idlcv',
        width: 160,
        displayName: 'Loại công việc',
        cellClass: 'ui-grid-contents-wrapper',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellFilter: "mapGender:grid.options.data[0]._congtachd",
        editDropdownValueLabel: 'tenloaicongtac',
        editDropdownOptionsArray: $scope.congtachd,
        // editDropdownRowEntityOptionsArrayPath: 'sizeOptions'
        cellEditableCondition: $scope.canEdit
      },
      {
        field: 'donvi',
        width: 90,
        displayName: 'Đơn vị',
        cellClass: 'ui-grid-contents-wrapper',
        cellEditableCondition: $scope.canEdit
      },
      {
        field: 'khoiluong',
        width: 90,
        displayName: 'Khối lượng',
        cellFilter: 'number',
        cellClass: 'ui-grid-contents-wrapper',
        editableCellTemplate: '<div><form name="inputForm"><input type="text" numberinput="" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>',
        cellEditableCondition: $scope.canEdit
      },
      {
        field: 'khoiluongth',
        width: 90,
        displayName: 'Khối lượng thực hiện',
        cellFilter: 'number',
        cellClass: 'ui-grid-contents-wrapper',
        editableCellTemplate: '<div><form name="inputForm"><input type="text" numberinput="" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>',
        cellEditableCondition: false
      },
      {
        field: 'dongia',
        width: 90,
        displayName: 'Đơn giá',
        cellFilter: 'number',
        cellClass: 'ui-grid-contents-wrapper text-right',
        editableCellTemplate: '<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>',
        cellEditableCondition: $scope.canEdit
      },
      {
        field: 'thanhtien',
        width: 120,
        displayName: 'Thành tiền',
        cellFilter: 'number',
        cellClass: 'ui-grid-contents-wrapper',
        cellTemplate: '<div class="ui-grid-cell-contents text-right" title="TOOLTIP">{{grid.appScope.thanhtien(grid, row) | number}}</div>',
        footerCellTemplate: '<div class="ui-grid-cell-contents text-right">{{grid.appScope.tinhtong(grid, row) | number}}</div>',
        cellEditableCondition: false
      },
      {
        field: 'gtthuchien',
        width: 120,
        displayName: 'Giá trị thực hiện',
        cellFilter: 'number',
        cellClass: 'ui-grid-contents-wrapper',
        cellTemplate: '<div class="ui-grid-cell-contents text-right" title="TOOLTIP">{{grid.appScope.thanhtienth(grid, row) | number}}</div>',
        footerCellTemplate: '<div class="ui-grid-cell-contents text-right">{{grid.appScope.tongthuchien(grid, row) | number}}</div>',
        cellEditableCondition: false
      },
    ];
    $scope.canCheck = function () {
      if ($scope.check_enable) {
        return {
          a: "",
          b: "hidden"
        }
      } else {
        return {
          a: "hidden",
          b: ""
        }
      }
    }
    $scope.thanhtien = function (grid, myRow) {
      var thanhtien = 0;
      thanhtien = myRow.entity.khoiluong * myRow.entity.dongia;
      thanhtien = Math.round(thanhtien)
      return thanhtien;
    };
    $scope.thanhtienth = function (grid, myRow) {
      var thanhtien = 0;
      thanhtien = myRow.entity.khoiluongth * myRow.entity.dongia;
      thanhtien = Math.round(thanhtien)
      return thanhtien;
    };
    $scope.change_select = function (grid, myRow, select) {
      console.log(myRow);
      console.log(select);

    };
    $scope.stt = function (grid, myRow) {
      console.log(myRow);

    };
    $scope.tinhtong = function (grid, myRow) {
      // console.log(grid.rows);
      var rows = grid.rows;
      var tongcong = 0;
      // tongcong = myRow.entity.khoiluong * myRow.entity.dongia
      if (angular.isArray(rows)) {
        if (rows.length > 0) {
          rows.forEach(row => {
            if (row.entity.dongia && row.entity.khoiluong) {
              tongcong += Math.round(row.entity.dongia * row.entity.khoiluong);
            }
          });
        }
      }
      return tongcong;
    };
    $scope.tongthuchien = function (grid, myRow) {
      // console.log(grid.rows);
      var rows = grid.rows;
      var tongcong = 0;
      // tongcong = myRow.entity.khoiluong * myRow.entity.dongia
      if (angular.isArray(rows)) {
        if (rows.length > 0) {
          rows.forEach(row => {
            if (row.entity.dongia && row.entity.khoiluongth) {
              tongcong += Math.round(row.entity.dongia * row.entity.khoiluongth);
            }
          });
        }
      }
      return tongcong;
    };
    $scope.gridOptions = {
      // showGridFooter: true,
      showColumnFooter: true,
      // enableFiltering: true,
      // enableSorting: false,
      // enableRowSelection: true,
      // enableSelectAll: true,
      // selectionRowHeaderWidth: 35,
      columnDefs: $scope.columns,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      // minRowsToShow: 1000,
      // virtualizationThreshold: 1000,
      // maxRowToShow: 1000
    };
    $scope.gridOptions.data = [];
    socket.emit('get list khoi luong giam sat', $stateParams.p_id, function (data) {
      console.log(data);
      $scope.bangkhoiluong = data;
      if (angular.isArray(data)) {
        data.forEach(function (e, i) {
          e.select = false;
        });
      }
      $scope.gridOptions.data = data;
      $scope.gridOptions.data[0]._congtachd = $scope._congtachd
    });
    $scope.gridOptions.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        var lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
        rowEntity.lcv_id = $scope._congtachd[rowEntity.idlcv]._id;
        console.log(rowEntity);
        socket.emit('update bang khoi luong', rowEntity, function (data) {});
      });
    };
    $scope.lapkehoach = function () {
      console.log($scope.gridApi);
      if (angular.isArray($scope.gridApi.grid.rows)) {
        var rows = $scope.gridApi.grid.rows;
        var selected_rows = [];
        rows.forEach(function (e, i) {
          console.log(e.entity.select);
          if (e.entity.select) {
            selected_rows.push(e.entity);
          }
        });
        socket.emit('tao ke hoach giam sat', selected_rows, function (data) {
          console.log(data);
          $state.go("app.projects.giamsat.kehoach", {
            p_id: $stateParams.p_id,
            kh_id: data.sokehoach
          });
        });
        console.log(selected_rows);
        $scope.gridApi.grid.rows.forEach(function (e, i) {
          e.entity.select = false;
        });
      }
    };

    $scope.xoa_congtac = function () {
      console.log($scope.gridApi);
      if (angular.isArray($scope.gridApi.grid.rows)) {
        var rows = $scope.gridApi.grid.rows;
        var selected_rows = [];
        var selected_pos = []
        rows.forEach(function (e, i) {
          if (e.entity.select) {
            selected_rows.push(e.entity);
            selected_pos.push(i)
          }
        });

        var modalInstance = $modal.open({
          templateUrl: 'module/boxes/delete_content.htm',
          controller: 'xoa_congtac',
          resolve: {
            ac: function () {
              return ({
                title: 'Xóa công tác',
                noti: 'Các công tác trên sẽ bị xóa khỏi hệ thống, hãy cân nhắc!'
              });
            }
          }
        });
        modalInstance.result.then(function () {
          // console.log(selected_rows);
          socket.emit('xoa cong tac bang khoi luong', selected_rows, function (data) {
            // console.log(data);
            selected_pos.forEach(function (_i) {
              $scope.gridOptions.data.splice(_i,1);
            })
            
            // $scope.gridApi.grid.rows.forEach(function (e, i) {
            //   e.entity.select = false;
            // });
          })
        }, function () {});
        // socket.emit('tao ke hoach giam sat', selected_rows, function (data) {
        //   console.log(data);
        //   $state.go("app.projects.giamsat.kehoach", {
        //     p_id: $stateParams.p_id,
        //     kh_id: data.sokehoach
        //   });
        // });
        // console.log(selected_rows);
        
      }
    };

    // $scope.getTableHeight = function () {
    //   var rowHeight = 30; // your row height
    //   var headerHeight = 30; // your header height
    //   return {
    //     height: ($scope.gridOptions.data.length * rowHeight + headerHeight) + "px !important"
    //   };
    // };
    // $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/100.json')
    // .then(function(response) {
    //   $scope.gridOptions.data = response.data;
    // });
    $scope.showStatus = function (ct) {
      // console.log(ct)
      if (ct) {
        var selected = $filter('filter')($scope.congtachd, {
          _id: ct._id
        });
        return (selected.length) ? selected[0].name : 'Chưa có';
      } else {
        return 'Chưa có';
      }
    };
    $scope.update_lcvtc = function (kl) {
      console.log(kl);
      socket.emit('update loai cong viec thi cong', kl, function (data) {
        // $scope.bangkhoiluong = $scope.bangkhoiluong;
      });
    };
    $scope.import_data = function () {
      var modalInstance = $modal.open({
        templateUrl: 'module/projects/modal/giamsat/nhaplieu.htm',
        controller: 'nhaplieu',
        size: 'md',
        resolve: {
          t: function () {
            return {

            };
          },
          ac: function () {
            return ({
              title: 'Hủy nhiệm vụ',
              noti: 'Nhiệm vụ này sẽ bị xóa khỏi hệ thống, hãy cân nhắc!'
            });
          }
        }
      });
      modalInstance.result.then(function (res) {
        socket.emit('get list khoi luong giam sat', $stateParams.p_id, function (data) {
          console.log(data)
          $scope.bangkhoiluong = data;
        });
      }, function () {});
    };

    // function huy_nhiemvu(data, m) {
    //   if (data.ac === 'huy_nhiemvu') {
    //     var modalInstance = $modal.open({
    //       templateUrl: 'module/boxes/delete_content.htm',
    //       controller: 'huy_nhiemvu',
    //       resolve: {
    //         t: function () {
    //           return {
    //             task: data.data._id,
    //             milestone: data.data.milestone._id
    //           };
    //         },
    //         ac: function () {
    //           return ({
    //             title: 'Hủy nhiệm vụ',
    //             noti: 'Nhiệm vụ này sẽ bị xóa khỏi hệ thống, hãy cân nhắc!'
    //           });
    //         }
    //       }
    //     });
    //     modalInstance.result.then(function (res) {
    //       console.log(res);
    //       console.log($scope.selected_m.tasks.indexOf(res.task));
    //       $scope.selected_m.tasks.splice($scope.selected_m.tasks.indexOf(res.task), 1);
    //     }, function () {});
    //   }
    // }
  }
]);
app.controller('nhaplieu', function ($modalInstance, $window, $scope, $stateParams, $rootScope, socket, t, ac) {
  console.log($stateParams);
  $scope.copyPasted = function ($event) {

    var text;
    if (typeof $event.originalEvent.clipboardData !== "undefined") {
      text = $event.originalEvent.clipboardData.getData('text/plain');
    } else { // To support browsers without clipboard API (IE and older browsers)
      $timeout(function () {
        text = angular.element($event.currentTarget).val();
      });
    }
    var source = [];
    source = $window.csvparse(text).data;
    console.log(source);

    if (source) {
      source.forEach(item => {
        if (item.length > 4) {
          item[3] = item[3].replace(/\./g, "");
          item[3] = item[3].replace(/\,/g, ".");
          item[4] = item[4].replace(/\./g, "");
        }
      });
    }
    $scope.csv_input = "";
    $scope.source = source;
  };
  $scope.ok = function () {
    var data = {
      p: $stateParams.p_id,
      source: $scope.source
    }
    socket.emit('add_khoiluong', data, function () {
      $modalInstance.close();
    });
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('xoa_congtac', function ($modalInstance, $scope, $rootScope, socket, ac) {
  $scope.ac = ac;
  $scope.ok = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.filter('mapGender', function () {
  return function (input, cthd) {
    // console.log(cthd);
    _cthd = {};
    _cthd = cthd;
    if (!input) {
      return '';
    } else {
      return _cthd[input].name;
    }
  };
});

function printpdf(url) {
  printJS(url);
}

function printhtml(html) {
  printHtmlElement.printHtml(html, {
    pageTitle: 'From HTML String',
    printMode: 'iframe',
    stylesheets: ['https://www.namviet.tk/css/invoices.css']
  });
}

function csvparse(csv) {
  var res;
  var config = {
    delimiter: ''
  };
  var data = Papa.parse(csv);
  return data;
}