'use strict';

/* Filters */

angular.module('app')
.factory('socket', ['socketFactory', function (socketFactory) {
    var myIoSocket = io.connect('https://a.nvcorp.net', {
      'query': 'auth_token=' + window.token
    });
    console.log(window.token);
    var mySocket = socketFactory({
      ioSocket: myIoSocket
    });
    mySocket.loaded = false;
    return mySocket;
  }]);