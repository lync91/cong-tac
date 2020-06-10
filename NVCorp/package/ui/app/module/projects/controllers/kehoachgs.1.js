'use strict';

/* Controllers */
// signin controller
app.controller('kehoachgiamsat', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window', 'uiGridConstants',
function ($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window, uiGridConstants) {
  console.log($stateParams);
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
        width: 60,
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
        width: 80,
        displayName: 'Bắt đầu',
        superCol: 'group2',
        type: 'date',
        cellFilter: 'date:"dd/MM/yyyy"',
        cellClass: 'ui-grid-contents-wrapper',
        editableCellTemplate: '<div><form name="inputForm"><input type="text" ui-date-mask="DD-MM-YYYY" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
      },
      {
        name: 'khketthuc',
        width: 80,
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


  // pdfMake

  // playground requires you to assign document definition to a variable called dd

  var dd = {
    content: [{
        stack: [
          'hELLO',
          {
            text: 'This is a subheader',
            style: 'subheader'
          },
        ],
        style: 'header'
      },
      {
        text: [
          'Margins have slightly different behavior than other layout properties. They are not inherited, unlike anything else. They\'re applied only to those nodes which explicitly ',
          'set margin or style property.\n',
        ]
      },
      {
        text: 'This paragraph (consisting of a single line) directly sets top and bottom margin to 20',
        margin: [0, 20],
      },
      {
        stack: [{
            text: [
              'This line begins a stack of paragraphs. The whole stack uses a ',
              {
                text: 'superMargin',
                italics: true
              },
              ' style (with margin and fontSize properties).',
            ]
          },
          {
            text: ['When you look at the', {
              text: ' document definition',
              italics: true
            }, ', you will notice that fontSize is inherited by all paragraphs inside the stack.']
          },
          'Margin however is only applied once (to the whole stack).'
        ],
        style: 'superMargin'
      },
      {
        stack: [
          'I\'m not sure yet if this is the desired behavior. I find it a better approach however. One thing to be considered in the future is an explicit layout property called inheritMargin which could opt-in the inheritance.\n\n',
          {
            fontSize: 15,
            text: [
              'Currently margins for ',
              /* the following margin definition doesn't change anything */
              {
                text: 'inlines',
                margin: 20
              },
              ' are ignored\n\n'
            ],
          },
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
        ],
        margin: [0, 20, 0, 0],
        alignment: 'justify'
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'right',
        margin: [0, 190, 0, 80]
      },
      subheader: {
        fontSize: 14
      },
      superMargin: {
        margin: [20, 0, 40, 0],
        fontSize: 15
      }
    }

  }

  $scope.print = function () {
    pdfMake.createPdf(dd).print();
  };

  $scope.openPdf = function () {
    eval(editor.getSession().getValue());
    pdfMake.createPdf(dd).open();
  };

  $scope.download = function () {
    eval(editor.getSession().getValue());
    pdfMake.createPdf(dd).download('sample.pdf');
  };




}]);

// function printhtml(html, style) {

//   printHtmlElement.printHtml(html, {
//     pageTitle: 'From HTML String',
//     printMode: 'iframe',
//     // styles: [style],
//     stylesheets: ['http://www.namviet.tk/css/biahoso.css']
//   });
// }