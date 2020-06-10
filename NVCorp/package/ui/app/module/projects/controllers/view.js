'user strict';
//Controllers
// controller project view
app.controller('project_view', ['$scope', 'socket', '$http', '$stateParams', '$modal',
  function ($scope, socket, $http, $stateParams, $modal) {
    $scope.param = $stateParams;
    // $scope.p = {};
    // socket.emit()
    socket.emit('get_project_details', $stateParams.p_id, function (data) {
      $scope.p = data;
    });
    $scope.$on('get_project_details', function (e, data) {
      // console.log(data);
      $scope.p = data;
      console.log($scope.p);
    });
    $scope.$on('change_mtools', function (e, data) {
      // console.log(data);
      $scope.mtool = data;
      $scope.list_m = [];
      if (data == 'filescan') {
        socket.emit('get_files_scan', function (data) {
          $scope.files_scan = data;
          console.log(data);
        });
      }
    });
    $scope.overflow = "auto";
    $scope.$on('change overflow', function (e, data) {
      console.log(data);
      
      $scope.overflow = data;
    });
    socket.emit('get_assignable', function (data) {
      $scope.dsnhanvien = data;
      console.log(data)
    });
    $scope.onDrop = function (l, it, i, nv) {
      console.log(it);
      console.log(nv);
      $scope.giaoviec(it, nv);
    };
    $scope.onDragstart = function (list, event) {
      list.dragging = true;
      if (event.dataTransfer.setDragImage) {
        var img = new Image();
        img.src = 'images/ic_content_copy_black_24dp_2x.png';
        event.dataTransfer.setDragImage(img, 0, 0);
      }
    };
    $scope.list_m = [];
    $scope.add_hscp = function (l, it, i) {
      console.log(it)
      $scope.list_m.push(it);
    }
    //Giao việc
    $scope.giaoviec = function (mm, u) {
      var modalInstance = $modal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'module/projects/modal/giaoviec.htm',
        controller: 'giaoviec',
        controllerAs: '$ctrl',
        resolve: {
          // p: function() {
          //   return $scope.p;
          // },
          m: function () {
            return mm;
          },
          nv: function () {
            return $scope.dsnhanvien;
          },
          pb: function () {
            return $scope.dsphongban;
          },
          u: function () {
            return u;
          }
        }
      });
      modalInstance.result.then(function (dt) {
        console.log(dt);
        // m.trangthai = [dt.tt.trangthai];
        // m.tasks.push(dt.t)
        var task = dt;
        socket.emit('get_alltasks_user', task.assigned_to._id, function (data) {
          // console.log(data);
          tasks = [];
          data.forEach(function (task, i) {
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
          bothithoigian('', '', task, tasks, $scope.m);
        });

      }, function () {
        console.log('OK');
      });
    };
    var bothithoigian = function (size, parentSelector, task, tasks, m) {
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
          task: function () {
            return task;
          },
          tasks: function () {
            return tasks;
          }

        }
      });
      modalInstance.result.then(function (task_added) {
        // $scope.m.tasks.push(task);
      }, function () {
        // $scope.m.tasks.push(task);
      });
    };
    // Chuyển phát hồ sơ
    $scope.diadiem = [];
    socket.emit('get_chudautu', 1, function (data) {
      $scope.diadiem = data;
      console.log(data);
    });

    $scope.tao_giaonhan = function (data) {
      console.log(data)
      var modalInstance = $modal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'module/projects/modal/tao_giaonhan.htm',
        controller: 'tao_giaonhan',
        controllerAs: '$ctrl',
        size: '',
        resolve: {
          listm: function () {
            return data;
          },
          p: function () {
            return $scope.p;
          },
          diadiem: function () {
            return $scope.diadiem;
          }
        }
      });
      modalInstance.result.then(function (data) {
        // $modalInstance.close(data);
        // m.hopdong = data;
      }, function () {
        // $modalInstance.close(data);
        console.log('DSDSDSD');
        $scope.list_m = [];
        // $scope.isShowcp = false;
      });
    };


  }
]);
// app.controller('giaoviec', function ($modalInstance, $scope, $rootScope, socket, m, nv, pb) {
//   console.log(m)
//   $scope.t = {};
//   $scope.dsnv = nv;
//   $scope.t.task_name = m.milestone_name;
//   $scope.ok = function () {
//     $scope.t.m_id = m._id;
//     $scope.t.p_id = m.project;
//     $scope.t.nhanvien = $scope.t.nhanvien._id;
//     $scope.t.phongban = null;
//     socket.emit('add_milestone_task', $scope.t, function (data) {
//       m.tasks.push(data.t);
//       m.activities.push(data.ac);
//       $modalInstance.close(data);
//     });
//   };
//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };
// });;