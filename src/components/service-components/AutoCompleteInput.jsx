import React, { useEffect, useRef } from "react";

const GOOGLE_MAPS_SCRIPT_ID = "partikarte-google-maps-places";
const GOOGLE_MAPS_API_KEY = "AIzaSyA07lD6jhIN2OwvpX1cXsj5NAiN3T5pDjk";

let googleMapsLoaderPromise = null;

function loadGoogleMapsPlaces() {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsLoaderPromise) {
    return googleMapsLoaderPromise;
  }

  googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google));
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps"))
      );
      if (window.google?.maps?.places) {
        resolve(window.google);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  }).catch((error) => {
    googleMapsLoaderPromise = null;
    throw error;
  });

  return googleMapsLoaderPromise;
}

const AutocompleteInput = ({
  onPlaceSelect,
  name,
  placeholder,
  id,
  onBlur,
  onChange,
  value,
}) => {
  const inputRef = useRef(null);
  const onPlaceSelectRef = useRef(onPlaceSelect);

  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  useEffect(() => {
    let autocomplete;
    let listener;
    let cancelled = false;

    const initAutocomplete = async () => {
      try {
        await loadGoogleMapsPlaces();
        if (cancelled || !inputRef.current || !window.google?.maps?.places) {
          return;
        }

        autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: [
              "address_components",
              "geometry.location",
              "place_id",
              "formatted_address",
              "name",
            ],
          }
        );

        listener = autocomplete.addListener("place_changed", () => {
          try {
            const selectedPlace = autocomplete.getPlace();
            const addressComponents = selectedPlace?.address_components || [];

            const country =
              addressComponents.find((comp) => comp.types.includes("country"))
                ?.long_name || "";
            const countryShort =
              addressComponents.find((comp) => comp.types.includes("country"))
                ?.short_name || "";
            const city =
              addressComponents.find(
                (comp) =>
                  comp.types.includes("locality") ||
                  comp.types.includes("administrative_area_level_2")
              )?.long_name || "";
            const postalCode =
              addressComponents.find((comp) =>
                comp.types.includes("postal_code")
              )?.long_name || "";

            onPlaceSelectRef.current?.({
              formatted_address: `${selectedPlace.name || ""}${
                selectedPlace.name ? ", " : ""
              }${selectedPlace.formatted_address || ""}`.trim(),
              country,
              city,
              postal_code: postalCode,
              lat: selectedPlace.geometry?.location?.lat?.() ?? "",
              lng: selectedPlace.geometry?.location?.lng?.() ?? "",
              countryShort,
            });
          } catch (error) {
            console.error("Error selecting place:", error);
          }
        });
      } catch (error) {
        console.error("Google Places autocomplete unavailable:", error);
      }
    };

    initAutocomplete();

    return () => {
      cancelled = true;
      if (listener) {
        window.google?.maps?.event?.removeListener?.(listener);
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      name={name}
      placeholder={placeholder}
      id={id}
      onBlur={onBlur}
      value={value}
      onChange={onChange}
      autoComplete="off"
    />
  );
};

export default AutocompleteInput;
