const mapElement = document.getElementById("map");

if (mapElement) {
  let map = null;

  const map_resize = () => {
    google.maps.event.trigger(map, "resize");
    map.panTo(new google.maps.LatLng(59.936287, 30.321047));
  };

  const init = () => {
    const mapOptions = {
      zoom: 18,
      disableDefaultUI: true,
      mapTypeControl: false,
      fullscreenControl: false,
      scrollwheel: true,
      zoomControl: false,
      scaleControl: false,
      streetViewControl: false,
      center: new google.maps.LatLng(59.9387216, 30.3228419)
    };

    mapElement.classList.add("map--loaded");

    map = new google.maps.Map(mapElement, mapOptions);

    const mapMarker = {
      url: "img/icon-map-marker.svg",
      size: new google.maps.Size(36, 36),
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 18)
    };

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(59.936287, 30.321047),
      map: map,
      optimized: false,
      icon: mapMarker
    });

    map_resize();
  };

  google.maps.event.addDomListener(window, "load", init);
  google.maps.event.addDomListener(window, "resize", map_resize);
}
