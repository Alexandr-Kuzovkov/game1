<!DOCTYPE html>
<html>
<head>
  <title>Leaflet</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
	<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
</head>
    <body>
      <div id="map" style="width: 1024px; height: 768px"></div>
	  
	  <script type="text/javascript">
		
		//������� �����
		var map = L.map('map').setView([56.605, 47.9], 13);
		
		//������� tile-���� � ��������� ��� �� ����� 
		L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery � <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i86knfo3'
		}).addTo(map);
		
		//������� ������
		marker = L.marker([56.6,47.9],13).addTo(map);
		//������� ����
		var circle = L.circle([56.62,47.9], 500, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		}).addTo(map);
		
		//������� �������
		var polygon = L.polygon([
			[56.6, 47.9],
			[56.5, 47.91],
			[56.6, 47.92]
		]).addTo(map);
		
		//������� ����������� ��������� � ����� (popup)
		circle.bindPopup("<b>��� ����</b>");//����������� �� �����
		marker.bindPopup("<b>��� ������</b>").openPopup();//����������� �����
		polygon.bindPopup("��� �������");
		
		//������������� ��� ����
		var popup = L.popup()
		.setLatLng([56.62,47.8])
		.setContent("I am a standalone popup.")
		.openOn(map);
		
		//��������� �������
		//���� �� �����
		function onMapClick(e) {
			//alert("You clicked the map at " + e.latlng);
			map.removeLayer(marker);
		}
		map.on('click', onMapClick);
		
		/*
		var popup = L.popup();
		
		//����, ������������� popup ������ alert
		function onMapClick(e) {
			popup
				.setLatLng(e.latlng)
				.setContent("You clicked the map at " + e.latlng.toString())
				.openOn(map);
		}

		map.on('click', onMapClick);
		
		//��������� ������� � ����� �����
		function onMapClick(e) {
			//var marker = L.marker(e.latlng,13).addTo(map);
		}
		map.on('click', onMapClick);
		
		
		//�������� ������� �� ������ 
		
		var greenIcon = L.icon({
			iconUrl: '/img/leaf-green.png',
			shadowUrl: '/img/leaf-shadow.png',

			iconSize:     [38, 95], // size of the icon
			shadowSize:   [50, 64], // size of the shadow
			iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
			shadowAnchor: [4, 62],  // the same for the shadow
			popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
		});
		
		L.marker([56.6,47.93], {icon: greenIcon}).addTo(map);
		
		//���� ����� ��������� ������ ����� ���������� ����� icon
		var LeafIcon = L.Icon.extend({
			options: {
				shadowUrl: '/img/leaf-shadow.png',
				iconSize:     [38, 95],
				shadowSize:   [50, 64],
				iconAnchor:   [22, 94],
				shadowAnchor: [4, 62],
				popupAnchor:  [-3, -76]
			}
		});
		
		var greenIcon = new LeafIcon({iconUrl: '/img/leaf-green.png'}),
		redIcon = new LeafIcon({iconUrl: '/img/leaf-red.png'}),
		orangeIcon = new LeafIcon({iconUrl: '/img/leaf-orange.png'});
		
		L.marker([56.62,47.82], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");
		L.marker([56.61,47.81], {icon: redIcon}).addTo(map).bindPopup("I am a red leaf.");
		L.marker([56.62,47.83], {icon: orangeIcon}).addTo(map).bindPopup("I am an orange leaf.");
		*/
	  </script>
    </body>
</html>