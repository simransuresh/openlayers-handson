import 'ol/ol.css'
import sync from 'ol-hashed'
import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/vector'
import VectorLayer from 'ol/layer/vector'

const map = new Map({
  target: 'map-container',
  layers: [
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: 'data/countries.json'
      })
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

sync(map);
