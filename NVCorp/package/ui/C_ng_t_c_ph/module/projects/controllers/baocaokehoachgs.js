'use strict';

/* Controllers */
// signin controller
app.controller('baocaokehoachgiamsat', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$state', '$stateParams', '$window', 'uiGridConstants',
  function ($rootScope, $scope, socket, $http, $location, $modal, $state, $stateParams, $window, uiGridConstants) {
    console.log($stateParams);
    $scope.param = $stateParams;
    $scope.okkk = function (str) {
      var res = $scope.$eval(str);
      console.log(res);
    };
    $scope.gridOptions = {
      showColumnFooter: true,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      // headerTemplate: 'module/projects/group/giamsat/kh-header-template.htm',
      // superColDefs: [{
      //     name: 'group1',
      //     displayName: 'Thông tin công việc'
      //   },
      //   {
      //     name: 'group2',
      //     displayName: 'Thời gian'
      //   },
      //   {
      //     name: 'group3',
      //     displayName: 'Khối lượng thiết kế'
      //   }
      // ],
      columnDefs: [{
          name: 'congtac.tencongtac',
          displayName: 'Tên công tác',
          // superCol: 'group1',
          enableCellEdit: false,
          cellClass: 'ui-grid-contents-wrapper',
        },
        {
          name: 'congtac.donvi',
          width: 60,
          displayName: 'Đơn vị',
          // superCol: 'group1',
          cellClass: 'ui-grid-contents-wrapper',
          enableCellEdit: false,
        },
        {
          name: 'vitri',
          width: 180,
          displayName: 'Vị trí',
          superCol: 'group1',
          cellClass: 'ui-grid-contents-wrapper',
          enableCellEdit: false,
        },
        {
          name: 'thbatdau',
          width: 100,
          displayName: 'Bắt đầu',
          // superCol: 'group2',
          type: 'date',
          cellFilter: 'date:"dd/MM/yyyy"',
          cellClass: 'ui-grid-contents-wrapper',
          enableCellEdit: true,
          editableCellTemplate: '<div><form name="inputForm"><input type="text" ui-date-mask="DD-MM-YYYY" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
        },
        {
          name: 'thketthuc',
          width: 100,
          displayName: 'Kết thúc',
          // superCol: 'group2',
          type: 'date',
          cellFilter: 'date:"dd/MM/yyyy"',
          cellClass: 'ui-grid-contents-wrapper',
          editableCellTemplate: '<div><form name="inputForm"><input type="text" ui-date-mask="DD-MM-YYYY" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
        },
        {
          name: 'diengiaikhoiluongth',
          width: 180,
          displayName: 'Diễn giải',
          // superCol: 'group3',
          cellClass: 'ui-grid-contents-wrapper',
        },
        {
          name: 'khoiluongth',
          width: 90,
          displayName: 'Khối lượng',
          // superCol: 'group3',
          cellFilter: 'number',
          cellClass: 'ui-grid-contents-wrapper',
          enableCellEdit: false,
        },
        {
          name: 'ghichu',
          width: 110,
          displayName: 'Ghi chú',
          // superCol: 'group3',
          cellClass: 'ui-grid-contents-wrapper',
        }
      ]
    };
    socket.emit('get ke hoach details', $stateParams.kh_id, function (data) {
      console.log(data);
      $scope.kehoach = data;
      $scope.gridOptions.data = data.dscongtac;
    });
    // socket.emit('get list khoi luong giam sat', $stateParams.p_id, function (data) {
    //   console.log(data);
    //   $scope.bangkhoiluong = data;
    //   if (angular.isArray(data)) {
    //     data.forEach(function (e, i) {
    //       e.select = false;
    //     });
    //   }
    //   $scope.gridOptions.data = data;
    //   $scope.gridOptions.data[0]._congtachd = $scope._congtachd
    // });
    $scope.gridOptions.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        var lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
        // rowEntity.lcv_id = $scope._congtachd[rowEntity.idlcv]._id;
        // console.log(rowEntity);
        // socket.emit('update bang khoi luong', rowEntity, function (data) {});
        console.log(colDef);
        if (colDef.name == "diengiaikhoiluongth") {
          rowEntity.khoiluongth = $scope.$eval(rowEntity.diengiaikhoiluongth);
        }
        console.log(rowEntity);
        // socket.emit('update cong tac giam sat', rowEntity, function (data) {

        // });

      });
    };
    var full = true;
    $scope.save = function () {
      full = true;
      $scope.gridOptions.data.forEach(e => {
        if (!e.thbatdau) {
          full = false;
        }
        if (!e.thketthuc) {
          full = false;
        }
        if (!e.khoiluongth) {
          full = false;
        }
      });
      if (full) {
        socket.emit('lap bao cao giam sat', $scope.gridOptions.data,function (res) {
          console.log(res);
          $state.go("app.projects.giamsat.bieumaubaocaokehoach", {
            p_id: $stateParams.p_id,
            kh_id: $scope.kehoach._id.sokehoach
          });
        });
      }else{
        console.log("Not OK");
        var modalInstance = $modal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'module/boxes/thongbao.htm',
          controller: 'thongbao',
          controllerAs: '$ctrl',
          size: '',
          resolve: {
            ac: function () {
              return {
                title: "Thông báo",
                noti: "Cột thời gian bắt đầu, kết thúc, khối lượng thực hiện phải được điền đầu đủ"
              }
            }
          }
        });
        modalInstance.result.then(function (data) {
          console.log(data)
          // m.trangthai = [data.trangthai];
        }, function () {
          // console.log('OK');
        });
      }
    }
  }
]);
// function printhtml(html, style) {

//   printHtmlElement.printHtml(html, {
//     pageTitle: 'From HTML String',
//     printMode: 'iframe',
//     // styles: [style],
//     stylesheets: ['http://www.namviet.tk/css/biahoso.css']
//   });
// }