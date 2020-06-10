'use strict';

/* Controllers */
// signin controller
app.controller('bieumaugiamsat', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', '$window', 'uiGridConstants',
  function ($rootScope, $scope, socket, $http, $location, $modal, $stateParams, $window, uiGridConstants) {
    console.log($stateParams);
    $scope.param = $stateParams;
    $scope.okkk = function (str) {
      var res = $scope.$eval(str);
      console.log(res);

    };
    $scope.kehoach = {};
    $scope.logodata = "";


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
    // $scope.gridOptions.onRegisterApi = function (gridApi) {
    //   //set gridApi on scope
    //   $scope.gridApi = gridApi;
    //   gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
    //     var lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
    //     // rowEntity.lcv_id = $scope._congtachd[rowEntity.idlcv]._id;
    //     // console.log(rowEntity);
    //     // socket.emit('update bang khoi luong', rowEntity, function (data) {});
    //     console.log(colDef);
    //     if (colDef.name == "diengiaikhoiluongtk") {
    //       rowEntity.khoiluongtk = $scope.$eval(rowEntity.diengiaikhoiluongtk);
    //     }
    //     console.log(rowEntity);
    //     socket.emit('update cong tac giam sat', rowEntity, function (data) {
    //     });
    //   });
    // };
    // pdfMake
    // playground requires you to assign document definition to a variable called dd
    var headerObj = {
      margin: [40, 25, 40, 10],
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
                      text: "Điện thoại: 12345668899             Fax: 12345678",
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
    var khcontent = function () {
      var khbody = [
        [{
            text: 'Thông tin công tác',
            style: 'tableHeader',
            colSpan: 5,
            alignment: 'center'
          }, {}, {}, {}, {},
          {
            text: 'Thời gian',
            style: 'tableHeader',
            colSpan: 2,
            alignment: 'center'
          },
          {},
          {
            text: 'Khối lượng',
            style: 'tableHeader',
            colSpan: 2,
            alignment: 'center'
          },
          {}
        ],
        [{
            text: 'STT',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Mã công tác',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Tên công tác',
            style: 'tableHeader',
            alignment: 'center'
          }, {
            text: 'Đơn vị',
            style: 'tableHeader',
            alignment: 'center'
          }, {
            text: 'Vị trí',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Bắt đầu',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Kết thúc',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Diễn giải',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Khối lượng',
            style: 'tableHeader',
            alignment: 'center'
          }
        ],
      ];
      if (angular.isArray($scope.kehoach.dscongtac)) {
        var dscongtac = $scope.kehoach.dscongtac;
        dscongtac.forEach(function (e, i) {
          var vitri = "";
          var tencongtac = "";
          var donvi = "";
          var khbatdau = "";
          var khketthuc = "";
          var diengiaikhoiluongtk = "";
          var khoiluongtk = "";

          if (e.vitri) {
            vitri = e.vitri;
          }
          if (e.congtac.tencongtac) {
            tencongtac = e.congtac.tencongtac;
          }
          if (e.congtac.donvi) {
            donvi = e.congtac.donvi;
          }
          if (e.khbatdau) {
            var date = new Date(e.khbatdau)
            khbatdau = "" + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
          }
          if (e.khketthuc) {
            var date = new Date(e.khketthuc)
            khketthuc = "" + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
          }
          if (e.diengiaikhoiluongtk) {
            diengiaikhoiluongtk = e.diengiaikhoiluongtk;
          }
          if (e.khoiluongtk) {
            khoiluongtk = e.khoiluongtk;
          }
          khbody.push([{
              text: i + 1,
              alignment: 'center'
            },
            "CT" + e.socongtac,
            tencongtac,
            donvi,
            vitri,
            khbatdau,
            khketthuc,
            diengiaikhoiluongtk,
            khoiluongtk
          ]);
        });

      }
      console.log(khbody);

      return [{
          stack: [{
              text: "KẾ HOẠCH GIÁM SÁT CÔNG VIỆC",
              style: 'header'
            },
            {
              margin: 3,
              text: ['Số: KH', $scope.kehoach._id.sokehoach],
              style: 'subheader',
              fontSize: 11
            },
            {
              text: 'Tp. HCM, ngày     tháng     năm 2018',
              style: 'date_header'
            },
            {
              text: ['Dự án: ', $scope.kehoach._id.project.project_title],
              bold: true
            },
            {
              text: ["Người lập: ", $scope.kehoach._id.created_by.fullname],
              margin: [0, 3, 0, 5]
            }
          ],

        },
        {
          style: 'tableExample',
          table: {
            widths: [25, 50, '*', 'auto', 100, 65, 65, 100, 'auto'],
            headerRows: 2,
            // keepWithHeaderRows: 1,
            body: khbody
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
      ];
    }

    var bckhcontent = function () {
      var khbody = [
        [{
            text: 'Thông tin công tác',
            style: 'tableHeader',
            colSpan: 5,
            alignment: 'center'
          }, {}, {}, {}, {},
          {
            text: 'Thời gian thực hiện',
            style: 'tableHeader',
            colSpan: 2,
            alignment: 'center'
          },
          {},
          {
            text: 'Khối lượng thiết kế',
            style: 'tableHeader',
            alignment: 'center',
            rowSpan: 2
          },
          {
            text: 'Khối lượng',
            style: 'tableHeader',
            colSpan: 2,
            alignment: 'center'
          },
          {}
        ],
        [{
            text: 'STT',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Mã công tác',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Tên công tác',
            style: 'tableHeader',
            alignment: 'center'
          }, {
            text: 'Đơn vị',
            style: 'tableHeader',
            alignment: 'center'
          }, {
            text: 'Vị trí',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Bắt đầu',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Kết thúc',
            style: 'tableHeader',
            alignment: 'center'
          },
          {},
          {
            text: 'Diễn giải',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Khối lượng',
            style: 'tableHeader',
            alignment: 'center'
          }
        ],
      ];
      if (angular.isArray($scope.kehoach.dscongtac)) {
        var dscongtac = $scope.kehoach.dscongtac;
        dscongtac.forEach(function (e, i) {
          var vitri = "";
          var tencongtac = "";
          var donvi = "";
          var thbatdau = "";
          var thketthuc = "";
          var diengiaikhoiluongth = "";
          var khoiluongth = "";
          var khoiluongtk = "";
          if (e.vitri) {
            vitri = e.vitri;
          }
          if (e.congtac.tencongtac) {
            tencongtac = e.congtac.tencongtac;
          }
          if (e.congtac.donvi) {
            donvi = e.congtac.donvi;
          }
          if (e.thbatdau) {
            var date = new Date(e.thbatdau)
            thbatdau = "" + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
          }
          if (e.thketthuc) {
            var date = new Date(e.thketthuc)
            thketthuc = "" + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
          }
          if (e.diengiaikhoiluongth) {
            diengiaikhoiluongth = e.diengiaikhoiluongth;
          }
          if (e.khoiluongth) {
            khoiluongth = e.khoiluongth;
          }
          if (e.khoiluongtk) {
            khoiluongtk = e.khoiluongtk;
          }
          khbody.push([{
              text: i + 1,
              alignment: 'center'
            },
            "CT" + e.socongtac,
            tencongtac,
            donvi,
            vitri,
            thbatdau,
            thketthuc,
            khoiluongtk,
            diengiaikhoiluongth,
            khoiluongth
          ]);
        });

      }

      return [{
          stack: [{
              text: "BÁO CÁO HOÀNH THÀNH KẾ HOẠCH GIÁM SÁT",
              style: 'header'
            },
            {
              margin: 3,
              text: ['Số: KH', $scope.kehoach._id.sokehoach],
              style: 'subheader',
              fontSize: 11
            },
            {
              text: 'Tp. HCM, ngày     tháng     năm 2018',
              style: 'date_header'
            },
            {
              text: ['Dự án: ', $scope.kehoach._id.project.project_title],
              bold: true
            },
            {
              text: ["Người lập: ", $scope.kehoach._id.created_by.fullname],
              margin: [0, 3, 0, 5]
            }
          ],

        },
        {
          style: 'tableExample',
          table: {
            widths: [25, 50, '*', 'auto', 100, 53, 53, 50, 100, 'auto'],
            headerRows: 2,
            // keepWithHeaderRows: 1,
            body: khbody
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
      ];
    }


    function romanize(num) {
      if (!+num)
        return NaN;
      var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
          "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
          "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"
        ],
        roman = "",
        i = 3;
      while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
      return Array(+digits.join("") + 1).join("M") + roman;
    }

    var ct_content = function (ct) {
      var khbatdau = "";
      var khketthuc = "";
      if (ct.khbatdau) {
        var batdau = new Date(ct.khbatdau);
        khbatdau = batdau.getDate() + "/" + batdau.getMonth() + "/" + batdau.getFullYear();
      };
      if (ct.khketthuc) {
        var khketthuc = new Date(ct.khketthuc);
        khketthuc = khketthuc.getDate() + "/" + khketthuc.getMonth() + "/" + khketthuc.getFullYear();
      };
      var nd = [];
      nd.push(
        [{
            text: 'STT',
            bold: true,
            alignment: 'center'
          },
          {
            text: 'Nội dung đánh giá',
            bold: true,
            alignment: 'center'
          }, {
            text: 'Phương thức đánh giá',
            bold: true,
            alignment: 'center'
          },
          {
            text: 'Kết quả',
            bold: true,
            alignment: 'center'
          }
        ])
      if (angular.isArray(ct.nd)) {
        ct.nd.forEach(function (e, i) {
          nd.push([{
            text: romanize((i + 1)),
            bold: true,
            alignment: 'center'
          }, {
            text: e.thanhphancongviec.name,
            bold: true
          }, ' ', ' '])
          if (angular.isArray(e.noidung)) {
            e.noidung.forEach(function (ee, ii) {
              var noidungdanhgia = ee.noidungdanhgia ? ee.noidungdanhgia : "";
              var phuongthucdanhgia = ee.phuongthucdanhgia ? ee.phuongthucdanhgia : "";
              nd.push([{
                  text: (ii + 1),
                  alignment: 'center'
                },
                {
                  text: noidungdanhgia
                },
                {
                  text: phuongthucdanhgia,
                  italics: true
                }, {}
              ])
              if (ee.tieuchiphu) {
                ee.tieuchiphu.forEach(t => {
                  var tieuchi = t.tieuchi ? t.tieuchi : ""
                  var phuongthuc = t.phuongthuc ? t.phuongthuc : ""
                  var _tieuchi = tieuchi.split("[]");
                  var tc = [];
                  _tieuchi.forEach(function (e) {
                    tc.push({
                      text: "\u25A2",
                      
                    })
                  })
                  nd.push([{},
                    {
                      text: [" - ", tieuchi],
                      italics: true,
                      margin: [5, 0, 0 ,0]
                    },
                    {
                      text: phuongthuc,
                      italics: true
                    }, {}
                  ])
                });
              }
            });
          }
        });
      }
      return [{
          stack: [{
              text: "BÁO CÁO CÔNG TÁC GIÁM SÁT",
              style: 'header'
            },
            {
              margin: 3,
              text: ['Số: CT', ct.socongtac],
              style: 'subheader',
              fontSize: 11
            },
            {
              text: 'Tp. HCM, ngày     tháng     năm 2018',
              style: 'date_header'
            },
            {
              text: ['Công trình: ', $scope.kehoach._id.project.project_title],
              bold: true,
              style: 'ct_header'
            },
            {
              text: 'Địa điểm: ',
              bold: true,
              style: 'ct_header'
            },
            {
              text: ['Loại công việc: ', ct.congtac.loaicongviec.name],
              bold: true,
              style: 'ct_header'
            },
            // {
            //   text: ["Người lập: ", $scope.kehoach._id.created_by.fullname],
            //   margin: [0, 3, 0, 5]
            // }
          ],
        },
        {
          stack: [{
              text: "A. THÔNG TIN CÔNG TÁC",
              style: 'ct_header'
            },
            {
              text: ['Tên công tác: ', ct.congtac.tencongtac],
              // style: 'subheader',
              // fontSize: 11
            },
            {
              text: ['Vị trí: ', ct.vitri],

            },
            {
              text: 'Thời gian thực hiện.',
              style: 'ct_header'
            },
            {
              style: 'table1',
              table: {
                widths: ['*', '*', '*', '*'],
                body: [
                  [{
                    text: 'Theo kế hoạch',
                    colSpan: 2
                  }, {}, {
                    text: 'Theo thực tế',
                    colSpan: 2
                  }, {}],
                  ['Bắt đầu', 'Kết thúc', 'Bắt đầu', 'Kết thúc'],
                  [{
                    text: [khbatdau]
                  }, {
                    text: [khketthuc]
                  }, ' ', ' '],
                  [{
                    text: 'Ghi chú: \n ',
                    colSpan: 4,
                    alignment: 'left'
                  }, '', '', '']
                ],
              }
            },
            {
              text: 'Khối lượng thực hiện.',
              style: 'ct_header'
            },
            {
              style: 'table1',
              table: {
                widths: [22, 70, 60, '*', 60],
                body: [
                  [{
                      text: 'STT',
                    },
                    {
                      text: 'Nội dung'
                    }, {
                      text: 'Đơn vị',
                    },
                    {
                      text: 'Diễn giải',
                    },
                    {
                      text: 'Khối lượng'
                    }
                  ],
                  ['1', 'Theo thiết kế', ct.congtac.donvi, ct.diengiaikhoiluongtk, ct.khoiluongtk],
                  ['2', 'Theo thực tế', ct.congtac.donvi, ' ', ' ']
                ],
              }
            },
          ],
        },
        {
          stack: [{
              text: "B. NỘI DUNG GIÁM SÁT",
              style: 'ct_header'
            },
            {
              // style: 'table1',
              table: {
                widths: [22, '*', 90, 90],
                headerRows: 1,
                body: nd,
              }
            },
          ]
        },
        {
          stack: [{
              text: "C. KẾT LUẬN",
              style: 'ct_header'
            },
            {
              // style: 'table1',
              table: {
                widths: ['*'],
                body: [
                  ['Báo cáo kết quả: \n ', ],
                  ['Kiến nghị: \n ', ]
                ],
              }
            },
          ]
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
                text: ["NGƯỜI LẬP\n\n\n\n\n\n ", $scope.kehoach._id.created_by.fullname]
              }
            ]
          }]
        }
      ];
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

    function generate() {
      pdfMake.createPdf(dd).getDataUrl(function (outDoc) {
        $scope.$apply(function () {
          // $scope.stats = 'generated in ' + (new Date().getTime() - lastGen.getTime()) + ' ms';
        });
        document.getElementById('pdfV').src = outDoc;
      });
    }
    socket.emit('get logo uri data', function (data) {
      dd.images.logo = data;

      socket.emit('get ke hoach details', $stateParams.kh_id, function (data) {
        $scope.kehoach = data;
        if ($scope.param.ac == 'kehoach') {
          if ($scope.param.ct == 0) {
            $scope.gen_kehoach();
          } else {
            $scope.gen_bieumau_ct($scope.param.ct);
          }
        }
        if ($scope.param.ac == 'baocaokehoach') {
          $scope.gen_baocaokehoach();
        }
      });
    });
    $scope.gen_kehoach = function () {
      dd.content = khcontent();
      var sokehoach = "KH" + $scope.kehoach._id.sokehoach;
      socket.emit('get_qr', sokehoach, function (qrdata) {
        dd.images.qr = qrdata;
        generate();
      });
    }
    $scope.gen_baocaokehoach = function () {
      dd.content = bckhcontent();
      var sokehoach = "KH" + $scope.kehoach._id.sokehoach;
      socket.emit('get_qr', sokehoach, function (qrdata) {
        dd.images.qr = qrdata;
        generate();
      });
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
    $scope.gen_bieumau_ct = function (_ct) {
      console.log(ct);
      var ct = {};
      $scope.kehoach.dscongtac.forEach(function (e, i) {
        if (e.socongtac == _ct) {
          // $scope.gen_bieumau_ct
          console.log(e);
          
          ct = e;
          socket.emit('get list bieu mau', ct.congtac.loaicongviec, function (data) {
            ct.nd = data;
            dd.pageOrientation = 'portrait';
            dd.pageMargins = [60, 80, 40, 40];
            headerObj.margin = [60, 25, 40, 10];
            dd.content = ct_content(ct);
            var sokehoach = "CT" + ct.socongtac;
            socket.emit('get_qr', sokehoach, function (qrdata) {
              dd.images.qr = qrdata;
              generate();
            });
          });
        }
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