'use strict';

/* Filters */

angular.module('app')
.factory('socket', ['socketFactory', function (socketFactory) {
    var myIoSocket = io.connect('https://a.nvcorp.net');
  
    var mySocket = socketFactory({
      ioSocket: myIoSocket
    });
    mySocket.loaded = false;
    return mySocket;
  }]);