import React, { useState } from "react";
import "./CustomizeTickets.scss";
import AutocompleteInput from "../../service-components/AutoCompleteInput";

const CustomizeTickets = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  return (
    <div>
      <h1>World Location Autocomplete</h1>
      <AutocompleteInput onPlaceSelect={handlePlaceSelect} />
      {selectedPlace && (
        <div>
          <h2>Selected Place Details</h2>
          <p>Name: {selectedPlace.formatted_address}</p>
          <p>Country: {selectedPlace.country}</p>
          <p>City: {selectedPlace.city}</p>
          <p>Postal Code: {selectedPlace.postal_code}</p>
          <p>Latitude: {selectedPlace.lat}</p>
          <p>Longitude: {selectedPlace.lng}</p>
        </div>
      )}
    </div>
  );
};

export default CustomizeTickets;
