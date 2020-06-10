'use strict';

/* Controllers */
// welcome controller
app.controller('redirect', ['$rootScope', '$scope', 'socket', '$http', '$stateParams', 'applib', '$state', function($rootScope, $scope, socket, $http, $stateParams, applib, $state) {
    console.log($stateParams);
    $scope.params = $stateParams;
    $scope.open = function(){
        socket.emit('call_devices_open', $stateParams, function (data) {
            
        })
    }
}]);
