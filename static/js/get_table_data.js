var table_data;
var thresholds_data;
var centroids_data;
var forecast_hours = [24, 72, 144];
var markersArray = [];

// Top level method, it handles the events fired by changing tab on alerts panel
/**function updateAlerts(){
  var filter = document.getElementById("alerts_filter").value;
  displayAlertsOverThreshold(filter);
  updateMarkers();  
} */

/**
 * Updates DOM with data in the current filter option
 *
 * @param {number} alert_threshold hashes the filter level, starting from 0 represents the timespan chosen in the filter on UI
 */
function displayAlertsOverThreshold(alert_threshold){
  $.getJSON( "http://erds.ithacaweb.org/static/json/textual_flooding_results.JSON", function( data ) {
    table_data = data;
        
    if(thresholds_data == null){
      $.getJSON( "static/json/thresholds.JSON", function( thresholds ) {
        thresholds_data = thresholds;
      });
    }

    var items = [];
    var html = '';
    var curr_state = '';
    var firstElement = true;

    html += '<ul class="nav nav-pills" role="tablist">';
    html += '<li class="active"><a href="#' + forecast_hours[0] + '" role="tab" data-toggle="tab" onCLick="updateActiveLayer(' + 0 + ')">' + forecast_hours[0] + 'h</a></li>';
    // Genero la pillola
    for(h = 1; h<forecast_hours.length; h++){
      html += '<li><a href="#' + forecast_hours[h] + '" role="tab" data-toggle="tab" onCLick="updateActiveLayer(' + h + ')">' + forecast_hours[h] + 'h</a></li>';
    }
    html += '</ul>';
    
    html += '<div class="tab-content">';
    // Genero automaticamente il pannello
    for(h = 0; h < forecast_hours.length; h++){
      // Se è il primo pannello lo metto attivo      
      if (h == 0) html += '<div role="tabpanel" class="tab-pane active" id="'+forecast_hours[h]+'">';
      else{
        if(!EventsOverTInPanel(h,alert_threshold)) html += '</div></div></div></div>';
        else{
          if(EventsOverTInPanel(h-1,alert_threshold))
            html += '</div></div></div></div>';
          else
            html += '</div>';
        }
        html += '<div role="tabpanel" class="tab-pane" id="'+forecast_hours[h]+'">';
      }
      // Creo il panel group per i collapsible      
      html += '<div class="panel-group" id="accordion' + h + '" role="tablist" aria-multiselectable="true">';
      firstElement = true;
      // If we have events over the threshold chosen by user or by default
      var curr_span;
      if(EventsOverTInPanel(h, alert_threshold)){
        for(i=0; i < data[forecast_hours[h]].length; i++){
          if(EventsOverTInState(h, i, alert_threshold)){
            curr_span = forecast_hours[h];
            // if nation changed
            if(data[forecast_hours[h]][i]['state'].replace(/\s+/g, '') != curr_state){
              curr_state = data[forecast_hours[h]][i]['state'].replace(/\s+/g, '');
              if(!firstElement) html += '</div></div></div>';
              else firstElement = false;
                html += '<div class="panel panel-default">';
                html += '<div class="panel-heading" role="tab" id="heading' + data[forecast_hours[h]][i]['state'].replace(/\s+/g, '') + forecast_hours[h] + '">';
                html += '<h4 class="panel-title">' + 
                    getMaxAlertLevelIconHTML(h, i) +
                    '<a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse' + data[forecast_hours[h]][i]['state'].replace(/\s+/g, '') + forecast_hours[h] + '" aria-expanded="false" aria-controls="collapse' + data[forecast_hours[h]][i]['state'].replace(/\s+/g, '') + forecast_hours[h] + '"' +
                    '>' +
                    data[forecast_hours[h]][i]['state'] +
                    '</a>' +
                    '</h4></div>';
                html += '<div id="collapse' + data[forecast_hours[h]][i]['state'].replace(/\s+/g, '') + forecast_hours[h] + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + data[forecast_hours[h]][i]['state'].replace(/\s+/g, '') + forecast_hours[h] + '">';
                html += '<div class="panel-body">';
            }
            if(alert_threshold<=1 && data[forecast_hours[h]][i]['alert_level'] === 1){
              // Parte interna dinamica per più eventi nella stessa nazione        
              html += '<p class="state_name">';
              // Alert level squares
              html += '<i class="fa fa-square" style="color:yellow"></i> ';
              html += '<a href="#" ';
              html += 'onclick = "moveViewTo(' + data[forecast_hours[h]][i]['prov_centroid_lat'] + ', ' + data[forecast_hours[h]][i]['prov_centroid_long'] + '); openMarkerPopupByPosition(' + h + ', ' + data[forecast_hours[h]][i]['id_evento'] + ');"';
              html += '>'
              html += data[forecast_hours[h]][i]['prov'] + '</a></p> ';
              html += '<p class="cum_pop_list_values">Max precipitation estimate in the next '+forecast_hours[h]+'h: <strong>' + data[forecast_hours[h]][i]['cumulation'] + 'mm</strong>.</p><p>Potentially affected population: <strong>' +  addCommas(data[forecast_hours[h]][i]['pop']) + "</strong>.</p>";
              html += '</p>';
            }
            if(alert_threshold<=2 && data[forecast_hours[h]][i]['alert_level'] === 2){
              // Parte interna dinamica per più eventi nella stessa nazione        
              html += '<p class="state_name">';
              // Alert level squares
              html += '<i class="fa fa-square" style="color:orange"></i> ';
              html += '<a href="#" ';
              html += 'onclick = "moveViewTo(' + data[forecast_hours[h]][i]['prov_centroid_lat'] + ', ' + data[forecast_hours[h]][i]['prov_centroid_long'] + '); openMarkerPopupByPosition(' + h + ', ' + data[forecast_hours[h]][i]['id_evento'] + ')"';
              html += '>'
              html += data[forecast_hours[h]][i]['prov'] + '</a></p> ';
              html += '<p class="cum_pop_list_values">Max precipitation estimate in the next '+forecast_hours[h]+'h: <strong>' + data[forecast_hours[h]][i]['cumulation'] + 'mm</strong>.</p><p>Potentially affected population: <strong>' +  addCommas(data[forecast_hours[h]][i]['pop']) + "</strong>.</p>";
              html += '</p>';
            }
            if(alert_threshold<=3 && data[forecast_hours[h]][i]['alert_level'] === 3){
              // Parte interna dinamica per più eventi nella stessa nazione        
              html += '<p class="state_name">';
              // Alert level squares
              html += '<i class="fa fa-square" style="color:red"></i> ';
              html += '<a href="#" ';
              html += 'onclick = "moveViewTo(' + data[forecast_hours[h]][i]['prov_centroid_lat']  + ', ' + data[forecast_hours[h]][i]['prov_centroid_long'] + '); openMarkerPopupByPosition(' + h + ', ' + data[forecast_hours[h]][i]['id_evento'] + ')"';
              html += '>'
              html += data[forecast_hours[h]][i]['prov'] + '</a></p> ';
              html += '<p class="cum_pop_list_values">Max precipitation estimate in the next '+forecast_hours[h]+'h: <strong>' + data[forecast_hours[h]][i]['cumulation'] + 'mm</strong>.</p><p>Potentially affected population: <strong>' +  addCommas(data[forecast_hours[h]][i]['pop']) + "</strong>.</p>";
              html += '</p>';
            }
          }
        }
      }
      html += "</div>";
    }
    // Close tab-content div
    html += "erds</div></div></div>";
  
    document.getElementById("alerts_table_content").innerHTML = html;
  });  
}

/**
 * Returns HTML code that will be embedded in the page to show correct icon based on the max alert level of an event in each state
 * (check the JSON structure for greater clarity)
 *
 * @param {number} h the current time span interval
 * @param {number} i the current object from the list
 * @return {string} the HTML code
 */
function getMaxAlertLevelIconHTML(h, i){
  var maxAlert = 1;
  curr_state = table_data[forecast_hours[h]][i]['state'];
  var index = i;
  while (index < table_data[forecast_hours[h]].length && curr_state == table_data[forecast_hours[h]][index]['state']){  
    if(table_data[forecast_hours[h]][index]['alert_level'] > maxAlert)
      maxAlert = table_data[forecast_hours[h]][index]['alert_level'];
    index++;
  }
  if(maxAlert == 1) return '<i class="fa fa-square" style="color:yellow"></i> ';
  if(maxAlert == 2) return '<i class="fa fa-square" style="color:orange"></i> ';
  if(maxAlert == 3) return '<i class="fa fa-square" style="color:red"></i> ';
}

/**
 * Checks if exists an event that complies with filter options in a single state
 *
 * @param {number} h the current time span interval
 * @param {number} i the current object from the list
 * @param {number} l min alert level that has to be shown on UI
 * @return {boolean} true if a compliant event exists, false otherwise
 */
function EventsOverTInState(h, i, l){
  var count = 0;
  curr_state = table_data[forecast_hours[h]][i]['state'];
  var index = i;
  while (index < table_data[forecast_hours[h]].length && curr_state == table_data[forecast_hours[h]][index]['state']){  
    if(table_data[forecast_hours[h]][index]['alert_level'] >= l)
      return true;
    index++;
  }
  return false;
}

/**
 * Checks if exists an event that complies with filter options in the selected time span
 *
 * @param {number} h the current time span interval
 * @param {number} l min alert level that has to be shown on UI
 * @return {boolean} true if a compliant event exists, false otherwise
 */
function EventsOverTInPanel(h, l){
  var count = 0;
  var index = 0;
  while (index < table_data[forecast_hours[h]].length){  
    if(table_data[forecast_hours[h]][index]['alert_level'] >= l)
      return true;
    index++;
  }
  return false;
}

/**
 * Adds commas to thousands
 *
 * @param {string} nStr the number that need commas
 * @return {string} the string of the number with commas
 */
function addCommas(nStr)
{
    var sep = ',';
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + sep + '$2');
    }
    return x1 + x2;
}

// Adds leaflet markers to the map and fills their popup with proper content
function updateMarkers(){
  for(i = 0; i < markersArray.length; i++){
    map.removeLayer(markersArray[i]);
  }

  markersArray = [];
  var forecast = [false, false, false];
  forecast[0] = document.getElementById("flooded_population_h24").checked;
  forecast[1] = document.getElementById("flooded_population_h72").checked;
  forecast[2] = document.getElementById("flooded_population_h144").checked;

  $.getJSON( "http://erds.ithacaweb.org/static/json/geometry_results.JSON", function( centroids ) {
    centroids_data = centroids;    
    var popupOptions;
    for(h = 0; h < forecast.length; h++){
      if(forecast[h]){
        for(i = 0; i < centroids[forecast_hours[h]].length; i++){
          var marker = L.marker([
            centroids_data[forecast_hours[h]][i]['c_long'],
            centroids_data[forecast_hours[h]][i]['c_lat']
          ]);
          // Print popup titles
          var temp_string = '<p class="popup_title"> ';
          for(textual_event = 0; textual_event < table_data[forecast_hours[h]].length; textual_event++){
            if(table_data[forecast_hours[h]][textual_event]['id_evento'] === centroids[forecast_hours[h]][i]['id']){
              temp_string += table_data[forecast_hours[h]][textual_event]['prov'] + ', ';
            }
          }
          // Remove last comma from provs list
          temp_string = temp_string.substring(0, temp_string.length - 2);
          temp_string += '</p>';

          // chart HTML
          temp_string += '<p><div id="linechart_material' + h + 'p' + i + '" class="chart_container"></div>';
          temp_string += '<table id="below_chart_table">';
          temp_string += '<tr class="popup_data_number"><td class="popup_number_left_column">' + centroids[forecast_hours[h]][i]['cumul'] + '<span id="table_millimiters">mm</span></td><td class="popup_number_right_column">' + addCommas(centroids[forecast_hours[h]][i]['pop']) + '</td></tr>';
          temp_string += '<tr class="popup_data_label"><td class="popup_label_left_column">Max<br>precipitation value ' + forecast_hours[h] + 'h</td><td class="popup_label_right_column">Potentially<br>affected population</td></tr>';
          temp_string += '</table>';
          popupOptions = {'maxWidth': '350px'}
          marker.bindPopup(temp_string, popupOptions);
          marker.IdEvento = centroids_data[forecast_hours[h]][i]['id'];
          marker.myI = i;
          marker.myH = h;
          marker.on('popupopen', function(e){
            drawChart(e.target.myH, e.target.myI);
          });
          marker.addTo(map);
          // save marker references into an array, it will be useful to remove them at the next marker ui-interaction
          markersArray.push(marker);
        }
      }
    }
  });
}

/**
 * Draws the cumulated chart using Google Chart tool for a single marker popup
 *
 * @param {object} marker the marker that contains all the data we need to print the chart
 */
function drawChart(h, i) {
  if(document.getElementById('linechart_material' + h + 'p' + i) != null){

    var data = new google.visualization.arrayToDataTable([
      [
        'Forecast interval',
        'Cumulated rainfall', {'type': 'number', 'role': 'style'},
        'Alert 1', {'type': 'number', 'role': 'style'},
        'Alert 2', {'type': 'number', 'role': 'style'},
        'Alert 3', {'type': 'number', 'role': 'style'},
        'Precipitation Amount', {'type': 'number', 'role': 'style'}
      ],
      [
        '24h',
        centroids_data[forecast_hours[h]][i]['cum_gfs_24h'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['24-1']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['24-2']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['24-3']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        centroids_data[forecast_hours[h]][i]['apcp_24h'], 'point { size: 3; shape-type: point; }'
      ],
      [
        '48h',
        centroids_data[forecast_hours[h]][i]['cum_gfs_48h'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['48-1']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['48-2']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['48-3']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        centroids_data[forecast_hours[h]][i]['apcp_48h'], 'point { size: 3; shape-type: point; }'
      ],
      [
        '72h',
        centroids_data[forecast_hours[h]][i]['cum_gfs_72h'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['72-1']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['72-2']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['72-3']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        centroids_data[forecast_hours[h]][i]['apcp_72h'], 'point { size: 3; shape-type: point; }'
      ],
      [
        '96h',
        centroids_data[forecast_hours[h]][i]['cum_gfs_96h'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['96-1']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['96-2']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['96-3']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        centroids_data[forecast_hours[h]][i]['apcp_96h'], 'point { size: 3; shape-type: point; }'
      ],
      [
        '120h',
        centroids_data[forecast_hours[h]][i]['cum_gfs_120h'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['120-1']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['120-2']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['120-3']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        centroids_data[forecast_hours[h]][i]['apcp_120h'], 'point { size: 3; shape-type: point; }'
      ],
      [
        '144h',
        centroids_data[forecast_hours[h]][i]['cum_gfs_144h'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['144-1']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['144-2']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        parseInt(thresholds_data['144-3']) * centroids_data[forecast_hours[h]][i]['pol_thr'], 'point { size: 0; shape-type: point; }',
        centroids_data[forecast_hours[h]][i]['apcp_144h'], 'point { size: 3; shape-type: point; }'
      ]
    ]);

    var options = {
      width: 300,
      height: 190,
      backgroundColor: '609cd1',
      chartArea:{width:"85%"},
      legend: {'position': 'none'},
      pointSize: 1,
      textStyle: {color: '#ffffff'},
      hAxis: {
        textStyle: {color: '#ffffff'}
      },
      vAxis: {
        //title: 'Rainfall amount',
        textStyle: {color: '#ffffff'},
        viewWindowMode:'pretty',
        gridlines: {color: 'white'}
      },
      series: {4: {type: 'bars'} },
      colors: ['#1362ab', 'yellow', 'orange', 'red', '#4379ab']
    };

    var chart = new google.visualization.LineChart(document.getElementById('linechart_material' + h + 'p' + i));
    chart.draw(data, options);
  }
}

/**
 * Focuses map view on a lat-long position
 *
 * @param {number} lat target point latitude
 * @param {number} long target point longitude
 */
function moveViewTo(lat, long){
  var zoom_level = 6;
  side_panel_lat_offset = 5;
  side_panel_long_offset = 1;
  map.setView([long + side_panel_long_offset, lat - side_panel_lat_offset], zoom_level, {animation:true});
}

/**
 * Focuses map view on a lat-long position
 *
 * @param {number} lat target point latitude
 * @param {number} long target point longitude
 */
function updateActiveLayer(newLayerID){
  map.removeLayer(flooded_population_h24);
  map.removeLayer(flooded_population_h72);
  map.removeLayer(flooded_population_h144);

  if(newLayerID == 0){
    map.addLayer(flooded_population_h24);
    document.getElementById("flooded_population_h24").checked = true;
    document.getElementById("flooded_population_h72").checked = false;
    document.getElementById("flooded_population_h144").checked = false;
  }
  if(newLayerID == 1){
    map.addLayer(flooded_population_h72);
    document.getElementById("flooded_population_h24").checked = false;
    document.getElementById("flooded_population_h72").checked = true;
    document.getElementById("flooded_population_h144").checked = false;
  }
  if(newLayerID == 2){
    map.addLayer(flooded_population_h144);
    document.getElementById("flooded_population_h24").checked = false;
    document.getElementById("flooded_population_h72").checked = false;
    document.getElementById("flooded_population_h144").checked = true;
  }
  updateMarkers();
}

/**
 * Open marker popup by its position in json file
 *
 * @param {number} h forecast hour
 * @param {number} i event position in the list
 */
function openMarkerPopupByPosition(h, i){
  for(j = 0; j < markersArray.length; j++){
    if(markersArray[j].myH == h && markersArray[j].IdEvento == i)
      markersArray[j].openPopup();
  }
}
