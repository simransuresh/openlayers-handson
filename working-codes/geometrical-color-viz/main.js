import 'ol/ol.css'
import sync from 'ol-hashed'
import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/vector'
import VectorLayer from 'ol/layer/vector'
import { Style, Fill, Stroke } from 'ol/style'
import colormap from 'colormap'
import { getArea } from 'ol/sphere'

const map = new Map({target: 'map-container'});
sync(map);

// const static_styled_layer = new VectorLayer({
//   source: source,
//   style: new Style({
//     fill: new Fill({
//       color: 'red'
//     }),
//     stroke: new Stroke({
//       color: 'white'
//     })
//   })
// });

// const dyn_styled_layer = new VectorLayer({
//   source: source,
//   style: function(feature, resolution) {
//     const name = feature.get('name').toUpperCase();
//     return name < "N" ? style1 : style2; // assuming these are created elsewhere
//   }
// });

const min = 1e8;
const max = 2e13;
const steps = 50;

const ramp = colormap({
  colormap: 'blackbody',
  nshades: steps
})

const clamp = function(low, high, value) {
  return Math.max(Math.min(value, high), low)
}

const getColor = function(feature) {
  const area = getArea(feature.getGeometry());
  const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
  const index = Math.round(f * (steps - 1));
  return ramp[index];
}

const source = new VectorSource({
  format: new GeoJSON(),
  url: 'data/countries.json'
});

const getStroke = new Stroke({
  color: 'rgba(255,255,255,0.8)'
});

const getFill = function(feature) {
  return new Fill({
    color: getColor(feature)
  });
}

const layer = new VectorLayer({
  source: source,
  style: function(feature) {
    return new Style({
      fill: getFill(feature),
      stroke: getStroke
    });
  }
});

map.addLayer(layer);
