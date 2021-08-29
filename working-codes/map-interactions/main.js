import 'ol/ol.css'
import sync from 'ol-hashed'
import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/vector'
import VectorLayer from 'ol/layer/vector'
import DragAndDrop from 'ol/interaction/DragAndDrop'
import Modify from 'ol/interaction/Modify'
import Draw from 'ol/interaction/Draw'
import GeometryType from 'ol/geom/geometrytype'
import Snap from 'ol/interaction/Snap'

const map = new Map({target: 'map-container'});
sync(map);

const source = new VectorSource();

const layer = new VectorLayer({
  source: source
})
map.addLayer(layer)

map.addInteraction(new DragAndDrop({
  source: source,
  formatConstructors: [GeoJSON]
}));

map.addInteraction(new Modify({
  source: source
}))

map.addInteraction(new Draw({
  type: GeometryType.POLYGON, //'Polygon',
  source: source
}))

map.addInteraction(new Snap({
  source: source
}))

const clear = document.getElementById('clear')
clear.addEventListener('click', function(){
  source.clear()
})

const format = new GeoJSON({featureProjection: 'EPSG:3857'});
const download = document.getElementById('download');
source.on('change', function() {
  const features = source.getFeatures();
  const json = format.writeFeatures(features);
  download.href = 'data:text/json;charset=utf-8,' + json;
});

