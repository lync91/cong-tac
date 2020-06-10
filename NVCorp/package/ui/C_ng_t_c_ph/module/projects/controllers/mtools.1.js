'use strict';

/* Controllers */
// signin controller
app.controller('biavb_main', ['$scope', 'socket', '$location', '$stateParams', '$window', '$state',
  function($scope, socket, $location, $stateParams, $window, $state) {
    console.log($state);
    $scope.pid = $stateParams.id;
    // socket.emit('get_project_details', $stateParams.id, function(data) {
    //   $scope.milestones = data.milestones;
    // });
    socket.emit('get_project_milestones', $stateParams.id, function(data){
      $scope.milestones = data;
      console.log(data)
    })
  }
]);
