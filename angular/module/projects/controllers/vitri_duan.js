'use strict';

/* Controllers */
// signin controller
app.controller('vitri_duan', ['$rootScope', '$scope', 'socket', '$http', '$location', '$modal', '$stateParams', 'NgMap',
  function($rootScope, $scope, socket, $http, $location, $modal, $stateParams, NgMap) {
    
    var vm = this;
    var circles = [];
    var polylines = [];
    var polygons = [];
    $scope.param = $stateParams;
    console.log($stateParams);
    
    $scope.ob_selected = {};
    var select_object = function(ob) {
      clear_selection();
      $scope.ob_selected = ob;
      $scope.strokeWeight = ob.strokeWeight;
      $scope.strokeColor = ob.strokeColor;
      ob.setMap(null);
      ob.editable = true;
      ob.setMap(vm.map);
    }
    $scope.calor_pane = 'stroke';
    $scope.p = {};
    $scope.strokeWeight = 5;
    $scope.strokeColor = '#000000';
    $scope.fillOpacity = 1;
    var get_map = function(edit) {
      socket.emit('get_project_details', $stateParams.id, function(data) {
        $scope.p = data;
        console.log(data);
        // $scope.$emit('get_project_details', data);
        NgMap.getMap().then(function(map) {
          vm.map = map;
          console.log(map);
          if ($scope.p.vitri) {
            var dt = angular.fromJson($scope.p.vitri);
            vm.map.setCenter(dt.center);
            vm.map.setZoom(dt.zoom);
            dt.overlay.polylines.forEach(function (p, i) {
              var Polyline = new google.maps.Polyline({
                path: p.path,
                geodesic: true,
                strokeColor: p.strokeColor,
                strokeOpacity: p.strokeOpacity,
                strokeWeight: p.strokeWeight,
                editable : edit,
                map: vm.map
              });
              polylines.push(Polyline)
              google.maps.event.addListener(Polyline, 'click', function(e) {
                select_object(Polyline)
              });
            })

            dt.overlay.circles.forEach(function(c, i) {
              console.log(dt);
              var Circle = new google.maps.Circle({
                strokeColor: c.strokeColor,
                strokeOpacity: c.strokeOpacity,
                strokeWeight: c.strokeWeight,
                fillColor: c.fillColor,
                fillOpacity: c.fillOpacity,
                editable: edit,
                center: c.center,
                radius: c.radius,
                map: vm.map
              });
              circles.push(Circle);
              google.maps.event.addListener(Circle, 'click', function(e) {
                select_object(Circle)
              });
            });
            dt.overlay.polygons.forEach(function (pg, i) {
              var Polygon = new google.maps.Polygon({
                path: pg.path,
                strokeColor: pg.strokeColor,
                strokeOpacity: pg.strokeOpacity,
                strokeWeight: pg.strokeWeight,
                fillColor: pg.fillColor,
                fillOpacity: pg.fillOpacity,
                editable: edit,
                map: vm.map
              });
              polygons.push(Polygon)
              google.maps.event.addListener(Polygon, 'click', function(e) {
                select_object(Polygon)
              });
            })
          }
        });
      });
    }
    get_map(false);
    var clear_selection = function() {
      circles.forEach(function(c, i) {
        if (c.map) {
          c.setMap(null);
          c.editable = false;
          c.setMap(vm.map);
        }
      });
      polylines.forEach(function (p, i) {
        p.setMap(null);
        p.editable = false;
        p.setMap(vm.map)
      })
    }
    $scope.sua = function() {
      get_map(true);
    }
    vm.types = "['establishment']";
    vm.placeChanged = function() {
      vm.place = this.getPlace();
      console.log('location', vm.place.geometry.location);
      vm.map.setCenter(vm.place.geometry.location);
    };
    $scope.delete = function() {
      $scope.ob_selected.setMap(null);
    }

    vm.onMapOverlayCompleted = function(e) {
      clear_selection();
      console.log(e);
      if (e.type == 'circle') {
        var radius = e.overlay.getRadius();
        var Circle = new google.maps.Circle({
          strokeColor: e.overlay.strokeColor,
          strokeOpacity: e.overlay.strokeOpacity,
          strokeWeight: e.overlay.strokeWeight,
          fillColor: e.overlay.fillColor,
          fillOpacity: e.overlay.fillOpacity,
          editable: true,
          center: e.overlay.center,
          radius: e.overlay.radius,
          map: vm.map
        });
        select_object(Circle)
        google.maps.event.addListener(Circle, 'click', function(e) {
          select_object(Circle)
        });
        circles.push(Circle);
        Circle.setMap(vm.map);
        e.overlay.setMap(null);
        vm.map.mapDrawingManager[0].drawingMode = null;
        vm.map.mapDrawingManager[0].setMap(vm.map);
      };
      if (e.type == 'polyline') {
        console.log(e);
        console.log(JSON.stringify(e.overlay.latLngs.getArray()[0].b));
        var Polyline = new google.maps.Polyline({
          path: e.overlay.latLngs.getArray()[0].b,
          geodesic: true,
          strokeColor: e.overlay.strokeColor,
          strokeOpacity: e.overlay.strokeOpacity,
          strokeWeight: e.overlay.strokeWeight,
          editable : true,
          map: vm.map
        });
        select_object(Polyline)
        google.maps.event.addListener(Polyline, 'click', function(e) {
          select_object(Polyline)
        });
        polylines.push(Polyline);
        e.overlay.setMap(null);
        vm.map.mapDrawingManager[0].drawingMode = null;
        vm.map.mapDrawingManager[0].setMap(vm.map);
      }
      if (e.type == 'polygon') {
        console.log(e);
        // console.log(JSON.stringify(e.overlay.latLngs.getArray()[0].b));
        var Polygon = new google.maps.Polygon({
          path: e.overlay.getPath(),
          strokeColor: e.overlay.strokeColor,
          strokeOpacity: e.overlay.strokeOpacity,
          strokeWeight: e.overlay.strokeWeight,
          fillColor: e.overlay.fillColor,
          fillOpacity: e.overlay.fillOpacity,
          editable : true,
          map: vm.map
        });
        select_object(Polygon)
        google.maps.event.addListener(Polygon, 'click', function(e) {
          select_object(Polygon)
        });
        polygons.push(Polygon);
        e.overlay.setMap(null);
        vm.map.mapDrawingManager[0].drawingMode = null;
        vm.map.mapDrawingManager[0].setMap(vm.map);
      }
    }
    vm.savePolygon = function(e) {
      console.log(e);
    }
    vm.onClick = function(event) {
      vm.geoType = event.feature.getGeometry().getType();
      vm.geoArray = event.feature.getGeometry().getArray();
      console.dir('geoArray', event.feature.getGeometry().getArray());
    };
    $scope.change_strokeWeight = function(w) {
      $scope.strokeWeight = w;
      vm.map.mapDrawingManager[0].circleOptions.strokeWeight = w;
      vm.map.mapDrawingManager[0].polylineOptions.strokeWeight = w;
      vm.map.mapDrawingManager[0].polygonOptions.strokeWeight = w;
      vm.map.mapDrawingManager[0].rectangleOptions.strokeWeight = w;
      vm.map.mapDrawingManager[0].setMap(vm.map);

      if ($scope.ob_selected) {
        $scope.ob_selected.strokeWeight = w;
        $scope.ob_selected.setMap(null);
        $scope.ob_selected.setMap(vm.map);
      }
      console.log(vm.map.mapDrawingManager[0]);
    }
    $scope.$on('colorpicker-selected', function(event, colorObject) {
      console.log(colorObject);
      vm.map.mapDrawingManager[0].circleOptions[colorObject.name] = colorObject.value;
      vm.map.mapDrawingManager[0].polylineOptions[colorObject.name] = colorObject.value;
      vm.map.mapDrawingManager[0].polygonOptions[colorObject.name] = colorObject.value;
      vm.map.mapDrawingManager[0].rectangleOptions[colorObject.name] = colorObject.value;

      $scope.ob_selected[colorObject.name] = colorObject.value;
      $scope.ob_selected.setMap(null);
      $scope.ob_selected.setMap(vm.map);

      vm.map.mapDrawingManager[0].setMap(vm.map);
    });
    $scope.change_fillOpacity = function(o) {
      $scope.fillOpacity = o;
      vm.map.mapDrawingManager[0].circleOptions.fillOpacity = o;
      // vm.map.mapDrawingManager[0].polylineOptions.fillOpacity = o;
      vm.map.mapDrawingManager[0].polygonOptions.fillOpacity = o;
      vm.map.mapDrawingManager[0].rectangleOptions.fillOpacity = o;
      if ($scope.ob_selected) {
        $scope.ob_selected.fillOpacity = o;
        $scope.ob_selected.setMap(null);
        $scope.ob_selected.setMap(vm.map);
      }
    }
    $scope.luu = function() {
      console.log(circles);
      var dt = {
        circles: [],
        polylines: [],
        polygons: []
      }
      circles.forEach(function(c, i) {
        if (c.map) {
          dt.circles.push({
            strokeColor: c.strokeColor,
            strokeOpacity: c.strokeOpacity,
            strokeWeight: c.strokeWeight,
            fillColor: c.fillColor,
            fillOpacity: c.fillOpacity,
            center: c.center,
            radius: c.radius,
          })
        }
      });
      // console.log(polylines);
      polylines.forEach(function (p, i) {
        if (p.map) {
          var path = JSON.stringify(p.latLngs.getArray()[0].b)
          // console.log(path);
          var _path = angular.fromJson(path);
          dt.polylines.push({
            path: _path,
            strokeColor: p.strokeColor,
            strokeOpacity: p.strokeOpacity,
            strokeWeight: p.strokeWeight,
          })
        }
      });
      polygons.forEach(function (pg, i) {
        console.log(pg.getPath().b);
        var path = JSON.stringify(pg.getPath().b)
        var _path = angular.fromJson(path);
        dt.polygons.push({
          path: _path,
          strokeColor: pg.strokeColor,
          strokeOpacity: pg.strokeOpacity,
          strokeWeight: pg.strokeWeight,
          fillColor: pg.fillColor,
          fillOpacity: pg.fillOpacity,
        })
        console.log(dt.polygons);
      })
      // console.log(dt);
      var geo = {
        overlay: dt,
        center: vm.map.getCenter(),
        zoom: vm.map.getZoom(),
      };
      var data = {
        _id: $scope.p._id,
        vitri: JSON.stringify(geo)
      };
      console.log(data);
      
      socket.emit('update vi tri du an', data, function(res) {
        console.log(res);
        
      })
    }
  }
]);
app.controller('them_chudautu', ['$scope', '$modalInstance', 'socket', function($scope, $modalInstance, socket) {
  $scope.ok = function() {
    socket.emit('them_chudautu', $scope.cdt, function(data) {
      $modalInstance.close(data);
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);
app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});
