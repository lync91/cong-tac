'use strict';

/* Controllers */
// welcome controller
app.controller('duan', ['$rootScope', '$scope', 'socket', '$http', '$stateParams', 'applib', '$modal', '$anchorScroll', '$location', '$timeout', 'FileUploader', 'fancyboxService',
  function($rootScope, $scope, socket, $http, $stateParams, applib, $modal, $anchorScroll, $location, $timeout, FileUploader, fancyboxService) {
    $scope.app = {};
    $scope.app.hideFooter = false;
    $scope.glued = true;
    $scope.picker_w = '';
    $scope.feeds = [];
    $scope.comment_model = {};
    $scope.activities = [];
    $scope.selected = "tatca";
    $scope.user_details = $rootScope.user_details;
    $scope.orightml = "";
    $scope.htmlcontent = $scope.orightml;
    $scope.select_tatca = function() {
      $scope.selected = "tatca";
    };
    $scope.duan_theodoi = [];
    socket.emit('get_duan_theodoi', 1, function(res) {
      console.log(res);
      $scope.duan_theodoi = res;
    });
    var scroll_bottom = function() {
      $location.hash('bottom');
      $anchorScroll();
    }
    $scope.activities = [];
    socket.emit('get_projects_activities', $stateParams.id, null, function(res) {
      console.log(res);
      $scope.activities = res;
      $timeout(scroll_bottom, 300);
    })
    $scope.comment = {
      message: '',
      files: [],
      users: [],
      tags: [],
      projects: [],
      milestones: [],
    };
    var uploader = $scope.uploader = new FileUploader({
      url: 'files/uploader/tmp',
      autoUpload: true,
      isHTML5: true
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
    $scope.file_list = [];
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      // console.info('onCompleteItem', fileItem, response, status, headers);
      console.log(response);
      $scope.file_list.push(response.file);
      $scope.comment.files = $scope.file_list;
      console.log($scope.file_list);
    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
    };
    socket.on('new project activity', function(data) {
      $scope.activities.push(data);
      $location.hash('bottom');
      $anchorScroll();
    });
    $scope.send_comment = function() {
      // console.log($scope.comment);
      var data = {
        p: $scope.p._id,
        // project_code: $scope.p.project_code,
        message: $scope.comment.message.replace(/(?!".*)\n(?!.*")/g, '\\n'),
        files: $scope.comment.files,
        users: $scope.comment.users,
        tags: $scope.comment.tags,
        projects: $scope.comment.projects,
        milestones: $scope.comment.milestones
      };
      data.html = $scope.htmlcontent;
      console.log(data);
      // console.log($scope.comment.message.replace(/(?!".*)\n(?!.*")/g, '\\n'));
      socket.emit('project_comment', data, function(res) {
        console.log(res);
        // console.log($rootScope);
        $scope.activities.push(res);
        $scope.comment = {
          message: '',
          files: [],
          users: [],
          tags: [],
          projects: [],
          milestones: [],
        };
        $scope.orightml = "";
        $scope.htmlcontent = "";
        $scope.showeditor = false;
        $location.hash('bottom');
        $anchorScroll();
      });
    }
    $scope.p = {};
    socket.emit("get_project_details", $stateParams.id, function(res) {
      console.log(res);
      $scope.tag_label = res.project_code;
      $scope.milestones = res.milestones;
      $scope.p = res;
    })
    // $scope.follow_config = function () {
    //   console.log("OKKKK");
    // }
    $scope.follow_config = function() {
      var modalInstance = $modal.open({
        templateUrl: 'module/welcome/modal/theodoi.htm',
        controller: 'theodoi_duan',
        resolve: {
          project: function() {
            return $scope.p;
          }
        }
      });
      modalInstance.result.then(function(data) {
        console.log(data);
        // $scope.project.goithauthuchien = data;
      }, function() {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.follow_config1 = function() {
      var modalInstance = $modal.open({
        templateUrl: 'module/welcome/modal/theodoi.htm',
        controller: 'theodoi_duan',
        resolve: {
          project: function() {
            return $scope.p;
          }
        }
      });
      modalInstance.result.then(function(data) {
        console.log(data);
        // $scope.project.goithauthuchien = data;
      }, function() {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };
    // $scope.openManual2 = function(files) {
    //   var images = [];
    //   files.forEach(function (f, i) {
    //     images.push('files/get/' + f._id);
    //   })
    //   fancyboxService.fancyboxPlus()(images, $scope.manual2);
    // }
    // $scope.manual2gallery = [
    //   'files/get/59168bac7bbfd803caf49f27',
    //   'http://farm3.staticflickr.com/2880/10346743894_0cfda8ff7a_b.jpg',
    //   {
    //     'href': 'http://farm6.staticflickr.com/5612/15344856989_449794889d_b.jpg',
    //     'title': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    //   }
    // ];
    // $scope.manual2 = {
    //   'padding': 0,
    //   'margin' : [80, 0],
    //   'transitionIn': 'none',
    //   'transitionOut': 'none',
    //   'type': 'image',
    //   'changeFade': 0
    // };
    socket.emit('update_seen_activity_p', $stateParams.id, function (data) {
      console.log('Data', data);
    })
    $scope.show_button = true;
    $scope.get_more_activities = function(){
      console.log($scope.activities[$scope.activities.length - 1].activity_date)
      socket.emit('get_projects_activities', $stateParams.id, $scope.activities[$scope.activities.length - 1].activity_date, function(res) {
        console.log(res);
        if(res) {
          if(res.length < 20){
            $scope.show_button = false;
          }
          res.forEach(function (a) {
            $scope.activities.push(a);
          })
        }
        // $scope.activities.push(res);
        // $timeout(scroll_bottom, 300);
      })
    }
  }
]);
app.controller('theodoi_duan', ['$scope', 'socket', '$modalInstance', 'project', '$rootScope',
  function($scope, socket, $modalInstance, project, $rootScope) {
    $scope.flags = {};
    console.log(project);
    $scope.nhomhs = [];
    socket.emit('get_nhomhs', 1, function(data) {
      $scope.nhomhs = data;
      console.log(data);
    });
    $scope.dt = {
      project: project._id,
      tag: project.project_code,
      // goithauthuchien: $scope.goithauthuchien_new
      flags: ""
    };
    project.theodoi.forEach(function(t, i) {
      if (t.user == $rootScope.globals.user_details._id) {
        $scope.flags = angular.fromJson(t.flags);
      }
    })
    $scope.chon_loaicongviec = function(item) {
      console.log($scope.goithauthuchien_new);
    };
    $scope.ok = function() {
      var flags = JSON.stringify($scope.flags);
      $scope.dt.flags = flags;
      socket.emit('theodoi_duan', $scope.dt, function(res) {
        project.theodoi = res;
        $modalInstance.close();
      });
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }
]);
