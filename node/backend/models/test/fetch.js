const options = {method: 'GET'};

fetch('http://192.168.68.2:8080/geoserver/Realtix/ows?service=WFS&version=1.0.0&maxFeatures=10&request=GetFeature&typeName=Realtix%3AConsultorios_pediatria&outputFormat=application%2Fjson', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .then();

