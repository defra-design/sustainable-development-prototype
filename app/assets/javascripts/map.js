function map(_location){
    
    //MAPS

  var baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  

  // ESRI World Imagery
  var satelliteLayer = new ol.layer.Tile({
      ref: 'satellite',
      source: new ol.source.XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      })
    })

    

  var aerialAndStreetsLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW50LWRlZnJhIiwiYSI6ImNrbmtkaDEyMzA2emQycHFsOW04YjB1eWkifQ.NR7GSXgdwmFKZzLwSti3uA',
      })
  });


  var mapboxLayer = new ol.layer.MapboxVector ({
    styleUrl: 'mapbox://styles/ant-defra/cknou8uzf5hfw17qzo0076s58',
    accessToken:
      'pk.eyJ1IjoiYW50LWRlZnJhIiwiYSI6ImNrbmtkaDEyMzA2emQycHFsOW04YjB1eWkifQ.NR7GSXgdwmFKZzLwSti3uA',
  });

  //Final polygon
  var polygonStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        // color: 'rgba(29, 112, 184, 0.25)' //blue
      color: 'rgba(255, 255, 255, 0.25)'
    }),
    stroke: new ol.style.Stroke({
        //color: 'rgba(29, 112, 184, 1)', //blue
        color: '#f47738',  //orange
        // color: '#000',  //black
        // color: '#1d70b8', //blue
    //   color: '#d4351c', //red
      width: 4
    }),
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: '/public/images/map-draw-cursor-2x.png'
    })
  });

  var polygonVertexStyle = new ol.style.Style({
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: '/public/images/map-draw-cursor-2x.png'
    }),
    // Return the coordinates of the first ring of the polygon
    geometry: function (feature) {
      if (feature.getGeometry().getType() === 'Polygon') {
        var coordinates = feature.getGeometry().getCoordinates()[0]
        return new ol.geom.MultiPoint(coordinates)
      } else {
        return null
      }
    }
  });

  var polygonSource = new ol.source.Vector({wrapX: false});
  var polygonLayer = new ol.layer.Vector({
    source: polygonSource,
    style: [polygonStyle, polygonVertexStyle]
  });



  // If statement that changes the map layers on the confirm page
  // I need to look at pin location changes next.

    var _lon = -1.464854,
        _lat = 52.561928,
        _zoom = 6.6;

  if(_location == "place" || _location == "gridref"){
    _lon = -1.257677;
    _lat = 51.752022;
    _zoom = 12;
  }
//   Oxford
// lon = -1.257677
// lat = 51.752022
// zoom = 15

//   England
// lon = -1.464854
// lat = 52.561928
// zoom = 6.6


  if(document.getElementById("map").classList.contains("map--confirm")){
    var map = new ol.Map({
      target: 'map',
      layers: [ baseMapLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([_lon, _lat]),
        zoom: _zoom, //Initial Zoom Level
        maxZoom: 19
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  } else if (document.getElementById("map").classList.contains("map--fz1")) {
    var map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen({
          label: 'Full screen \u2922'
        })
      ]),
      layers: [ mapboxLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.564057, 53.378333]),
        zoom: 15 //Initial Zoom Level
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  }
  else if (document.getElementById("map").classList.contains("map--fz3")) {
    var map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen({
          label: 'Full screen \u2922'
        })
      ]),
      layers: [ mapboxLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.570489, 53.385511]),
        zoom: 15 //Initial Zoom Level
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  }
  else if (document.getElementById("map").classList.contains("map--fzd")) {
    var map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen({
          label: 'Full screen \u2922'
        })
      ]),
      layers: [ mapboxLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.576372, 53.382467]),
        zoom: 15 //Initial Zoom Level
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  }
  else {
    //Swaps the map to the FLood Zone Layers from Mapbox Studio
    var map = new ol.Map({
      target: 'map',
      layers: [ mapboxLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.571657, 53.381048]),
        zoom: 15 //Initial Zoom Level
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  }

  // Adding a marker on the map

  if (document.getElementById("map").classList.contains("map--fzd")){
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-2.580372, 53.382467])
      ),
    });
  } else if (document.getElementById("map").classList.contains("map--fz3")) {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-2.573489, 53.385511])
      ),
    });
  } else if (document.getElementById("map").classList.contains("map--fz1")) {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-2.566257, 53.378333])
      ),
    });
  } else {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-2.571657, 53.381048])
      ),
    });
  }

  marker.setStyle(new ol.style.Style({
    image: new ol.style.Icon(({
      crossOrigin: 'anonymous',
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: '/public/images/iconfinder_marker.png'
    }))
  }));

  var markerSource = new ol.source.Vector({
    features: [marker]
  });

  var markerLayer = new ol.layer.Vector({
    source: markerSource,
  });
  map.addLayer(markerLayer);

  // Click handler for pointer
  map.on('singleclick', function (e) {
    if (markerLayer.getVisible() === true) {
      var point = markerSource.getFeatures()[0];
      point.getGeometry().setCoordinates([e.coordinate[0], e.coordinate[1]])
    }
  })





  /////// POLYGON STUFF ///////

  // Modify polygon drawing style
  var modifyStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#FFBF47',
      width: 3
    }),
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: '/public/images/map-draw-cursor-2x.png'
    })
  });

  var modify = new ol.interaction.Modify({
    source: polygonSource,
    style: modifyStyle
  });

  // While drawing style
  var drawStyle = new ol.style.Style({
    // fill: new ol.style.Fill({
    //   color: 'rgba(255, 255, 255, 0.2)'
    // }),
    stroke: new ol.style.Stroke({
        // color: '#FFFFFF', //white
        color: '#f47738',  //orange
        // color: '#000',  //black
        // color: 'rgba(29, 112, 184, 1)', //blue
      //color: '#1d70b8', //blue
    //   color: '#d4351c', //red
      width: 4
    }),
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: '/public/images/map-draw-cursor-2x.png'
    })
  });

  var draw = new ol.interaction.Draw({
    source: polygonSource,
    type: 'Polygon',
    style: [drawStyle, polygonVertexStyle]
  });

  draw.on('drawend', function (e) {
    var coordinates = e.feature.getGeometry().getCoordinates()[0]
    if (coordinates.length >= 4) {
      setTimeout(function () {
        map.removeInteraction(draw)
      }, 500);
    }
  });

  var snap = new ol.interaction.Snap({
    source: polygonSource
  });

  function addInteractions() {
    if (polygonSource.getFeatures().length === 0) {
      map.addInteraction(draw);
    }
    map.addInteraction(modify);
    map.addInteraction(snap);
  }

  function removeInteractions() {
    map.removeInteraction(draw);
    map.removeInteraction(modify);
    map.removeInteraction(snap);
  }

  var deleteBtn = document.getElementById("deleteShapeBtn");
  deleteBtn.addEventListener('click', function(event) {
        if (polygonSource.getFeatures().length === 1) {
            polygonSource.removeFeature(polygonSource.getFeatures()[0]);
        }
    }, false);

  //Set draw as default
  addInteractions();
  deleteBtn.disabled = false;
  polygonLayer.setVisible(true);
  markerLayer.setVisible(false);


  

//   var radios = document.getElementsByName('marker-or-shape');
//   for (var i = 0, length = radios.length; i < length; i++) {
//     radios[i].addEventListener('click', function(event) {

//       var deleteBtn = document.getElementById("deleteShapeBtn");

//       if (this.value == 'draw-shape') {
//         addInteractions();
//         deleteBtn.disabled = false;
//         polygonLayer.setVisible(true);
//         markerLayer.setVisible(false);
//       } else if (this.value == 'delete-shape' &&
//         polygonSource.getFeatures().length === 1) {
//           polygonSource.removeFeature(polygonSource.getFeatures()[0]);
//       } else if (this.value === 'move-marker') {
//         removeInteractions();
//         deleteBtn.disabled = true;
//         polygonLayer.setVisible(false);
//         markerLayer.setVisible(true);
//       }
//     }, false);
//   }

  var buttons = document.getElementsByName('delete-shape');
  if (buttons.length === 1) {
    buttons[0].addEventListener('click', function(event) {
      if (polygonSource.getFeatures().length === 1) {
          polygonSource.removeFeature(polygonSource.getFeatures()[0]);
      }

      map.addInteraction(draw);
    //   document.getElementById("draw-shape").focus();

    });
  }

// DRAGGABLE MARKER
  var translate1 = new ol.interaction.Translate({
  	features: new ol.Collection([marker])
  });
  map.addInteraction(translate1);

  map.on('pointermove', function(e) {
    if (e.dragging) return;
    var hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });
//////////////////////


  // EVENT HANDLER FOR CUSTOM DETAILS COMPONENT
  $('.map-toggle').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
  });

  var streetLayerGroup = new ol.layer.Group({
    layers: [
        baseMapLayer,
        polygonLayer
    ]
});
var satelliteLayerGroup = new ol.layer.Group({
    layers: [
        satelliteLayer,
        polygonLayer
    ]
});

    var toggleViewRadios = document.getElementsByName('toggleView');
  for (var i = 0, length = toggleViewRadios.length; i < length; i++) {
    toggleViewRadios[i].addEventListener('click', function(event) {

      if (this.value == 'street-view') {
        //set street view later
        map.setLayerGroup(streetLayerGroup); 
      } else if (this.value == 'satellite-view') {
        //set satellite view layer
        map.setLayerGroup(satelliteLayerGroup); 
      }
    }, false);
  }

  }