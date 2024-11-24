import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';
import Link from 'ol/interaction/Link';
import Map from 'ol/Map';
import Modify from 'ol/interaction/Modify';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';

const map = new Map({
  target: 'map-container',
  layers: [
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: './data/countries.json',
      }),
    }),
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
});

map.addInteraction(new Link());

const source = new VectorSource();
const layer = new VectorLayer({
  source: source,
});
map.addLayer(layer);
map.addInteraction(
  new DragAndDrop({
    source,
    formatConstructors: [GeoJSON],
  })
);
map.addInteraction(
  new Draw({
    type: 'Polygon',
    source,
  })
);
