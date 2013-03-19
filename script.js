function init(){
   function setLayer() {
       var hash = window.location.hash.substring(1);
       if (LayerActions[hash]) {
          $('.nav li').removeClass('active');
          $('.buttons.' + hash).parent().addClass('active');
          LayerActions[hash]();
       }
   }

   // initiate leaflet map
   var map = new L.Map('map', {
      center: [47.558430,7.587790],
      zoom: 14
   });
   var layerUrl = 'http://davidbauer.cartodb.com/api/v1/viz/23294/viz.json';
   var layerOptions = {
      query: "SELECT * FROM {{table_name}}",
      tile_style: "#{{table_name}}{marker-fill: grey;marker-opacity: 0.9;marker-allow-overlap: true;marker-placement: point;marker-type: ellipse;marker-width: 15;[tageswoche='Ja']{marker-fill: #136400; marker-opacity: 0.9; marker-allow-overlap: true; marker-placement: point; marker-type: ellipse; marker-width: 15;}[wlan = 'Ja']{  marker-width: 18; marker-line-width: 5; marker-line-color: #FFF; marker-line-opacity: 0.9;}[wlan = 'auf Anfrage']{marker-width: 18;marker-line-width: 5; marker-line-color: #FFF; marker-line-opacity: 0.9;}}#{{table_name}}::labels { [zoom > 13] { text-name: [name]; text-face-name: 'DejaVu Sans Book';text-size: 10;text-fill: #000;[sonntag != 'geschlossen'] {text-fill: green;} text-allow-overlap: true; text-halo-fill: #FFF; text-halo-radius: 3; text-dy: -10; }}"
    };
   var layers = [];
   var LayerActions = {
        all: function(){
          layers[0].setQuery("SELECT * FROM {{table_name}}");
          return true;
        },
        wlan: function(){
          layers[0].setQuery("SELECT * FROM {{table_name}} WHERE wlan = 'Ja'");
          return true;
        },
        tageswoche: function(){
          layers[0].setQuery("SELECT * FROM {{table_name}} WHERE tageswoche = 'Ja'");
          return true;
        },
        sonntag: function(){
          layers[0].setQuery("SELECT * FROM {{table_name}} WHERE sonntag != 'geschlossen'");
          return true;
        },
        preis: function(){
          layers[0].setQuery("SELECT * FROM {{table_name}} WHERE kaffee < '4' AND kaffee != ''");
          return true;
        }
     };

   L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/davidbauer.map-gk7ssm63/{z}/{x}/{y}.png', {
      attribution: 'MapBox'
   }).addTo(map);

   cartodb.createLayer(map, layerUrl, layerOptions)
     .on('done', function(layer) {
       map.addLayer(layer);
       layers.push(layer);
       setLayer();
     }).on('error', function() {
       console.error(arguments);
     });

   $('.buttons').click(function() {
      $('.nav li').removeClass('active');
      $(this).parent().addClass('active');
      $('.nav-collapse').collapse('hide');
      LayerActions[$(this).attr('data-id')]();
   });

   $('.btn-navbar').click(function() {
      $('.nav-collapse').collapse('toggle');
   });
}

