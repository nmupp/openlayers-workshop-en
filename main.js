import DragAndDrop from 'ol/interaction/DragAndDrop';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import Link from 'ol/interaction/Link';
import Map from 'ol/Map';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';
import {Style, Fill, Stroke} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';
import colormap from 'colormap';
import {getArea} from 'ol/sphere';

const min = 1e8; // the smallest area
const max = 2e13; // the biggest area
const steps = 50;
const ramp = colormap({
  colormap: 'blackbody',
  nshades: steps,
});

function clamp(value, low, high) {
  return Math.max(low, Math.min(value, high));
}

function getColor(feature) {
  const area = getArea(feature.getGeometry());
  const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
  const index = Math.round(f * (steps - 1));
  return ramp[index];
}

const map = new Map({
  target: 'map-container',
  layers: [
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: './data/countries.json',
      }),
      style: function(feature) {
        return new Style({
            fill: new Fill({
                color: getColor(feature),
            }),
            stroke: new Stroke({
                color: 'rgba(255,255,255,0.8)'
            }),
        })
      },
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
// map.addInteraction(
//   new Draw({
//     type: 'Polygon',
//     source,
//   })
// );

// map.addInteraction(
//     new Snap({
//       source: source,
//     })
// );

const clear = document.getElementById('clear');
clear.addEventListener('click', function () {
  source.clear();
});

const format = new GeoJSON({featureProjection: 'EPSG:3857'});
const download = document.getElementById('download');
source.on('change', function () {
  const features = source.getFeatures();
  const json = format.writeFeatures(features);
  download.href =
    'data:application/json;charset=utf-8,' + encodeURIComponent(json);
});
