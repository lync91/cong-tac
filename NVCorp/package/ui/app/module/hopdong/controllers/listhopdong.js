'use strict';

/* Controllers */
// projects controller
app.controller('listhopdong', ['$scope', 'socket', '$http', 'applib', '$resource', "$filter",
    function ($scope, socket, $http, applib, $resource, $filter) {
        $scope.sl = 15;
        $scope.or_listhopdong = [];
        $scope.listhopdong = [];
        socket.emit('get_hopdong', 1, function (data) {
            // console.log(data);
            $scope.listhopdong = data;
            $scope.or_listhopdong = data;
            console.log(data);

        });
        $scope.config = {
            itemsPerPage: 15,
            maxPages: 5,
            fillLastPage: "yes"
        };
        $scope.updateFilteredList = function () {
            // console.log('OK');
            $scope.listhopdong = $filter("filter")($scope.or_listhopdong, $scope.search);
        };

    }
]);;