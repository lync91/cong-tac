app.controller('user_profile', ['$scope', '$rootScope', 'socket', 'editableOptions', 'editableThemes', 'toaster',
    function($scope, $rootScope, socket, editableOptions, editableThemes, toaster) {
        socket.emit('get_user_details', function(data){
            console.log(data);
            $scope.user_profiles = data
        });
        
        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.cropType = "circle";
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        var handleFileSelect = function(evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function(evt) {
                $scope.$apply(function($scope) {
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        $scope.update_user_profile = function(u) {
            console.log(u);
            socket.emit('user_profiles', u, function(data) {
                $rootScope.globals.user_details.username = $scope.user_profiles.username;
                $rootScope.globals.user_details.fullname = $scope.user_profiles.fullname;
                $rootScope.globals.user_details.address = $scope.user_profiles.address;
                $rootScope.globals.user_details.mobile = $scope.user_profiles.mobile;
                $rootScope.globals.user_details.email = $scope.user_profiles.email;
                $rootScope.globals.user_details.facebook = $scope.user_profiles.facebook;
                $rootScope.globals.user_details.twitter = $scope.user_profiles.twitter;
            });
        };
        $scope.upload_avatar = function() {
            // console.log($scope.myImage);
            if ($scope.myCroppedImage) {
                socket.emit('upload_avatar', $scope.myCroppedImage, function(data) {
                    $rootScope.globals.user_details.avatar.push(data);
                    $rootScope.globals.user_details.cur_avatar = data;
                });
            }
        };
        $scope.change_avatar = function(avatar) {
            socket.emit('change_avatar', avatar, function(data) {
                $rootScope.globals.user_details.cur_avatar = data;
            });
        };
        $scope.delete_avatar = function(avatar) {
            socket.emit('delete_avatar', avatar, function(data) {
                $rootScope.globals.user_details.avatar = data;
            });
        };
        $scope.change_password = function() {
            socket.emit('change_password', $scope.u, function(data) {
                console.log(data);
                toaster.pop('success', 'Thông báo', 'Thay đổi mật khẩu thành công');
                $scope.u.password_new = '';
                $scope.u.password_comfirm = '';
            });
        };
    }
]);
