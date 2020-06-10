'use strict';

/* Controllers */
// welcome controller
app.controller('welcome', ['$rootScope', '$scope', 'socket', '$http', '$stateParams', 'applib', '$state', function ($rootScope, $scope, socket, $http, $stateParams, applib, $state) {
  // console.log('OK00000');
  console.log($state);
  $scope.dsnhanvien = [];
  socket.emit('get_dsnhanvien', 1, function (data) {
    $scope.dsnhanvien = data;
  });
  $scope.tag_label = "";
  $scope.feeds = [];
  $scope.comment_model = {};
  $scope.activities = [];
  $scope.milestones = [];
  $scope.projects = [];
  $scope.selected = "tatca";
  // $scope.showeditor = false;
  $scope.user_details = $rootScope.user_details;
  socket.emit('get_projects', 1, function (data) {
    // console.log(data);
    $scope.projects = data;
  });
  $scope.duan_theodoi = [];
  if ($state.current.name == "app.home.duan") {
    socket.emit("get_project_details", $stateParams.id, function (res) {
      // console.log(res);
      $scope.tag_label = res.project_code;
      $scope.milestones = res.milestones;
      // $scope.activities = res.activities;
    })
  } else if ($state.current.name == "app.home.main") {
    $scope.tag_label = "Tất cả";
  }
  $scope.duan_theodoi = [];
  socket.emit('get_duan_theodoi', 1, function (res) {
    $scope.duan_theodoi = res;
    console.log(res)
    // $scope.duan_theodoi.forEach(function (t, i) {
    //   // console.log(t);
    //   // socket.emit('count_project_activities', {project: t._id, seen: t.theodoi[0].last_seen_activities}, function (res) {
    //   //   // console.log(res);
    //   //   $scope.duan_theodoi[i].unread = res;
    //   // })
    // })
  });

  // if ($stateParams.state == 'duan') {
  //   socket.emit("get_project_details", $stateParams.id, function (res) {
  //     $scope.milestones = res.milestones;
  //     $scope.activities = res.activities;
  //   })
  // }else {
  //   socket.emit("get_all_activities", 1, function (res) {
  //     $scope.activities = res;
  //   })
  // }

}]);
app.controller('main', ['$rootScope', '$scope', 'socket', '$http', '$stateParams', 'applib', '$state',
  function ($rootScope, $scope, socket, $http, $stateParams, applib, $state) {
    socket.emit('get_feeds', null, function(data){
      console.log(data)
      $scope.feeds = data;
    })
  }
]);