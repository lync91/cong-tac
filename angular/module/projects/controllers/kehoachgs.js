'use strict';

/* Controllers */
// signin controller
app.controller('kehoachgiamsat', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window', 'uiGridConstants',
  function ($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window, uiGridConstants) {
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
      headerTemplate: 'module/projects/group/giamsat/kh-header-template.htm',
      superColDefs: [{
          name: 'group1',
          displayName: 'Thông tin công việc'
        },
        {
          name: 'group2',
          displayName: 'Thời gian'
        },
        {
          name: 'group3',
          displayName: 'Khối lượng thiết kế'
        }
      ],
      columnDefs: [{
          name: 'congtac.tencongtac',
          displayName: 'Tên công tác',
          superCol: 'group1',
          enableCellEdit: true,
          cellClass: 'ui-grid-contents-wrapper',
        },
        {
          name: 'congtac.donvi',
          width: 80,
          displayName: 'Đơn vị',
          superCol: 'group1',
          cellClass: 'ui-grid-contents-wrapper',
        },
        {
          name: 'vitri',
          width: 180,
          displayName: 'Vị trí',
          superCol: 'group1',
          cellClass: 'ui-grid-contents-wrapper',
        },
        {
          name: 'khbatdau',
          width: 100,
          displayName: 'Bắt đầu',
          superCol: 'group2',
          type: 'date',
          cellFilter: 'date:"dd/MM/yyyy"',
          cellClass: 'ui-grid-contents-wrapper',
          editableCellTemplate: '<div><form name="inputForm"><input type="text" ui-date-mask="DD-MM-YYYY" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
        },
        {
          name: 'khketthuc',
          width: 100,
          displayName: 'Kết thúc',
          superCol: 'group2',
          type: 'date',
          cellFilter: 'date:"dd/MM/yyyy"',
          cellClass: 'ui-grid-contents-wrapper',
          editableCellTemplate: '<div><form name="inputForm"><input type="text" ui-date-mask="DD-MM-YYYY" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
        },
        {
          name: 'diengiaikhoiluongtk',
          width: 180,
          displayName: 'Diễn giải',
          superCol: 'group3',
          cellClass: 'ui-grid-contents-wrapper',
        },
        {
          name: 'khoiluongtk',
          width: 90,
          displayName: 'Khối lượng',
          superCol: 'group3',
          cellFilter: 'number',
          cellClass: 'ui-grid-contents-wrapper pull-right',
          enableCellEdit: false,
        },
        // {
        //   name: 'ghichu',
        //   width: 140,
        //   displayName: 'Ghi chú',
        //   superCol: 'group3',
        //   cellClass: 'ui-grid-contents-wrapper',
        // }
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
        if (colDef.name == "diengiaikhoiluongtk") {
          rowEntity.khoiluongtk = $scope.$eval(rowEntity.diengiaikhoiluongtk);
        }
        console.log(rowEntity);
        socket.emit('update cong tac giam sat', rowEntity, function (data) {

        });

      });
    };
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