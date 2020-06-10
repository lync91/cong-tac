'user strict';
//Controllers
// controller Hồ sơ dự án
app.controller('milestones', ['$rootScope', '$scope', 'socket', '$http', '$window', '$stateParams', '$modal', 'editableOptions', 'editableThemes',
  function($rootScope, $scope, socket, $http, $window, $stateParams, $modal, editableOptions, editableThemes) {
    console.log($stateParams);
    // if ($stateParams.mid) {
    //   console.log($stateParams.mid);
    //   socket.emit('get_milestone', $stateParams.mid, function(data) {
    //     console.log('m', data);
    //     $scope.chitiet(data);
    //   });
    // }
    $('.ms-box').removeClass('hidden');
    $('.ms-load').addClass('hidden');
    $scope.isShowcp = false;
    $scope.project = $scope.p;
     //$scope.user = $rootScope.globals.user_details;
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
    // $scope.dateOptions = {
    //     dateDisabled: disabled,
    //     formatYear: 'yy',
    //     maxDate: new Date(2020, 5, 22),
    //     minDate: new Date(),
    //     startingDay: 1
    // };
    // function disabled(data) {
    //     var date = data.date,
    //         mode = data.mode;
    //     return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    // }
    $scope.hsnhan = {};
    $scope.start_date = new Date();
    $scope.due_date = new Date();
    $scope.ms_box = 'hidden';
    $scope.project = {};
    socket.emit('get_project_details', $stateParams.p_id, function(data) {
      console.log(data);
      $scope.project = data;
      $scope.p = data;
      $('.ms-box').removeClass('hidden');
      $('.ms-load').addClass('hidden');
    });
    $scope.chitiet = function(m) {
      var modalInstance = $modal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'module/projects/modal/milestone/milestone.htm',
        controller: 'milestone',
        controllerAs: '$ctrl',
        size: 'milestone',
        // windowClass: 'milestone',
        resolve: {
          p: function() {
            return $scope.project;
          },
          m: function() {
            return m;
          },
          pn: function() {
            return $scope.dsphapnhan;
          },
          nv: function() {
            return $scope.dsnhanvien;
          },
        }
      });
      modalInstance.result.then(function(data) {
        // $ctrl.selected = selectedItem;
        // m.hopdong = data;
      }, function() {
        // console.log('OK');
        // socket.emit('get_project_details', $stateParams.p_id, function(data) {
        //     console.log(data);
        //     $scope.project = data;
        // });
      });
    };
    // $scope.update_hd = function(hd) {
    //     console.log(hd);
    //     socket.emit('update_hd', hd, function(data) {
    //         console.log(data);
    //     });
    // };
    $scope.selected_m = {};

    function huy_nhiemvu(data, m) {
      if (data.ac === 'huy_nhiemvu') {
        var modalInstance = $modal.open({
          templateUrl: 'module/boxes/delete_content.htm',
          controller: 'huy_nhiemvu',
          resolve: {
            t: function() {
              return {
                task: data.data._id,
                milestone: data.data.milestone._id
              };
            },
            ac: function() {
              return ({
                title: 'Hủy nhiệm vụ',
                noti: 'Nhiệm vụ này sẽ bị xóa khỏi hệ thống, hãy cân nhắc!'
              });
            }
          }
        });
        modalInstance.result.then(function(res) {
          console.log(res);
          console.log($scope.selected_m.tasks.indexOf(res.task));
          $scope.selected_m.tasks.splice($scope.selected_m.tasks.indexOf(res.task), 1);
        }, function() {});

      }
    }
    $scope.delete_file = function(size, parentSelector, hs, m) {
      var parentElem = parentSelector ?
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
      var modalInstance = $modal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'module/projects/modal/delete_file.htm',
        controller: 'delete_file',
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem,
        resolve: {
          hs: function() {
            return hs;
          },
          m: function() {
            return m;
          },
          p: function() {
            return $scope.project._id;
          }
        }
      });
      modalInstance.result.then(function(selectedItem) {}, function() {
        console.log('OK');
      });
    };


    var task_added = {};
    $scope.trangthai = [];
    socket.emit('get_trangthaihoso', 1, function(data) {
      console.log(data);
      $scope.trangthai = data;
    });
    $scope.update_trangthai = function(m, tt) {
      if (m) {
        var data = {
          p_id: $scope.project._id,
          m_id: m._id,
          tt_id: tt._id,
          tt_name: tt.name
        };
        socket.emit('update_trangthai', data, function(res) {
          m.trangthai = res;
        });
      }
    };
    // $scope.m_clicked = {};
    // $scope.m_click = function(m) {
    //     if (m.collapse) {
    //         m.collapse = false;
    //     } else {
    //         $scope.project.milestones.forEach(function(_m, i) {
    //             $scope.project.milestones[i].collapse = false;
    //         });
    //         m.collapse = !m.collapse;
    //     }
    //
    // };
    // $scope.open = function($event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();
    //
    //     $scope.opened = true;
    // };

    // $scope.assigned_u_panel_visable = "hidden";
    // $scope.selected_m = [];
    // $scope.datepicked = function(m) {
    //     socket.emit('update_m', m);
    // };
    // $scope.altInputFormats = 'MM-dd-yyyy';

    $scope.param = {};
    $scope.nhomhs = [];
    socket.emit('get_giaidoan', 1, function(data) {
      $scope.giaidoan = data;
    });
    socket.emit('get_loaicongviec', 1, function(data) {
      $scope.loaicongviec = data;
    });
    socket.emit('get_nhomhs', 1, function(data) {
      $scope.nhomhs = data;
    });
    $scope.themhoso = function(size, parentSelector) {
      var parentElem = parentSelector ?
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
      var modalInstance = $modal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'module/projects/modal/themhoso.htm',
        controller: 'themhoso',
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem,
        resolve: {

          lcv: function() {
            return $scope.loaicongviec;
          },
          gd: function() {
            return $scope.giaidoan;
          },
          p_id: function() {
            return $stateParams.p_id;
          },
          nhs: function() {
            return $scope.nhomhs;
          }
        }
      });
      modalInstance.result.then(function(p) {
        socket.emit('get_project_details', $stateParams.p_id, function(data) {
          // console.log(data);
          $scope.project = data;
          $scope.p = data;
          $('.ms-box').removeClass('hidden');
          $('.ms-load').addClass('hidden');
        });
      }, function() {
        console.log('OK');
      });
    };
    $scope.themhoso_mau = function(size, parentSelector) {
      var parentElem = parentSelector ?
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
      var modalInstance = $modal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'module/projects/modal/themhoso_mau.htm',
        controller: 'themhoso_mau',
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem,
        resolve: {
          lcv: function() {
            return $scope.loaicongviec;
          },
          gd: function() {
            return $scope.giaidoan;
          },
          p_id: function() {
            return $scope.project._id;
          }
        }
      });
      modalInstance.result.then(function(d) {
        socket.emit('get_project_details', $stateParams.p_id, function(data) {
          // console.log(data);
          $scope.project = data;
          $scope.p = data;
          $('.ms-box').removeClass('hidden');
          $('.ms-load').addClass('hidden');
        });
      }, function() {
        console.log('OK');
      });
    };

    $scope.sortableOptions = {
      // disabled: true
    };
    $scope.onDropComplete = function(data, evt) {
      console.log("drop success, data:", data);
    }
    $scope.list4 = [];

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
    $scope.sortableCallback = function(sourceModel, destModel, start, end, lcv) {
      console.log(lcv);
      console.log(start + ' -> ' + end);
    };

    $scope.hideMe = function() {
      return $scope.list4.length > 0;
    }
    $scope.diadiem = [];
    socket.emit('get_chudautu', 1, function(data) {
      $scope.diadiem = data;
      console.log(data);
    });

    $scope.tao_giaonhan = function(data) {
      var modalInstance = $modal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'module/projects/modal/tao_giaonhan.htm',
        controller: 'tao_giaonhan',
        controllerAs: '$ctrl',
        size: '',
        resolve: {
          listm: function() {
            return $scope.list4;
          },
          p: function() {
            return $scope.p;
          },
          diadiem: function() {
            return $scope.diadiem;
          }
        }
      });
      modalInstance.result.then(function(data) {
        // $modalInstance.close(data);
        // m.hopdong = data;
      }, function() {
        // $modalInstance.close(data);
        console.log('DSDSDSD');
        $scope.list4 = [];
        $scope.isShowcp = false;
      });
    };

  }
]);
app.controller('tao_giaonhan', function($modalInstance, $scope, $rootScope, socket, listm, p, diadiem, $stateParams, $window, $timeout) {
  // $scope.logo = logo
  $scope.alert = { type: 'success', msg: 'Khởi tạo biên bản bàn giao hồ sơ thành công !' };
  $scope.printable = false;
  $scope.p = p;
  $scope.listm = [];
  $scope.listm = listm;
  $scope.listm.forEach(function(m, i) {
    m.sl = 1;
  })
  $scope.diadiem = [{
    pos: {}
  }];

  $scope.diadiem = diadiem;
  $scope.localSearch = function(_str) {
    // console.log(str);
    var matches = [];
    $scope.diadiem.forEach(function(d, i) {
      // console.log(d);
      itemMatches = false;
      var strcon = function(str) {
        if (str) {
          str = str.toLowerCase();
          str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
          str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
          str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
          str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
          str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
          str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
          str = str.replace(/đ/g, "d");
          return str;
        }
      }
      var text = strcon(_str);
      // console.log('text', text);
      var str = strcon(d.company_name);
      if (str) {
        var res = str.match(text);
        if (res != null) {
          itemMatches = true;
        }
      }
      if (matches.length < 10) {
        if (itemMatches) {
          matches.push(d);
        }
        // matches.push(d);
      }
    });
    return matches;
  };
  console.log($scope.listm);
  $scope.print = function() {
    // console.log($scope.selectedCountry);
    $scope.logo = "";
    socket.emit('get logo', 1, function(data) {
      $scope.logo = data;
      socket.emit('get_qr', "http://www.namviet.tk/app/projects/view/59c0d0b4c9b6c51a6d9e8a9a/milestones.html", function (data) {
        console.log(data);

        $scope.qr = data;
        timer = $timeout(function() {
          var innerContents = document.getElementById('bbgiaonhan').innerHTML;
          console.log(innerContents);
          $window.printhtml(innerContents);
        }, 500);
      })
      // console.log(data);

    })
    // var innerContents = document.getElementById('bbgiaonhan').innerHTML;
    //     var popupWinindow = window.open('', '', 'width=1000,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    //     popupWinindow.document.open();
    //     popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    //     popupWinindow.document.close();


  }
  $scope.save = function() {
    // console.log($scope.hs);
    // socket.emit('add_milestones', $scope.hs, function(d) {
    //   console.log(d);
    //   $modalInstance.close(d);
    // });
    var data = {
      project: p._id,
      milestones: []
    }
    $scope.listm.forEach(function(m, i) {
      data.milestones.push({
        _id: m._id,
        sl: m.sl
      });

    });
    socket.emit('trinh_ky_nhieu_ho_so', data, function (res) {
      console.log(res);
      $scope.printable = true;
    })
    console.log(data);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('themhoso_mau', function($modalInstance, $scope, $rootScope, socket, lcv, gd, p_id, $stateParams) {
  console.log(gd);
  $scope.hs = {
    p_id: p_id,
    phongth: $rootScope.globals.user_details.company
  };
  $scope.lct = [];
  $scope.gd = [];
  $scope.lcv = lcv;
  $scope.gd = gd;
  $scope.gd.push({
    _id: 1,
    giaidoan: 'Tất cả'
  })
  $scope.hs.lcv = lcv[0];

  $scope.hs.gd = $scope.gd[$scope.gd.length - 1];
  $scope.ok = function() {
    console.log($scope.hs);
    if ($scope.hs.gd._id == 1) {

    }
    socket.emit('add_milestones', $scope.hs, function(d) {
      // console.log(d);
      $modalInstance.close(d);
    });

  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('themhoso', function($modalInstance, $scope, $rootScope, socket, lcv, gd, p_id, nhs, $stateParams) {
  console.log(p_id);
  $scope.hs = {
    p_id: p_id,
    phongth: $rootScope.globals.user_details.company
  };
  $scope.lcv = lcv;
  $scope.gd = gd;
  $scope.nhs = nhs;
  $scope.hs.lcv = lcv[0];
  $scope.hs.gd = $scope.gd[0];
  $scope.hs.nhs = nhs[0];
  $scope.ok = function() {
    console.log($scope.hs);
    socket.emit('add_milestone', $scope.hs, function(d) {
      $modalInstance.close(d);
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('khoitaohopdong', function($modalInstance, $scope, $rootScope, socket, p, m, pn, nv) {
   //$scope.user_details = $rootScope.globals.user_details;
  console.log(nv);
  $scope.p = p;
  $scope.m = m;
  $scope.nv = nv;
  $scope.phapnhan = pn;
  $scope.ok = function() {
    // console.log($scope.dt);
    $scope.hd.milestone = m._id;
    console.log($scope.hd);
    socket.emit('khoitaohopdong', $scope.hd, function(data) {
      console.log(data);
      $modalInstance.close(data);
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
// ===============================
// *   Quản lý hồ sơ             *
// ===============================
app.controller('milestone', function($modalInstance, $modal, $scope, $rootScope, $stateParams, FileUploader, socket, $timeout) {
  console.log($stateParams);
  $scope.Math = Math;
  var uploader = $scope.uploader = new FileUploader({
    url: 'files/uploader/milestones',
    autoUpload: true
  });

  // FILTERS

  uploader.filters.push({
    name: 'customFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      return this.queue.length < 10;
    }
  });
  $scope.comment = {
    message: '',
    files: [],
    users: []
  };
  // CALLBACKS

  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    console.info('onBeforeUploadItem', item);
  };
  uploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };
  $scope.file_list = [];
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    // console.info('onCompleteItem', fileItem, response, status, headers);
    if (fileItem.headers.type == "comments") {
      console.log(response);
      $scope.file_list.push(response.file);
      $scope.comment.files = $scope.file_list;
      console.log($scope.file_list);
    }
  };
  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
  };
   //$scope.user_details = $rootScope.globals.user_details;
  // console.log(m);
  // $scope.p = p;
  // $scope.m = m;
  // $scope.nv = nv;
  // $scope.phapnhan = pn;
  $scope.dsnhanvien = [];
  $scope.dsphongban = [];
  $scope.dsphapnhan = [];
  $scope.dschudautu = [];
  $timeout(function () {
    socket.emit('get_milestone', $stateParams.mid, function(data) {
      $scope.m = data;
      console.log(data);
    });
    socket.emit('get_dsnhanvien', 1, function(data) {
      $scope.dsnhanvien = data;
    });
    socket.emit('get_phongban', 1, function(data) {
      $scope.dsphongban = data;
    });
    socket.emit('get_phapnhan', 1, function(data) {
      console.log(data);
      $scope.dsphapnhan = data;
    });
    socket.emit('get_chudautu', 1, function(data) {
      $scope.dschudautu = data;
    });
  }, 500);
  // Cập nhật hồ sơ
  $scope.update_ngayph = function(m) {
      console.log(m);
      socket.emit('update_m', m);
  };
  $scope.update_m = function(mm) {
    mm.p_id = $scope.p._id;
    socket.emit('update_m', mm, function(data) {
      console.log(data);
      $scope.m.activities.push(data.ac);
      m.milestone_name = $scope.m.milestone_name;
      m.sovanban = $scope.m.sovanban;
      m.ngayph = $scope.m.ngayph;
    });
  };
  //Thao tác Hợp đồng
  $scope.khoitaohopdong = function(mm) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/taohopdong.htm',
      controller: 'taohopdong',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        p: function() {
          return $scope.project;
        },
        m: function() {
          return mm;
        },
        pn: function() {
          return $scope.dsphapnhan;
        }
      }
    });
    modalInstance.result.then(function(data) {
      // $ctrl.selected = selectedItem;
      m.hopdong = data;
    }, function() {
      console.log('OK');
    });
  };

  $scope.update_hd = function(hd) {
    console.log(hd);
    socket.emit('update_hd', hd, function(data) {
      console.log(data);
      $scope.m.activities.push(data.ac);
      m.hopdong = $scope.m.hopdong;
    });
  };
  //Kết nối nghiệm thi với hợp đồng
  $scope.ketnoi_nghiemthu = function(m) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/ketnoi_nghiemthu.htm',
      controller: 'ketnoi_nghiemthu',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        p: function() {
          return $scope.project;
        },
        m: function() {
          return m;
        },
        pn: function() {
          return $scope.dsphapnhan;
        }
      }
    });
    modalInstance.result.then(function(data) {
      // $ctrl.selected = selectedItem;
      m.hopdong = data;
    }, function() {
      console.log('OK');
    });
  };
  $scope.trinhky = function(mm) {
    // console.log('Trinh ký');
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/trinhky.htm',
      controller: 'trinhky',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        p: function() {
          return $scope.p;
        },
        m: function() {
          return mm;
        },
        pn: function() {
          return $scope.dsphapnhan;
        },
        nv: function() {
          return $scope.dsnhanvien;
        },
      }
    });
    modalInstance.result.then(function(data) {
      m.trangthai = $scope.m.trangthai;
    }, function() {
      m.trangthai = $scope.m.trangthai;
    });
  };
  $scope.phieu_trinhky = function(tk) {
    socket.emit('get_trinhky', tk, function(res) {
      phieu_trinhky(res);
    });
  };
  //Phiếu trình ký hồ sơ
  var phieu_trinhky = function(data) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/phieu_trinhky.htm',
      controller: 'phieu_trinhky',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        tk: function() {
          return data;
        }
      }
    });
    modalInstance.result.then(function(data) {
      // $modalInstance.close(data);
      // m.hopdong = data;
    }, function() {
      // $modalInstance.close(data);
    });
  };
  //Giao việc
  $scope.giaoviec = function(size, parentSelector, mm) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/giaoviec.htm',
      controller: 'giaoviec',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        p: function() {
          return $scope.p;
        },
        m: function() {
          return mm;
        },
        nv: function() {
          return $scope.dsnhanvien;
        },
        pb: function() {
          return $scope.dsphongban;
        }
      }
    });
    modalInstance.result.then(function(dt) {
      console.log(dt);
      m.trangthai = dt.tt;
      // m.tasks.push(dt.t)
      var task = dt.t;
      socket.emit('get_alltasks_user', task.assigned_to._id, function(data) {
        // console.log(data);
        tasks = [];
        data.forEach(function(task, i) {
          var start = new Date(task.start_date);
          var end = new Date(task.due_date);
          tasks.push({
            title: task.task_name,
            start: start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate(),
            end: end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate(),
            allDay: true,
            t_id: task._id,
            className: ['b-l b-2x b-info'],
            location: 'Nam Việt',
            info: task.task_name
          });
        });
        bothithoigian('', '', task, tasks, m);
      });

    }, function() {
      console.log('OK');
    });
  };
  var bothithoigian = function(size, parentSelector, task, tasks, m) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/botrithoigian.htm',
      controller: 'botrithoigian',
      controllerAs: '$ctrl',
      size: 'lg',
      appendTo: parentElem,
      resolve: {
        task: function() {
          return task;
        },
        tasks: function() {
          return tasks;
        }

      }
    });
    modalInstance.result.then(function(task_added) {
      // $scope.m.tasks.push(task);
    }, function() {
      // $scope.m.tasks.push(task);
    });
  };
  //Giao nhận hồ sơ
  $scope.giaonhanhs = function(size, parentSelector, mm, ac) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/giaonhanhs.htm',
      controller: 'giaonhanhs',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        p_id: function() {
          return $scope.p._id;
        },
        m: function() {
          return mm;
        },
        nv: function() {
          return $scope.dsnhanvien;
        },
        pb: function() {
          return $scope.dsphongban;
        },
        ac: function() {
          return ac;
        }
      }
    });
    modalInstance.result.then(function(data) {
      bbgiaonhan(data.hsl);
      m.trangthai = $scope.m.trangthai;
      m.hosoluu = $scope.m.hosoluu;

    }, function() {
      console.log('OK');
    });
  };
  //Biên bản bàn giao
  var bbgiaonhan = function(bb) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/group/template/bb_giaonhan.htm',
      controller: 'bbgiaonhan',
      controllerAs: '$ctrl',
      resolve: {
        bb: function() {
          return bb;
        }
      }
    });
    modalInstance.result.then(function(selectedItem) {
      // $ctrl.selected = selectedItem;
    }, function() {
      console.log('OK');
    });
  };
  //Xóa hồ sơ
  $scope.delete_milestone = function(size, parentSelector, m) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/delete_content.htm',
      controller: 'delete_milestone',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        m: function() {
          return m;
        },
        ac: function() {
          return {
            title: 'Xóa hồ sơ dự án',
            noti: 'Hồ sơ này sẽ bị xóa khỏi dự án'
          };
        }
      }
    });
    modalInstance.result.then(function() {
      // socket.emit('get_project_details', $stateParams.p_id, function(data) {
      //     console.log(data);
      //     $scope.project = data;
      //     $('.ms-box').removeClass('hidden');
      //     $('.ms-load').addClass('hidden');
      // });
      $modalInstance.close();
    }, function() {

    });
  };
  //Chi tiết nhiệm vụ
  $scope.chitiet_nhiemvu = function(s, p, t, m) {
    $scope.selected_m = m;
    socket.emit('get_task_details', t, function(data) {
      _chitiet_nhiemvu('', '', data, m);
    });
  };
  var _chitiet_nhiemvu = function(size, parentSelector, t, m) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/chitiet_nhiemvu.htm',
      controller: 'chitiet_nhiemvu',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        task: function() {
          return t;
        },
        m: function() {
          return m;
        }
      }
    });
    modalInstance.result.then(function(data, m) {
      console.log(m);
      huy_nhiemvu(data, m);
    }, function(data) {

    });
  };
  //Bình luận hồ sơ
  $scope.comment_m = function(cm) {
    console.log($scope.comment);
    var data = {
      p: $scope.p._id,
      project_code: $scope.p.project_code,
      message: $scope.comment.message.replace(/(?!".*)\n(?!.*")/g, '\\n'),
      files: $scope.comment.files,
      users: [],
      m: $scope.m._id
    };
    socket.emit('milestone_comment', data, function(res) {
      $scope.m.activities.push(res);
      $scope.comment.message = '';
      $scope.comment.files = [];
      $scope.uploader.queue = [];
    });
  };
  // Báo lỗi
  $scope.baoloi = function(m) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/baoloi.htm',
      controller: 'trinhky',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        p: function() {
          return $scope.p;
        },
        m: function() {
          return m;
        },
        pn: function() {
          return $scope.dsphapnhan;
        },
        nv: function() {
          return $scope.dsnhanvien;
        },
      }
    });
    modalInstance.result.then(function(data) {
      // socket.emit('get_trinhky', data, function(res) {
      //     phieu_trinhky(res);
      // });
    }, function() {
      console.log('OK');
    });
  };
  //Chuyển phát
  $scope.chuyenphat = function(tk) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/chuyenphat.htm',
      controller: 'chuyenphat',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        p: function() {
          return $scope.p;
        },
        m: function() {
          return $scope.m;
        },
        tk: function() {
          return tk;
        },
        cdt: function() {
          return $scope.dschudautu;
        },
        nv: function() {
          return $scope.dsnhanvien;
        },
      }
    });
    modalInstance.result.then(function(data) {
      m.trangthai = $scope.m.trangthai;
      // socket.emit('get_trinhky', data, function(res) {
      //     phieu_trinhky(res);
      // });
    }, function() {
      console.log('OK');
    });
  };
  //Phiếu chuyển phát
  $scope.phieu_chuyenphat = function(cp) {
    socket.emit('get_chuyenphat', cp, function(res) {
      console.log(res);
      phieu_chuyenphat(res);
    });
  };
  var phieu_chuyenphat = function(data) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/phieu_chuyenphat.htm',
      controller: 'phieu_chuyenphaths',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        tk: function() {
          return data;
        }
      }
    });
    modalInstance.result.then(function(data) {
      // $modalInstance.close(data);
      // m.hopdong = data;
    }, function() {
      // $modalInstance.close(data);
    });
  };
  // Xóa file trong milestones
  $scope.delete_file = function(f) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/boxes/delete_content.htm',
      controller: 'delete_file',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        p: function() {
          return $scope.p;
        },
        m: function() {
          return $scope.m;
        },
        f: function() {
          return f;
        },
        ac: function() {
          return {
            title: 'Xóa file trong hồ sơ',
            noti: 'File này sẽ bị xóa khỏi hệ thống, hãy cân nhắc'
          };
        }
      }
    });
    modalInstance.result.then(function(data) {
      // socket.emit('get_trinhky', data, function(res) {
      //     phieu_trinhky(res);
      // });
    }, function() {
      console.log('OK');
    });
  };
  // Báo hồ sơ phê duyệt
  $scope.baoduyet = function(m) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/boxes/xacnhan.htm',
      controller: 'bao_duyet',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        p: function() {
          return $scope.p;
        },
        m: function() {
          return $scope.m;
        },
        ac: function() {
          return {
            title: 'Xác nhận hồ sơ phê duyệt',
            noti: 'Hồ sơ này sẽ được chuyển sang trạng thái được phê duyệt. Hãy lưu ý thu hồi hồ sơ từ Chủ đầu tư!'
          };
        }
      }
    });
    modalInstance.result.then(function(data) {
      m.trangthai = $scope.m.trangthai;
    }, function() {
      // console.log('OK');
    });
  };
  $scope.chitiet_hopdong = function(m) {
    $location.path('app/hopdong/' + m.hopdong._id + '/chitiet.html');
    $modalInstance.dismiss();
  };
  $scope.cancel = function() {
    $modalInstance.dismiss();
  };
});
app.controller('ketnoi_nghiemthu', function($modalInstance, $scope, $rootScope, socket, p, m, pn) {
  $scope.project = p;
  $scope.phapnhan = pn;
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };
  $scope.select_hd = function(ms) {
    console.log(ms);
  };
  $scope.ok = function() {
    // console.log($scope.selected_hd);
    $scope.project.milestones.forEach(function(ms, i) {
      if (ms.checked) {
        // console.log(ms.hopdong._id);
        m.hopdong = ms.hopdong._id;
        console.log(m);
        socket.emit('ketnoi_nghiemthu', m, function(data) {
          console.log(data);
        });
      }
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('giaoviec', function($modalInstance, $scope, $rootScope, socket, p, m, nv, pb) {
  $scope.t = {};
  if ($rootScope.globals.user_details.chucvu.level <= 2) {
    console.log('OK');
    $scope.pb = pb;
    $scope.t.phongban = pb[0];
  } else {
    pb.forEach(function(p, i) {
      if (p._id == $rootScope.globals.user_details.company._id) {
        $scope.pb = [p];
        $scope.t.phongth = p;
      }
    });
  }
  $scope.dsnv = nv;
  $scope.t.task_name = m.milestone_name;
  $scope.ok = function() {
    $scope.t.m_id = m._id;
    $scope.t.p_id = p._id;
    $scope.t.nhanvien = $scope.t.nhanvien._id;
    $scope.t.phongban = null;
    socket.emit('add_milestone_task', $scope.t, function(data) {
      m.tasks.push(data.t);
      m.activities.push(data.ac);
      $modalInstance.close(data);
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('taohopdong', function($modalInstance, $scope, $rootScope, $modal, socket, p, m, pn) {
  $scope.hd = {};
  $scope.format = 'dd-MM-yyyy';
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.phapnhan = pn;
  $scope.today();
  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1,
    class: 'datepicker'
  };

  $scope.them_phapnhan = function(phapnhan_id) {
      var modalInstance = $modal.open({
          templateUrl: 'module/projects/modal/them_chudautu.htm',
          controller: 'them_phapnhan',
          resolve: {
            phapnhan_id: function () {
              return phapnhan_id;
            }
          }
      });
      modalInstance.result.then(function(phapnhan) {
          $scope.phapnhan.push(phapnhan);
          $scope.hd.dvthuchien = phapnhan;
      }, function() {
      });
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };
  $scope.ok = function() {
    // console.log($scope.dt);
    $scope.hd.milestone = m._id;
    console.log($scope.hd);
    socket.emit('khoitaohopdong', $scope.hd, function(data) {
      console.log(data);
      $modalInstance.close(data);
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('them_phapnhan', ['$scope', '$modalInstance', 'socket', 'phapnhan_id', function($scope, $modalInstance, socket, phapnhan_id) {
    $scope.title = 'Chủ đầu tư';
    if (phapnhan_id == 2) {
      $scope.title = 'Đối tác';
    }
    $scope.ok = function() {
        $scope.phapnhan_id = phapnhan_id;
        socket.emit('them_phapnhan', $scope.cdt, function(data) {
            $modalInstance.close(data);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('trinhky', function($modalInstance, $modal, $scope, $rootScope, FileUploader, socket, p, m, pn, nv) {
  $scope.file_list = [];
  $scope.Math = Math;
  var uploader = $scope.uploader = new FileUploader({
    url: 'files/uploader/tmp',
    autoUpload: true
  });

  // FILTERS

  uploader.filters.push({
    name: 'customFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      return this.queue.length < 10;
    }
  });

  // CALLBACKS

  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    console.info('onBeforeUploadItem', item);
  };
  uploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    // console.info('onCompleteItem', fileItem, response, status, headers);
    console.log(response);
    $scope.file_list.push(response.file);
    $scope.tk.files = $scope.file_list;
    console.log($scope.file_list);

  };
  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
  };

   //$scope.user_details = $rootScope.globals.user_details;
  console.log(nv);
  console.log(p.project_id);
  $scope.tk = {
    milestone: {
      _id: m._id,
      project: m.project,
      project_id: p.project_id,
      milestone_name: m.milestone_name
    },
    soluong: 1,
    nguoiky: nv[0],
    ghichu: ''
  };
  console.log($scope.tk);
  $scope.p = p;
  $scope.m = m;
  $scope.nv = nv;
  $scope.phapnhan = pn;
  $scope.ok = function() {
    if ($scope.tk) {
      console.log($scope.tk);
      socket.emit('trinhkyhs', $scope.tk, function(data) {
        // console.log(data);
        m.trangthai = data.m.trangthai;
        m.lichsu_trangthai = data.m.lichsu_trangthai;
        m.activities.push(data.ac);
        socket.emit('get_trinhky', data.tk, function(res) {
          phieu_trinhky(res);
        });
      });
    }
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  //Phiếu trình ký hồ sơ
  var phieu_trinhky = function(data) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/phieu_trinhky.htm',
      controller: 'phieu_trinhky',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        tk: function() {
          return data;
        }
      }
    });
    modalInstance.result.then(function(data) {
      $modalInstance.close(data);
      // m.hopdong = data;
    }, function() {
      $modalInstance.close(data);
    });
  };
});
app.controller('phieu_trinhky', function($modalInstance, $window, $modal, $scope, $rootScope, socket, tk) {
  console.log(tk);
   //$scope.user_details = $rootScope.globals.user_details;
  $scope.ky = false;
  // if (tk.sign_token.user1.user === $scope.user_details._id) {
  //   if (tk.sign_token.user1.signed === false) {
  //     $scope.ky = true;
  //   }
  // }
  // if (tk.sign_token.user2.user === $scope.user_details._id) {
  //   if (tk.sign_token.user2.signed === false) {
  //     $scope.ky = true;
  //   }
  // }
  $scope.tk = tk;
  $scope.xacnhan = function() {
    console.log("Xác nhận");
  };
  $scope.huy = function() {
    console.log("Hủy");
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  $scope.print = function() {

    socket.emit('get phieu trinh ky', tk._id, function(html) {
      console.log(html);
      $window.printhtml(html);
    })
    // $window.printJS('tpl/phieutrinhky/' + tk._id);
    // console.log('tpl/phieutrinhky/' + tk._id);
  };
});
app.controller('chuyenphat', function($modalInstance, $modal, $scope, $rootScope, socket, p, m, tk, cdt, nv) {
  //$scope.user_details = $rootScope.globals.user_details;
  console.log(tk);
  $scope.cp = {
    milestone: {
      _id: m._id,
      project: m.project,
      project_id: p.project_id,
      milestone_name: m.milestone_name
    },
    soluong: 1,
    noichuyen: p.chudautu,
    ghichu: '',
    tk: tk
  };
  // console.log($scope.cp);
  $scope.p = p;
  $scope.m = m;
  $scope.nv = nv;
  $scope.cdt = cdt;
  $scope.ok = function() {
    socket.emit('chuyenphaths', $scope.cp, function(data) {
      m.activities.push(data.ac);
      m.trangthai = data.m.trangthai;
      m.lichsu_trangthai = data.m.lichsu_trangthai;

      // m.lichsu_trangthai = data.lichsu_trangthai;
      socket.emit('get_chuyenphat', data.cpkk, function(res) {
        console.log(res);
        phieu_chuyenphat(res);
      });
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  //Phiếu trình ký hồ sơ
  var phieu_chuyenphat = function(data) {
    var modalInstance = $modal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'module/projects/modal/phieu_chuyenphat.htm',
      controller: 'phieu_chuyenphaths',
      controllerAs: '$ctrl',
      size: '',
      resolve: {
        tk: function() {
          return data;
        }
      }
    });
    modalInstance.result.then(function(data) {
      $modalInstance.close(data);
      // m.hopdong = data;
    }, function() {
      $modalInstance.close(data);
    });
  };
});
app.controller('phieu_chuyenphaths', function($modalInstance, $modal, $scope, $rootScope, socket, tk) {
  //$scope.user_details = $rootScope.globals.user_details;
  $scope.ky = false;
  if (tk.sign_token.user1.user === $scope.user_details._id) {
    if (tk.sign_token.user1.signed === false) {
      $scope.ky = true;
    }
  }
  if (tk.sign_token.user2.user === $scope.user_details._id) {
    if (tk.sign_token.user2.signed === false) {
      $scope.ky = true;
    }
  }
  $scope.tk = tk;
  // $scope.phapnhan = pn;
  $scope.ok = function() {
    socket.emit('chuyenphaths', $scope.tk, function(data) {
      phieu_trinhky(data);
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('ketnoi_nghiemthu', function($modalInstance, $scope, $rootScope, socket, p, m, pn) {
  $scope.project = p;
  $scope.phapnhan = pn;
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };
  $scope.select_hd = function(ms) {
    console.log(ms);
  };
  $scope.ok = function() {
    // console.log($scope.selected_hd);
    $scope.project.milestones.forEach(function(ms, i) {
      if (ms.checked) {
        // console.log(ms.hopdong._id);
        m.hopdong = ms.hopdong._id;
        console.log(m);
        socket.emit('ketnoi_nghiemthu', m, function(data) {
          console.log(data);
        });
      }
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('bbgiaonhan', function($modalInstance, $scope, socket, bb) {
  $scope.bb = bb;
  // var data;
  // socket.emit('bb_giaonhan', bb, function(res) {
  //     console.log(res);
  //     data = new Blob([res.buffer], {
  //         type: 'application/pdf;utf-8'
  //     });
  //     var objectURL = URL.createObjectURL(data);
  //     console.log(objectURL);
  //     // window.printpdf(objectURL);
  //     // FileSaver.saveAs(data, 'bbgiaonhan.pdf');
  // });
  $scope.print = function() {
    // var objectURL = URL.createObjectURL(data);
    // window.printpdf(objectURL);
  };
  $scope.save = function() {
    // FileSaver.saveAs(data, 'bbgiaonhan.pdf');
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('chitiet_nhiemvu', function($modalInstance, $scope, socket, task, m) {
  console.log(m);
  // $scope.user_details = $rootScope.globals.user_details;
  $scope.t = task;
  if (task.check_list !== null) {
    $scope.t.check_list = angular.fromJson(task.check_list);
  } else {
    $scope.t.check_list = [];
  }
  $scope.phieu_giaoviec = function() {
    console.log('OK');
  };
  $scope.update_task = function() {
    var data = {
      id: task._id,
      description: $scope.t.description,
      check_list: $scope.t.check_list
    };
    console.log(data);
    socket.emit('update_task_panel', data, function(d) {
      console.log(d);
    });
    // socket.on('update_task_panel', function(data) {
    //     console.log(data);
    // })
  };
  $scope.add_check = function(data) {
    $scope.t.check_list.push({
      val: false,
      name: data
    });
    $scope.update_task();
    $scope.check_add = '';
  };
  $scope.update_des = function(data) {
    console.log(data);
    $scope.t.description = data;
    $scope.update_task();
  };
  $scope.cm_keypress = function(e) {
    if (e.keyCode == 13) {
      var cm = {
        t_id: task._id,
        message: $scope.t.comment
      };
      socket.emit('task_comment', cm, function(data) {
        $scope.t.comments.push(data);
        $scope.t.comment = '';
      });
    }
  };
  $scope.huy_nhiemvu = function() {
    // socket.emit('huy_nhiemvu', task, function (data) {
    //
    // });
    $modalInstance.close({
      ac: 'huy_nhiemvu',
      data: task
    }, m);
  };
  $scope.ok = function() {
    // socket.emit('themmauhoso', $scope.hs);
    $scope.t.m_id = m.id;
    $scope.t.p_id = m.project;
    console.log($scope.t);
    socket.emit('add_milestone_task', $scope.t);
    $modalInstance.close($scope.mauhs);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('delete_file', function($stateParams, $modalInstance, $scope, $rootScope, socket, p, m, f, ac) {
  // console.log($stateParams);
  $scope.ac = ac;
  $scope.ok = function() {
    f.milestone = m._id;
    socket.emit('delete_hs_file', f, function(d) {
      if (m.fileso) {
        m.fileso.forEach(function(h, i) {
          if (h._id === d._id) {
            // delete hss[i];
            m.fileso.splice(i, 1);
          }
        });
      }
      if (m.filescan) {
        m.filescan.forEach(function(h, i) {
          if (h._id === d._id) {
            // delete hss[i];
            m.filescan.splice(i, 1);
          }
        });
      }
      $modalInstance.close();
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('bao_duyet', function($stateParams, $modalInstance, $scope, $rootScope, socket, p, m, ac) {
  // console.log($stateParams);
  $scope.ac = ac;
  $scope.ok = function() {
    socket.emit('bao_duyet', m._id, function(d) {
      m.trangthai = d.m.trangthai;
      m.activities.push(d.ac);
      $modalInstance.close();
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('delete_milestone', function($modalInstance, $scope, $rootScope, socket, m, ac, $stateParams) {
  $scope.ac = ac;
  $scope.ok = function() {
    console.log(m);
    socket.emit('delete_milestone', m, function(d) {
      $modalInstance.close(d);
    });
    // $modalInstance.close(hs);
    // console.log('OK');
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('huy_nhiemvu', function($modalInstance, $scope, $rootScope, socket, t, ac) {
  $scope.ac = ac;
  console.log(t);
  $scope.ok = function() {
    socket.emit('huy_nhiemvu', t, function(d) {
      $modalInstance.close(t);
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('giaonhanhs', function($modalInstance, $scope, $rootScope, socket, p_id, m, nv, pb, ac) {
  $scope.nv = nv;
  var hs = {
    milestone_name: m.milestone_name,
    phong_id: $rootScope.globals.user_details.company,
    p_id: p_id,
    m_id: m._id,
    giao_id: 0,
    description: m.description,
    sl: 1,
    ac: ac
  };
  // console.log(hs);
  $scope.hsnhan = hs;
  $scope.sl_tru = function() {
    if ($scope.hsnhan.sl > 0) {
      $scope.hsnhan.sl -= 1;
    }
  };
  $scope.sl_cong = function() {
    $scope.hsnhan.sl += 1;
  };
  $scope.update_luuhs = function() {
    // console.log($scope.hsnhan);
    socket.emit('giaonhan_hs', $scope.hsnhan, function(data) {
      console.log(data.hsl.milestone.trangthai);
      m.trangthai = data.hsl.milestone.trangthai;
      m.lichsu_trangthai.push(data.hsl.milestone.trangthai)
      m.hosoluu.push(data.hsl);
      m.activities.push(data.ac);
      $modalInstance.close(data);
    });

  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.controller('botrithoigian', function($modalInstance, $scope, $rootScope, socket, task, tasks) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  $scope.events = tasks;
  // tasks.forEach(function(task) {
  //     var start = new Date(task.start_date);
  //     var end = new Date(task.due_date);
  //     $scope.events.push({
  //         title: task.task_name,
  //         start: start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate(),
  //         end: end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate(),
  //         allDay: true,
  //         t_id: task._id,
  //         className: ['b-l b-2x b-info'],
  //         location: 'New York',
  //         info: 'This a all day event that will start from 9:00 am to 9:00 pm, have fun!'
  //     })
  // })

  /* event source that contains custom events on the scope */


  /* alert on dayClick */
  $scope.precision = 400;
  $scope.lastClickTime = 0;
  $scope.alertOnEventClick = function(date, jsEvent, view) {
    var time = new Date().getTime();
    if (time - $scope.lastClickTime <= $scope.precision) {
      $scope.events.push({
        title: 'New Event',
        start: date,
        className: ['b-l b-2x b-info']
      });
    }
    $scope.lastClickTime = time;
  };
  /* alert on Drop */
  $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
    if (event.end) {
      var start = new Date(event.start._d);
      var end = new Date(event.end._d);
      var data = {
        start_date: start,
        due_date: end,
        t_id: event.t_id
      };
      socket.emit('update_task_date', data, function(d) {
        console.log(d);
      });
    } else {
      var start = new Date(event.start._d);
      var end = new Date(event.start._d);
      var data = {
        start_date: start,
        due_date: end,
        t_id: event.t_id
      };
      socket.emit('update_task_date', data, function(d) {
        console.log(d);
      });
    }
  };
  /* alert on Resize */
  $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
    console.log(event);
    var start = new Date(event.start._d);
    var end = new Date(event.end._d);
    var data = {
      start_date: start,
      due_date: end,
      t_id: event.t_id
    };
    console.log(data);
    socket.emit('update_task_date', data, function(d) {
      console.log(d);
    });
  };

  $scope.overlay = $('.fc-overlay');
  $scope.alertOnMouseOver = function(event, jsEvent, view) {
    $scope.event = event;
    $scope.overlay.removeClass('left right top').find('.arrow').removeClass('left right top pull-up');
    var wrap = $(jsEvent.target).closest('.fc-event');
    var cal = wrap.closest('.calendar');
    var left = wrap.offset().left - cal.offset().left;
    var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
    var top = cal.height() - (wrap.offset().top - cal.offset().top + wrap.height());
    if (right > $scope.overlay.width()) {
      $scope.overlay.addClass('left').find('.arrow').addClass('left pull-up');
    } else if (left > $scope.overlay.width()) {
      $scope.overlay.addClass('right').find('.arrow').addClass('right pull-up');
    } else {
      $scope.overlay.find('.arrow').addClass('top');
    }
    if (top < $scope.overlay.height()) {
      $scope.overlay.addClass('top').find('.arrow').removeClass('pull-up').addClass('pull-down');
    }
    (wrap.find('.fc-overlay').length == 0) && wrap.append($scope.overlay);
  };
  $scope.eventRender = function(event, jsEvent, view) {
    // if (event.changing) {
    //   console.log(event);
    // }
  };
  /* config object */
  $scope.uiConfig = {
    calendar: {
      height: 450,
      editable: true,
      header: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      dayClick: $scope.alertOnEventClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize,
      eventMouseover: $scope.alertOnMouseOver,
      eventRender: $scope.eventRender
    }
  };

  /* add custom event*/
  $scope.addEvent = function() {
    $scope.events.push({
      title: 'New Event',
      start: new Date(y, m, d),
      className: ['b-l b-2x b-info']
    });
  };

  /* remove event */
  $scope.remove = function(index) {
    $scope.events.splice(index, 1);
  };

  /* Change View */
  $scope.changeView = function(view, calendar) {
    $('.calendar').fullCalendar('changeView', view);
  };

  $scope.today = function(calendar) {
    $('.calendar').fullCalendar('today');
  };

  /* event sources array*/
  $scope.eventSources = [$scope.events];
  $scope.ok = function() {
    // $modalInstance.close(task.task_added);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
app.filter('m_ngayph', function() {
  return function(ngayph) {
    if (ngayph === "" || ngayph === null) {
      return "";
    } else {
      var date = ngayph.split('-');
      return date[2] + "/" + date[1] + "/" + date[0];
    }
  };
});
// app.directive('file', function() {
//     return {
//         replace: true,
//         transclude: true,
//         scope: {
//             file: '=',
//             updatehs: '&'
//         },
//         link: function(scope, el, attrs) {
//             el.bind('change', function(event) {});
//             el.bind('click', function(e) {
//                 // console.log(attrs.ftype);
//                 console.log(attrs.ftype);
//                 // console.log(scope.$parent.$parent.$parent.$parent);
//                 var socket = io.connect();
//                 var siofu = new SocketIOFileUpload(socket);
//                 siofu.listenOnInput(e.target);
//                 siofu.addEventListener("start", function(event) {
//                     scope.$parent.m.type = attrs.ftype;
//                     console.log('OK');
//                     // event.file.meta.m_id = scope.$parent.m._id;
//                     var p = {
//                         _id: scope.$parent.$parent.$parent.$parent.project._id,
//                         project_no: scope.$parent.$parent.$parent.$parent.project.project_no,
//                         project_code: scope.$parent.$parent.$parent.$parent.project.project_code
//                     };
//                     var m = {
//                         _id: scope.$parent.m._id,
//                         ftype: attrs.ftype,
//                         milestone_name: scope.$parent.m.milestone_name
//                     };
//                     event.file.meta.p = p;
//                     event.file.meta.m = m;
//                     console.log(el.parent().children().children());
//                     el.parent().children().children().removeClass('fa-upload');
//                     el.parent().children().children().addClass('fa-spin');
//                     el.parent().children().children().addClass('fa-circle-o-notch');
//                 });
//                 socket.on('hs_upload_done', function(hs) {
//                     el.parent().children().children().removeClass('fa-spin');
//                     el.parent().children().children().removeClass('fa-circle-o-notch');
//                     el.parent().children().children().addClass('fa-upload');
//                     scope.$parent.m.files.push(hs);
//                     scope.$apply(function() {
//                         scope.ngModel = scope.$parent.m.files;
//                     });
//                 });
//             });
//         }
//     };
// });
app.filter('slhoso', function() {
  return function(input) {
    var output = 0;
    var giao = 0;
    var nhan = 0;
    input.forEach(function(h, i) {
      if (h.ac == 'nhan') {
        nhan += h.soluong;
      } else if (h.ac == 'giao') {
        giao += h.soluong;
      }
    });
    return nhan - giao;
  };

});
app.filter('lochopdong', function() {
  return function(input) {
    var output = [];
    if (input) {
      input.forEach(function(m, i) {
        if (m.nhomhs._id == '586a0ab8516a3e129131fc86') {
          output.push(m);
        }
      });
    }
    return output;

  };

});
app.filter('check_assigned', function($rootScope) {
  return function(items) {
    // console.log($rootScope.globals.user_details._id);
    // console.log(items);
    var res = false;
    items.forEach(function(t, i) {
      // console.log(t);
      if (angular.isObject(t)) {
        if (t.assigned_to._id === $rootScope.globals.user_details._id) {
          res = true;
        }
      }
    });
    return res;
  };
});
app.filter('date_trangthai', function($rootScope) {
  return function(data) {
    // console.log($rootScope.globals.user_details._id);
    // console.log(items);
    var items = data.items;
    var res = 'Chưa có';
    items.forEach(function(t, i) {
      if (t.trangthai.class === data.class) {
        res = t.date;
      }
    });
    return res;
  };
});
app.filter('get_phapnhan', function($rootScope) {
  return function(data) {
    // var items = data.items;
    var res = 'Chưa có';
    // console.log(data);
    if (angular.isArray(data.ms)) {
      data.ms.forEach(function(m, i) {
        if (m.hopdong) {
          // console.log(m.hopdong);
          // console.log(m.hopdong);
          if (angular.isArray(m.hopdong.giatri)) {
            m.hopdong.giatri.forEach(function(gt, i) {
              if (gt.congtac.loaicongviec == data.gd.loaicongviec._id) {
                res = m.hopdong.dvthuchien.company_name;
              }
            });
          }
        }
      });
    }

    return res;
  };
});

function printpdf(url) {
  printJS(url);
}

function printhtml(html) {
  printHtmlElement.printHtml(html, {
    pageTitle: 'From HTML String',
    printMode: 'iframe',
    stylesheets: ['http://www.namviet.tk/css/invoices.css']
  });
}
