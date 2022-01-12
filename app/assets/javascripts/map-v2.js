function mapV2(_location){

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

  const source = new ol.source.Vector();
  const vector = new ol.layer.Vector({
      source: source,
      style: new ol.style.Style({
          fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.25)',
          }),
          stroke: new ol.style.Stroke({
              color: '#d4351c',
              width: 3,
          })
      }),
  });

  //England zoom (default)
  var _lon = -1.464854,
      _lat = 52.561928,
      _zoom = 6.6;

  //Oxford zoom
  if(_location == "place" || _location == "gridref"){
    _lon = -1.257677;
    _lat = 51.752022;
    _zoom = 12;
  }

  //Map
  var map = new ol.Map({
    target: 'map',
    layers: [ baseMapLayer, vector ],
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

  //Change from street to satellite (radio buttons)
  var toggleViewRadios = document.getElementsByName('toggleView');
  for (var i = 0, length = toggleViewRadios.length; i < length; i++) {
    toggleViewRadios[i].addEventListener('click', function(event) {
      if (this.value == 'street-view') {
        map.setLayerGroup(new ol.layer.Group({layers: [baseMapLayer,vector]})); 
      } else if (this.value == 'satellite-view') {
        map.setLayerGroup(new ol.layer.Group({layers: [satelliteLayer,vector]})); 
      }
    }, false);
  }

  //Modify
  const modify = new ol.interaction.Modify({source: source});
  map.addInteraction(modify);

  let draw, snap; // global so we can remove them later
  function addInteractions() {
    //Draw
    draw = new ol.interaction.Draw({
        source: source,
        type: 'Polygon'
    });
    map.addInteraction(draw);
    //Snap
    snap = new ol.interaction.Snap({source: source});
    map.addInteraction(snap);
  }
  addInteractions();

  var drawing = false
  draw.on('drawstart', function (e) {
    drawing = true
  });
  draw.on('drawend', function (e) {
    drawing = false

    //Allows only 1 polygon at a time
    var coordinates = e.feature.getGeometry().getCoordinates()[0]
    if (coordinates.length >= 4) {
      //Timeout prevents map zooming in when doubling click to complete shape
      setTimeout(function () {
        map.removeInteraction(draw)
      }, 100);
    }
    
  });

  var deleteBtn = document.getElementById("deleteShapeBtn");
  deleteBtn.addEventListener('click', function(event) {
    //Delete in progress drawing
    if(drawing){
      drawing = false
      draw.abortDrawing()
    } else {
      //Delete completed drawing in order of last drawn
      var drawingsCount = source.getFeatures().length
      if (drawingsCount > 0) {
        source.removeFeature(source.getFeatures()[drawingsCount-1]);
        map.addInteraction(draw);
      }
    }
  }, false);

  
}