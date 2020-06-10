'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    ['$rootScope', '$state', '$stateParams',
      function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
      function ($stateProvider, $urlRouterProvider, JQ_CONFIG) {
        $urlRouterProvider
          .otherwise('/app/congtac/users');
        $stateProvider
          .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: 'tpl/app.html'
          })

          //Công tác phí
          .state('app.congtac', {
            url: '/congtac',
            templateUrl: 'module/congtac/views/main.htm'
          })
          .state('app.congtac.users', {
            url: '/users',
            templateUrl: 'module/congtac/views/users.htm',
            resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['module/congtac/controllers/users.js'])
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.select');
                      }
                    );
                }
              ]
            }
          })
          .state('app.congtac.details', {
            url: '/details/:u_id/:nam/:thang.html',
            templateUrl: 'module/congtac/views/details.htm',
            resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['module/congtac/controllers/details.js'])
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.select');
                      }
                    );
                }
              ]
            }
          })
          .state('app.congtac.add', {
            url: '/add/:u_id/:nam/:thang.html',
            templateUrl: 'module/congtac/views/add.htm',
            resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                  return $ocLazyLoad.load('toaster')
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.select');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ngMap');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ngMapAutocomplete');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.utils.masks');
                      }
                    )
                    // .then(
                    //   function () {
                    //     return $ocLazyLoad.load('https://maps.googleapis.com/maps/api/js?key=AIzaSyCJs58PAeRIAfO64XBbG9S2G_KCqDdn6E0&libraries=places&sensor=false');
                    //   }
                    // )
                    .then(
                      function () {
                        return $ocLazyLoad.load('module/congtac/controllers/details.js');
                      }
                    );
                }
              ]
            }
          })
          .state('app.congtac.view', {
            url: '/view/:ct_id.html',
            templateUrl: 'module/congtac/views/chitiet.htm',
            resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['module/congtac/controllers/details.js'])
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.select');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ngMap');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ngMapAutocomplete');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ngMapAutocomplete');
                      }
                    )
                    // ui.utils.masks
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.utils.masks');
                      }
                    )
                    // .then(
                    //   function () {
                    //     return $ocLazyLoad.load('https://maps.googleapis.com/maps/api/js?key=AIzaSyCJs58PAeRIAfO64XBbG9S2G_KCqDdn6E0&libraries=places&sensor=false');
                    //   }
                    // )
                    .then(
                      function () {
                        return $ocLazyLoad.load('module/congtac/controllers/details.js');
                      }
                    );
                }
              ]
            }
          })
          .state('app.congtac.xuatdulieu', {
            url: '/xuatdulieu/:u_id/:nam/:thang.html',
            templateUrl: 'module/congtac/views/xuatdulieu.htm',
            resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['module/congtac/controllers/details.js'])
                    .then(
                      function () {
                        return $ocLazyLoad.load('pdfmake');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('pdfmake-font');
                      }
                    );
                }
              ]
            }
          })
          .state('app.congtac.duyet', {
            url: '/duyet/:ct_id/:u_id/:nam/:thang.html',
            templateUrl: 'module/congtac/views/duyet.htm',
            resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['module/congtac/controllers/details.js'])
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.select');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ngMap');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ngMapAutocomplete');
                      }
                    )
                    .then(
                      function () {
                        return $ocLazyLoad.load('ngMapAutocomplete');
                      }
                    )
                    // ui.utils.masks
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.utils.masks');
                      }
                    )
                    // .then(
                    //   function () {
                    //     return $ocLazyLoad.load('https://maps.googleapis.com/maps/api/js?key=AIzaSyCJs58PAeRIAfO64XBbG9S2G_KCqDdn6E0&libraries=places&sensor=false');
                    //   }
                    // )
                    .then(
                      function () {
                        return $ocLazyLoad.load('module/congtac/controllers/details.js');
                      }
                    );
                }
              ]
            }
          })
          .state('app.congtac.diadiem', {
            url: '/diadiem.html',
            templateUrl: 'module/congtac/views/diadiem.htm',
            resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['module/congtac/controllers/diadiem.js'])
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.select');
                      }
                    );
                }
              ]
            }
          })
          .state('app.congtac.edit_diadiem', {
            url: '/edit_diadiem/:id.html',
            templateUrl: 'module/congtac/views/edit_diadiem.htm',
            resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['module/congtac/controllers/diadiem.js'])
                    .then(
                      function () {
                        return $ocLazyLoad.load('ui.select');
                      }
                    );
                }
              ]
            }
          })
      }
    ]
  );
