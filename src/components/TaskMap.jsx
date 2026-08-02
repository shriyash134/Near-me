import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

export default function TaskMap({ latitude, longitude }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom: 14,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Customer Marker
      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);

      // Get Helper Location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const helperLatitude = position.coords.latitude;
            const helperLongitude = position.coords.longitude;

            // Helper Marker
            new mapboxgl.Marker({ color: "green" })
              .setLngLat([helperLongitude, helperLatitude])
              .addTo(map);

            // Directions API
            const response = await axios.get(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${helperLongitude},${helperLatitude};${longitude},${latitude}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
            );

            const route = response.data.routes[0];

            // Remove existing route if present
            if (map.getLayer("route")) {
              map.removeLayer("route");
            }

            if (map.getSource("route")) {
              map.removeSource("route");
            }

            // Add Route Source
            map.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
              },
            });

            // Draw Route
            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#2563eb",
                "line-width": 5,
              },
            });

            // Fit both markers
            const bounds = new mapboxgl.LngLatBounds();

            bounds.extend([helperLongitude, helperLatitude]);
            bounds.extend([longitude, latitude]);

            map.fitBounds(bounds, {
              padding: 80,
            });

            console.log(
              `Distance: ${(route.distance / 1000).toFixed(2)} km`
            );
            console.log(
              `ETA: ${Math.ceil(route.duration / 60)} min`
            );
          } catch (err) {
            console.log(err);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "10px",
      }}
    />
  );
}