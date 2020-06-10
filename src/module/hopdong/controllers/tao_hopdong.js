'use strict';

/* Controllers */
// projects controller
app.controller('tao_hopdong', ['$scope', 'socket', '$http', 'applib', '$resource', function($scope, socket, $http, applib, $resource) {
    $scope.hd = {
      duan: ''
    };
    $scope.formats = ['dd-MMMM-yyyy', 'dd/MM/yyyy', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    }; 
    $scope.chon_duan = function (duan) {
      socket.emit('get_hopdong_duan', duan.project_id)
    }
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    socket.emit('get_projects', 1);
    socket.on('get_projects', function(data) {
        $scope.duan = data;
    })
    socket.emit('get_hopdong', 1);
    socket.on('get_hopdong', function(data) {
        $scope.listhopdong = data;
    })
}]);;
