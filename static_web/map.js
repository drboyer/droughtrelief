var precip_colormap = [
    [0.01, '#7FFF00'],
    [0.10, '#00CD00'],
    [0.25, '#008B00'],
    [0.50, '#104E8B'],
    [0.75, '#1E90FF'],
    [1.00, '#00B2EE'],
    [1.25, '#00EEEE'],
    [1.50, '#8968CD'],
    [1.75, '#912CEE'],
    [2.00, '#8B008B'],
    [2.50, '#8B0000'],
    [3.00, '#CD0000'],
    [4.00, '#EE4000'],
    [5.00, '#FF7F00'],
    [7.00, '#CD8500'],
    [10.0, '#FFD700'],
    [15.0, '#FFFF00'],
    [20.0, '#FFAEB9']
];

mapboxgl.accessToken = 'pk.eyJ1IjoiZHJib3llciIsImEiOiJrcktxVzUwIn0.I_GHLFWptisHJZrXEktGAg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-97, 39],
    zoom: 4
});

map.on('load', function() {
    map.addSource('drought', {
        type: 'geojson',
        data: 'drought.geojson'
    });
    map.addSource('qpf', {
        type: 'geojson',
        data: 'qpf.geojson'
    });

    map.addLayer({
        "id": "drought",
        "source": "drought",
        "type": "fill",
        "paint": {
            "fill-color": {
                property: 'DM',
                stops: [
                    [0, '#FFFF00'],
                    [1, '#FCD37F'],
                    [2, '#FFAA00'],
                    [3, '#E60000'],
                    [4, '#730000']
                ]
            },
            "fill-opacity": 0.5
        }
    }, 'water');

    map.addLayer({
        "id": "qpfcontour",
        "type": "line",
        "source": "qpf",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#000000",
            "line-width": 1
        }
    });

    map.addLayer({
        "id": "qpf",
        "source": "qpf",
        "type": "fill",
        "paint": {
            "fill-color": {
                property: 'QPF',
                stops: precip_colormap
            },
            "fill-opacity": 0.8
        }
    }, 'drought');
});

$(document).ready(function() {
    // build the precip legend
    var precip_legend_els = [];
    for (let level of precip_colormap) {
        var el = document.createElement('td');
        var style_attr = document.createAttribute('style');
        style_attr.value = 'background-color: ' + level[1];
        var text = document.createTextNode(level[0].toString());
        el.setAttributeNode(style_attr);
        el.appendChild(text);
        precip_legend_els.push(el);
    }

    $('#precip-legend tr').append(precip_legend_els);

});

// Event handlers below

function changeLayerVisibility(event) {
    // console.debug(event);
    var layerTarget = event.target.id.split('-')[1];
    var percentVal = event.target.value / 100.0;
    console.log("Setting "+layerTarget+" to "+ percentVal + " opacity");
    map.setPaintProperty(layerTarget, 'fill-opacity', percentVal);
}

function toggleLayer(event) {
    // console.debug(event);
    var layerTarget = event.target.id.split('-')[1];
    if (event.target.checked) {
        map.setLayoutProperty(layerTarget, 'visibility', 'visible');
    } else {
        map.setLayoutProperty(layerTarget, 'visibility', 'none');
    }
}
