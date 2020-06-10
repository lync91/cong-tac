'use strict';

/* Controllers */
// signin controller
app.controller('edit_project', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window',
  function ($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window) {
    $scope.param = $stateParams;
    console.log($stateParams);
    $scope.p = {};
    socket.emit('get logo', 1, function (data) {
      $scope.logo = data;
    });
    $scope.bia_width = 70;
    $scope.size_id = 34;
    $scope.size_congtrinh = 34;
    $scope.size_phongban = 19;
    $scope.table = {
      "width": "" + ($scope.bia_width * 100 / 27) + "px"
    }
    $scope.print = function () {
      $scope.table = $scope.table;
      var style = document.getElementById('style').innerHTML;
      // console.log(style);
      var innerContents = document.getElementById('htmlContent').innerHTML;
      // console.log(innerContents);
      $window.printhtml(innerContents, style);
    }
    var dd = {
      // a string or { width: number, height: number }
      pageSize: 'A4',
      // by default we use portrait, you can change it to landscape if you wish
      // pageOrientation: 'landscape',
      pageMargins: [40, 40, 40, 40],
      // header: headerObj,
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

    function generate() {
      pdfMake.createPdf(dd).getDataUrl(function (outDoc) {
        $scope.$apply(function () {
          // $scope.stats = 'generated in ' + (new Date().getTime() - lastGen.getTime()) + ' ms';
        });
        document.getElementById('pdfV').src = outDoc;
      });
    }
    var biacontent = function (p) {
      var tl = 100 / 37;
      var diadiem = "";
      if (p.diadiem) {
        diadiem = p.diadiem;
      }
      var nam = "";
      if (p.date_created) {
        var d = new Date(p.date_created)
        nam = d.getFullYear().toString();
      }
      return [{
        style: 'table1',
        table: {
          widths: [Number(28 * tl), Number(($scope.bia_width - 35) * tl)],
          heights: [Number(15 * tl), Number(110 * tl), 10, 10, 10, 24, 24],
          body: [
            [{
                stack: [{
                  image: 'logo',
                  width: 75
                }],
              },
              {
                text: p.project_id,
                // colSpan: 1,
                bold: true,
                fontSize: $scope.size_id,
                fillColor: '#ffe36f',
              }
            ],
            [{
                text: [p.project_title],
                colSpan: 2,
                bold: true,
                fontSize: $scope.size_congtrinh,
                margin: [5, 5, 5, 5]
              },
              {},
            ],
            [{
                text: ['CHỦ ĐẦU TƯ \n ', p.chudautu.company_name],
                colSpan: 2,
                bold: true
              },
              {},
            ],
            [{
                text: ['ĐỊA ĐIỂM \n', diadiem],
                colSpan: 2,
                bold: true,
              },
              {},
            ],
            [{
                text: ['PHÒNG '],
                colSpan: 2,
                bold: true,
                fillColor: '#ffe36f',
              },
              {},
            ],
            [{
              stack: [{
                image: 'qr',
                width: 75
              }],
              rowSpan: 2,
              },
              {
                text: [nam],
                bold: true,
                fontSize: 20
              },
            ],
            [{},
              {
                text: ''
              },
            ],
          ],
        }
      }, ]
    }
    socket.emit('get_project_details', $stateParams.id, function (data) {
      $scope.p = data;
      console.log(data);
      socket.emit('get logo uri data', function (data) {
        dd.images.logo = data;
        socket.emit('get_qr', 'DA' + data.project_id, function (data) {
          dd.images.qr = data;
          dd.content = biacontent($scope.p)
          generate()
        })
      });
    });
    $scope.ok = function () {
      dd.content = biacontent($scope.p)
      generate()
    }
  }
]);

function printhtml(html, style) {

  printHtmlElement.printHtml(html, {
    pageTitle: 'From HTML String',
    printMode: 'iframe',
    // styles: [style],
    stylesheets: ['http://www.namviet.tk/css/biahoso.css']
  });
}