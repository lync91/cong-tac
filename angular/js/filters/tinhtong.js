'use strict';

/* Filters */

angular.module('app')
.filter('tinhtong', function () {
    return function (items, key) {
      // console.log(items);
      var output = 0;
      if (angular.isArray(items)) {
        if (items) {
          items.forEach(function (gt, i) {
            if (gt[key]) {
              output += gt[key];
            }
          });
        }
      }
      // console.log(output);
      return output;
    };
  })
  .filter('tongthanhtien', function () {
    return function (items, key1, key2) {
      // console.log(items);
      var output = 0;
      if (angular.isArray(items)) {
        if (items) {
          items.forEach(function (gt, i) {
            if (gt[key1]) {
              output += gt[key1] * gt[key2];
            }
          });
        }
      }
      // console.log(output);
      return output;
    };
  });