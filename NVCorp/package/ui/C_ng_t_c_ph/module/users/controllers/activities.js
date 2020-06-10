app.controller('activities', ['$scope', '$rootScope', 'socket', 'editableOptions', 'editableThemes', 'toaster',
    function($scope, $rootScope, socket, editableOptions, editableThemes, toaster) {
        console.log('Activities');
        $scope.activities = [];
        socket.emit('get_activities', 1, function (data) {
          $scope.activities = data;
        });
    }
]);
