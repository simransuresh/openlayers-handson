import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import MVT from 'ol/format/MVT'
import VectorTileSource from 'ol/source/VectorTile'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke } from 'ol/style';
import { Feature } from 'ol';
import { fromExtent } from 'ol/geom/Polygon';

// Maptiler api key
const API_KEY = '2cABekqwzvhK7tiD60qw';

const source = new VectorTileSource({
  attributions: [
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
  ],
  format: new MVT(),
  url: `https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${API_KEY}`,
  maxZoom: 14
})

const layer = new VectorTileLayer({
  source: source
});

const view = new View({
  center: fromLonLat([-117.1625, 32.715]),
  zoom: 6
});

const map = new Map({
  target: 'map-container',
  view: view
});

map.addLayer(layer);

// didnt work :<
// import 'ol/ol.css';
// import apply from 'ol-mapbox-style';
// const map = apply('map-container', './data/bright.json');

// adding marker on pointer move
const vector_source = new VectorSource();
new VectorLayer({
  map: map,
  source: vector_source,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 4
    })
  })
});

map.on('pointermove', function(event) {
  vector_source.clear();
  map.forEachFeatureAtPixel(event.pixel, function(feature) {
    const geometry = feature.getGeometry();
    vector_source.addFeature(new Feature(fromExtent(geometry.getExtent())));
  }, {
    hitTolerance: 2
  });
});





