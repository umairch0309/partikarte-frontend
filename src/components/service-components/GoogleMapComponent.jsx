import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const GoogleMapComponent = ({ setShowMap, styleOptions }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyA07lD6jhIN2OwvpX1cXsj5NAiN3T5pDjk",
  });

  const mapContainerStyle = styleOptions;
  const center = {
    lat: 48.1121925, // Example latitude
    lng: 17.0935551, // Example longitude
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  } else {
    setShowMap(true);
  }

  return (
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
  );
};

export default GoogleMapComponent;
