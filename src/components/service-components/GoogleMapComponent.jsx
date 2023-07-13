import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "308px",
  height: "296px",
  padding: "10px",
  borderRadius: "10px",
};
const center = {
  lat: 48.1121925, // Example latitude
  lng: 17.0935551, // Example longitude
};

const GoogleMapComponent = ({ setShowMap }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAg25x-ZN6uZgRQVl3EoVENwfS0IGhGKBw",
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  } else {
    setShowMap(true);
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={{
          disableDefaultUI: true, // Disable default controls
          // zoomControl: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
