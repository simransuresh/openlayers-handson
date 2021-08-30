import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import TileLayer from 'ol/layer/tile'
import XYZSource from 'ol/source/XYZ'

const map = new Map({
  target: 'map-container',
  view: new View({
    center: fromLonLat([-117.1493, 32.6965]),
    zoom: 12
  })
})

const source = new XYZSource({
  url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
})

const base_layer = new TileLayer({
  source: source
})

map.addLayer(base_layer)

// Mapbox public access token
const TOKEN = 'pk.eyJ1Ijoic2ltcmFuc3VyZXNoIiwiYSI6ImNrcm45N3RhdzBqaTAybnJxZjRqbHlpazkifQ.GUFzL4BgO6aORl_vIJ7eyg'

// terrain rgb tiles containing elevation from sea level from mapbox
const elevation = new XYZSource({
  url: 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=' + TOKEN,
  crossOrigin: 'anonymous'
});

const tile_layer = new TileLayer({
  opacity: 0.8,
  source: elevation
})

map.addLayer(tile_layer)

// rendering sea level - remove tile layer for better visualization
import ImageLayer from 'ol/layer/Image'
import RasterSource from 'ol/source/Raster'

function flood(pixels, data) {
  // single pixel manipulation of the elevation data
  const pixel = pixels[0];
  if (pixel[3]) {
    // decode R, G, B values as elevation
    const height = -10000 + ((pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]) * 0.1);
    if (height <= data.level) {
      // sea blue
      pixel[0] = 145; // red
      pixel[1] = 175; // green
      pixel[2] = 186; // blue
      pixel[3] = 255; // alpha
    } else {
      // transparent
      pixel[3] = 0;
    }
  }
  return pixel;
}

const raster = new RasterSource({
  sources: [elevation],
  operation: flood
})

const control = document.getElementById('level');
const output = document.getElementById('output');
control.addEventListener('input', function() {
  output.innerText = control.value;
  raster.changed();
});
output.innerText = control.value;
raster.on('beforeoperations', function(event) {
  event.data.level = control.value;
});

const image_layer = new ImageLayer({
  source: raster,
  opacity: 0.8
})

map.addLayer(image_layer)






